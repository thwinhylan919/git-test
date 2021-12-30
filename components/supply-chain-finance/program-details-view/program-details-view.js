define([
  "./model",
  "ojL10n!resources/nls/program-details-view",
  "knockout",
  "ojs/ojcore",
  "ojs/ojformlayout",
  "ojs/ojvalidationgroup",
  "ojs/ojselectcombobox",
  "ojs/ojbutton",
  "ojs/ojvalidation-number",
  "ojs/ojtable",
  "ojs/ojlistview",
  "ojs/ojpagingcontrol",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingtabledatasource",
  "ojs/ojchart"
], function (Model, resourceBundle, ko, oj) {
  "use strict";

  return function (params) {
    const self = this;

    self.nls = resourceBundle;
    params.dashboard.headerName(self.nls.componentHeader);
    self.programDetails = ko.observable();
    self.otherDetails = ko.observable();
    self.buttonRole = ko.observable();
    self.partyDetails = ko.observable();
    self.selectedRole = ko.observable(params.rootModel.params.selectedRole);
    self.programCode = ko.observable(params.rootModel.params.programId);
    self.showPage = ko.observable(false);
    self.partyName = ko.observable();
    self.partyId = ko.observable();
    self.pieGroupsValue = ko.observable();
    self.pieSeriesValue = ko.observable();
    self.numberformatter = ko.observable();
    self.tableData = ko.observableArray();
    self.counterPartyList = ko.observableArray();
    self.cpCount = ko.observable();
    self.counterPartyHeading = ko.observable();
    self.showGraph = ko.observable(false);
    self.isTableLoaded = ko.observable(false);
    self.disbursementModeValue = ko.observable();
    self.disbursementModeLoaded = ko.observable(false);

    self.styleDefaults = ko.observable({
      maxBarWidth: 30,
      dataLabelPosition: "outsideBarEdge",
      dataLabelStyle: {
        fontSize: "13px"
      }
    });

    self.queryParameter = ko.observable({
      criteria: []
    });

    self.sortByParameter = ko.observableArray();
    self.count = ko.observable();
    self.grouping = ko.observable("AssociatedParty");
    self.groupingExtra = ko.observable("AssociatedParty,Currency");

    const converterFactory = oj.Validation.converterFactory("number");

    let currencyConverter;

    const invoiceStatusArray = [],
      paymentStausArray = [],

      accounts = [],
      moneyValue = [],

      barGraphValues = [{
        name: "",
        items: moneyValue
      }];

    params.baseModel.registerComponent("view-program-search", "supply-chain-finance");
    params.baseModel.registerComponent("program-management-global", "supply-chain-finance");
    params.baseModel.registerComponent("view-invoice", "supply-chain-finance");
    params.baseModel.registerComponent("view-associated-party-details", "supply-chain-finance");

    Model.mepartyget().then(function (response) {
      self.partyDetails(response);
      self.partyId(self.partyDetails().party.id.displayValue);
      self.partyName(self.partyDetails().party.personalDetails.fullName);
    });

    const jsonDataRole = self.nls.Role,
      jsonDataRelation = self.nls.Relation;

    self.getUserRole = function (relation, role) {
      return params.baseModel.format(self.nls.userRoleToDisplay, {
        userRelation: jsonDataRelation[relation] ? jsonDataRelation[relation] : "-",
        userRole: jsonDataRole[role] ? jsonDataRole[role] : "-"
      });
    };

    self.convertStatus = function (status) {
      const jsonDataStatus = self.nls.Status;

      return jsonDataStatus[status] ? jsonDataStatus[status] : jsonDataStatus.OTHERS;
    };

    Model.programGet(self.programCode(), self.selectedRole()).then(function (response) {
      if (response.program) {
        self.programDetails(response.program);
        self.programDetails().noOfAssociatedParties = self.programDetails().associatedParties.length;
        self.programDetails().statusDesc = self.convertStatus(self.programDetails().status);
        self.programDetails().userRole = self.getUserRole(self.programDetails().relation, self.programDetails().role);
        self.showPage(true);
      }

      if (self.showPage()) {
        const jsonDataInvoiceStatus = self.nls.InvoiceStatus,
          jsonDataPaymentStatus = self.nls.PaymentStatus;

        Object.keys(jsonDataInvoiceStatus).forEach(function (key) {
          invoiceStatusArray.push(key);
        });

        Object.keys(jsonDataPaymentStatus).forEach(function (key) {
          paymentStausArray.push(key);
        });

        self.queryParameter().criteria.push({
          operand: "program.role",
          operator: "ENUM",
          value: [self.selectedRole()]
        }, {
          operand: "invoiceStatus",
          operator: "IN",
          value: invoiceStatusArray
        }, {
          operand: "paymentStatus",
          operator: "IN",
          value: paymentStausArray
        }, {
          operand: "program.programKey.programCode",
          operator: "EQUALS",
          value: [self.programCode()]
        });

        self.sortByParameter().push({
          sortBy: "amount",
          sortOrder: "DESC"
        });

        self.count(10);

        let i, j, associatedPartyDetails;

        Promise.all([
          Model.invoiceget(self.grouping(), JSON.stringify(self.queryParameter()), JSON.stringify(self.sortByParameter()), self.count()),
          Model.invoiceget(self.groupingExtra(), JSON.stringify(self.queryParameter()))
        ])
          .then(function (response) {
            if (response[0] && response[0].aggregatedData) {

              self.otherDetails(response[0].aggregatedData);

              if (self.otherDetails().groups.length >= 10) {
                self.cpCount(self.count());
                self.counterPartyHeading(self.nls.heading.TopCounterparties);
              } else {
                self.counterPartyHeading(self.nls.heading.TopCounterparty);
              }

              if (self.otherDetails().resource && self.otherDetails().groups && self.otherDetails().groups.length > 0) {

                for (i = 0; i < self.otherDetails().groups.length; i++) {

                  if (self.otherDetails().groups[i] && self.otherDetails().groups[i].intervals) {
                    associatedPartyDetails = self.otherDetails().groups[i].id.split("~");

                    for (j = 0; j < self.otherDetails().groups[i].intervals.length; j++) {
                      self.counterPartyList.push({
                        code: associatedPartyDetails[0],
                        value: associatedPartyDetails[2],
                        codeDisplayValue: associatedPartyDetails[1],
                        money: self.otherDetails().groups[i].intervals[j].amount.amount,
                        localCurrency: self.otherDetails().groups[i].intervals[j].amount.currency
                      });
                    }
                  }
                }

                for (i = 0; i < self.counterPartyList().length; i++) {
                  accounts.push(self.counterPartyList()[i].value);

                  moneyValue.push({
                    value: self.counterPartyList()[i].money,
                    label: self.counterPartyList()[i].money
                  });
                }

                barGraphValues[0].items = moneyValue;

                currencyConverter = converterFactory.createConverter({
                  style: "currency",
                  currency: self.counterPartyList()[0].localCurrency
                });
              }
            }

            self.numberformatter(currencyConverter);
            self.pieSeriesValue(barGraphValues);
            self.pieGroupsValue(accounts);
            self.showGraph(true);

            if (response[1] && response[1].aggregatedData) {

              let partyRole = "";

              if (jsonDataRelation[self.programDetails().relation] && jsonDataRole[self.programDetails().role]) {
                if (jsonDataRelation[self.programDetails().relation] === jsonDataRelation.A) {
                  partyRole = partyRole.concat(jsonDataRelation.CP);
                } else {
                  partyRole = partyRole.concat(jsonDataRelation.A);
                }

                partyRole = partyRole.concat("-");

                if (jsonDataRole[self.programDetails().role] === jsonDataRole.B) {
                  partyRole = partyRole.concat(jsonDataRole.S);
                } else {
                  partyRole = partyRole.concat(jsonDataRole.B);
                }
              } else {
                partyRole = "-";
              }

              self.otherDetails(response[1].aggregatedData);

              if (self.otherDetails().resource && self.otherDetails().groups && self.otherDetails().groups.length > 0) {

                for (i = 0; i < self.otherDetails().groups.length; i++) {

                  if (self.otherDetails().groups[i] && self.otherDetails().groups[i].intervals) {
                    associatedPartyDetails = self.otherDetails().groups[i].identifiers[0].split("~");

                    for (j = 0; j < self.otherDetails().groups[i].intervals.length; j++) {
                      self.tableData.push({
                        partyNameAndId: associatedPartyDetails[2],
                        partyId: associatedPartyDetails[0],
                        partyIdDisplayValue: associatedPartyDetails[1],
                        partyRole: partyRole,
                        invoices: self.otherDetails().groups[i].intervals[j].count,
                        invoiceValue: self.otherDetails().groups[i].intervals[j].amount.amount,
                        invoiceCurrency: self.otherDetails().groups[i].identifiers[1],
                        status: self.nls.Status.ACTIVE,
                        tableId: Math.floor((Math.random() * 10000) + 1)
                      });
                    }

                    if (self.programDetails().associatedParties) {
                      for (let k = 0; k < self.programDetails().associatedParties.length; k++) {
                        if (self.programDetails().associatedParties[k].id.value === associatedPartyDetails[0]) {
                          self.programDetails().associatedParties[k].outstandingInvoice = true;
                        }
                      }
                    }

                  }
                }
              }
            }

            self.isTableLoaded(true);
          });

        if (self.programDetails().autoFinance) {
          Model.disbursementModeGet().then(function (response) {
            for (let i = 0; i < response.jsonNode.ScfApplicationParamModelKeyCollection[0].ScfApplicationParamKeyModel.length; i++) {
              if (self.programDetails().disbursementMode === response.jsonNode.ScfApplicationParamModelKeyCollection[0].ScfApplicationParamKeyModel[i].code) {
                self.disbursementModeValue(response.jsonNode.ScfApplicationParamModelKeyCollection[0].ScfApplicationParamKeyModel[i].description);
              }
            }

            self.disbursementModeLoaded(true);
          });
        }
      }
    });

    self.onClickGoToInvoices = function (event) {
      params.dashboard.loadComponent("view-invoice", {
        programCode: self.programCode(),
        currency: event.invoiceCurrency,
        showOutstanding: true,
        spokeId: event.partyId,
        role: self.selectedRole(),
        invoiceStatusArray: invoiceStatusArray,
        paymentStausArray: paymentStausArray
      });
    };

    self.onClickGoToPartyDetails = function (event) {
      const partyRelation = event.partyRole.split("-");
      let relation = "";

      if (partyRelation[0] === jsonDataRelation.A) {
        relation = "ANCHOR";
      } else {
        relation = "COUNTER_PARTY";
      }

      params.dashboard.loadComponent("view-associated-party-details", {
        partyId: event.partyId,
        relation: relation,
        buttonRole: self.selectedRole()
      });
    };

    self.dataSource15 = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.tableData, {
      idAttribute: "tableId"
    }));

    self.onClickEdit = function () {
      params.dashboard.loadComponent("program-management-global", self);
    };

    self.onClickBack = function () {
      params.dashboard.hideDetails();
    };

    self.onClickCancel = function () {
      params.dashboard.switchModule();
    };
  };
});