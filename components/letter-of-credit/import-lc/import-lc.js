define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/view-letter-of-credit",
  "ojs/ojlistview",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojdatetimepicker",
  "ojs/ojpagingtabledatasource",
  "ojs/ojtable",
  "ojs/ojvalidation",
  "ojs/ojknockout-validation",
  "ojs/ojvalidationgroup"
], function (oj, ko, $, ImportLCModel, resourceBundle) {
  "use strict";

  const vm = function (params) {
    let i;
    const self = this,
      getNewKoModel = function () {
        const KoModel = ko.mapping.fromJS(ImportLCModel.getNewModel());

        return KoModel;
      };

    self.model = getNewKoModel().model;
    ko.utils.extend(self, params.rootModel);
    self.listImportLC = ko.observableArray();
    self.dataSourceCreated = ko.observable(false);
    self.dataSource = ko.observableArray();

    if (self.params.backView && self.params.backView()) {
      if (params.rootModel.params.list.length > 0) {
        self.listImportLC(params.rootModel.params.list);

        self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.listImportLC(), {
          idAttribute: ["lc_number"]
        })));

        self.dataSourceCreated(true);
      }

      self.model.applicantName(params.rootModel.params.applicantName);
      self.model.lcStatus = params.rootModel.params.lcStatus;
      self.model.lcNumber = params.rootModel.params.lcNumber;
      self.model.beneName = params.rootModel.params.beneName;
      self.model.fromAmount = params.rootModel.params.fromAmount;
      self.model.toAmount = params.rootModel.params.toAmount;
      self.model.status = params.rootModel.params.status;
    }

    self.validationTracker = ko.observable();
    self.selectedLC = ko.observable();
    self.applicantNameArray = ko.observableArray();
    self.letterOfCreditDetails = ko.observable();
    self.moreSearchOptions = ko.observable(false);
    self.lcimport = ko.observable();
    self.length = ko.observable();

    self.resourceBundle = resourceBundle;
    params.dashboard.headerName(self.resourceBundle.heading.importLC);
    self.showSmallScreenAvailmentsData = ko.observable();
    self.totalAmountOfAvailment = ko.observable();
    self.importLcValidGroup = ko.observable();
    self.importLcTracker = ko.observable();
    params.baseModel.registerComponent("view-letter-of-credit", "letter-of-credit");

    self.lcStatusArray = ko.observable([{
      label: self.resourceBundle.common.labels.hold,
      value: "HOLD"
    },
    {
      label: self.resourceBundle.labels.reversed,
      value: "REVERSED"
    },
    {
      label: self.resourceBundle.common.labels.active,
      value: "ACTIVE"
    },
    {
      label: self.resourceBundle.common.labels.closed,
      value: "CLOSED"
    },
    {
      label: self.resourceBundle.common.labels.cancelled,
      value: "CANCELLED"
    }
    ]);

    self.drawingStatusArray = ko.observable([{
      label: self.resourceBundle.drawingStatusArray.Partial,
      value: "PARTIAL"
    },
    {
      label: self.resourceBundle.drawingStatusArray.Full,
      value: "FULL"
    },
    {
      label: self.resourceBundle.drawingStatusArray.Undrawn,
      value: "UNDRAWN"
    },
    {
      label: self.resourceBundle.drawingStatusArray.expired,
      value: "EXPIRED"
    }
    ]);

    self.expiryStatusArray = ko.observable([{
      label: self.resourceBundle.drawingStatusArray.expired,
      value: "EXPIRED"
    },
    {
      label: self.resourceBundle.expiryStatusArray.notexpired,
      value: "NOTEXPIRED"
    }
    ]);

    self.showMoreSearchOptions = function () {
      self.moreSearchOptions(!self.moreSearchOptions());
    };

    self.hyphen = "-";

    const d = params.baseModel.getDate(),
      today = d.getFullYear() + self.hyphen + (d.getMonth() + 1) + self.hyphen + d.getDate();

    self.maxToIssueDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(d));
    self.maxFromIssueDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(d));

    self.issueDateSubscribe = self.model.issueDateto.subscribe(function () {
      if (self.model.issueDateto() !== "" && self.model.issueDateto() < today) {
        self.maxFromIssueDate(self.model.issueDateto());
      }
    });

    self.reset = function () {
      let key;

      for (key in self.model) {
        if (self.model[key]) {
          if (key !== "lcType") {
            self.model[key]("");
          }

          self.model.applicantName([]);
          self.model.lcStatus([]);
          self.model.expiryStatus([]);
          self.model.status([]);
        }
      }

      self.dataSourceCreated(false);
    };

    self.validateFromAmount = {
      validate: function (value) {
        if (isNaN(value) || value.length > 15 || value < 0) {
          throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resourceBundle.tradeFinanceErrors.common.invalidAmount));
        }

        if (self.model.toAmount()) {
          let from;

          if (params.baseModel.small()) {
            from = oj.Components.getWidgetConstructor($("#toAmountOfModel"));
          } else {
            from = oj.Components.getWidgetConstructor($("#toAmount"));
          }

          if (typeof from === "function") {
            from("validate");
          }
        }
      }
    };

    self.validateToAmount = {
      validate: function (value) {
        if (isNaN(value) || value.length > 15 || value < 0) {
          throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resourceBundle.tradeFinanceErrors.common.invalidAmount));
        }

        if (self.model.fromAmount()) {
          if (Number(value) < Number(self.model.fromAmount())) {
            throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resourceBundle.tradeFinanceErrors.common.fromToAmountMsg));
          }
        }
      }
    };

    self.showSmallScreenAvailments = function (data) {
      self.showSmallScreenAvailmentsData(data.availmentDataSource);
      self.totalAmountOfAvailment(params.baseModel.formatCurrency(data.totalAvailment.amount, data.totalAvailment.currency));
      $("#importDetailsDialog").trigger("openModal");
    };

    self.close = function () {
      $("#importDetailsDialog").hide();
    };

    self.totalAvailmentLabel = function (context) {
      const parentElement = $(context.footerContext.parentElement);

      parentElement.append(self.resourceBundle.labels.total);
    };

    self.getTotalAvailmentAmount = function (context) {
      const datasource = context.footerContext.datasource;

      if (!datasource) {
        return;
      }

      let total = 0;
      const totalRowCount = datasource.totalSize();
      let currency;
      const addAmount = function (rowNum) {
        datasource.at(rowNum).then(function (row) {
          currency = row.data.availmentAmount.currency;
          total = total + parseFloat(row.data.availmentAmount.amount);

          if (rowNum < totalRowCount - 1) {
            addAmount(rowNum + 1);
          } else {
            const parentElement = $(context.footerContext.parentElement);

            parentElement.append(params.baseModel.formatCurrency(total, currency));
          }
        });
      };

      addAmount(0);
    };

    function getImportLCs() {
      self.dataSourceCreated(false);

      let key;

      for (key in self.model) {
        if (self.model[key]) {
          if (self.model[key]() === null) { self.model[key](""); }
        }
      }

      const payload = ko.mapping.toJS(self.model);

      ImportLCModel.getImportLCs(payload).done(function (data) {
        self.listImportLC.removeAll();
        data.letterOfCreditDTOs = params.baseModel.sortLib(data.letterOfCreditDTOs, ["expiryDate"], ["desc"]);

        let availmentList = null;

        for (i = 0; i < data.letterOfCreditDTOs.length; i++) {
          availmentList = null;

          if (data.letterOfCreditDTOs[i].availments && data.letterOfCreditDTOs[i].availments.length > 0) {
            data.letterOfCreditDTOs[i].availmentsData = ko.observableArray();

            for (let j = 0; j < data.letterOfCreditDTOs[i].availments.length; j++) {

              data.letterOfCreditDTOs[i].availmentsData.push({
                availmentId: data.letterOfCreditDTOs[i].availments[j].availmentId,
                availmentDate: data.letterOfCreditDTOs[i].availments[j].availmentDate,
                description: data.letterOfCreditDTOs[i].availments[j].description ? data.letterOfCreditDTOs[i].availments[j].description : "",
                availmentAmount_field: data.letterOfCreditDTOs[i].availments[j].availmentAmount ? data.letterOfCreditDTOs[i].availments[j].availmentAmount.amount : 0,
                availmentAmount: {
                  amount: data.letterOfCreditDTOs[i].availments[j].availmentAmount.amount,
                  currency: data.letterOfCreditDTOs[i].availments[j].availmentAmount.currency
                }
              });
            }

            availmentList = new oj.ArrayTableDataSource(data.letterOfCreditDTOs[i].availmentsData, {
              idAttribute: "availmentId"
            });
          }

          self.listImportLC.push({
            beneficiary: data.letterOfCreditDTOs[i].counterPartyName,
            created_on: data.letterOfCreditDTOs[i].applicationDate,
            amount: params.baseModel.formatCurrency(data.letterOfCreditDTOs[i].amount.amount, data.letterOfCreditDTOs[i].amount.currency),
            outstanding_amount: params.baseModel.formatCurrency(data.letterOfCreditDTOs[i].outstandingAmount.amount, data.letterOfCreditDTOs[i].outstandingAmount.currency),
            expiry_date: data.letterOfCreditDTOs[i].expiryDate,
            lc_status: data.letterOfCreditDTOs[i].status,
            lc_number: data.letterOfCreditDTOs[i].id,
            created_date_field: data.letterOfCreditDTOs[i].applicationDate,
            amount_field: data.letterOfCreditDTOs[i].amount ? data.letterOfCreditDTOs[i].amount.amount : 0,
            outstanding_amount_field: data.letterOfCreditDTOs[i].outstandingAmount ? data.letterOfCreditDTOs[i].outstandingAmount.amount : 0,
            expiry_date_field: data.letterOfCreditDTOs[i].expiryDate,
            totalAvailment_field: data.letterOfCreditDTOs[i].totalAvailments ? data.letterOfCreditDTOs[i].totalAvailments : 0,
            totalAvailment: {
              amount: data.letterOfCreditDTOs[i].totalAvailments,
              currency: data.letterOfCreditDTOs[i].outstandingAmount.currency
            },
            availmentDataSource: availmentList
          });

          self.length = self.listImportLC().length;
        }

        self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.listImportLC(), {
          idAttribute: ["lc_number"]
        })));

        self.dataSourceCreated(true);
      });
    }

    if (self.applicantNameArray().length === 0) {
      ImportLCModel.fetchPartyDetails().done(function (data) {
        self.applicantNameArray.push({
          label: data.party.personalDetails.fullName,
          value: data.party.id.value
        });

        ImportLCModel.fetchPartyRelations().done(function (partyData) {
          for (i = 0; i < partyData.partyToPartyRelationship.length; i++) {
            self.applicantNameArray.push({
              label: partyData.partyToPartyRelationship[i].relatedPartyName,
              value: partyData.partyToPartyRelationship[i].relatedParty.value
            });
          }

          if (params.baseModel.small()) {
            self.model.applicantName(self.applicantNameArray()[0].value);
            getImportLCs();
          }
        });
      });
    }

    self.searchImportLC = function () {
      const tracker = document.getElementById("importLcTracker");

      if (tracker.valid === "valid") {
        getImportLCs();
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };

    self.showAvailmentDetails = function (data) {
      if (self.selectedLC() === data.lc_number) {
        self.selectedLC("");
      } else {
        self.selectedLC(data.lc_number);
      }
    };

    self.download = function () {
      let key;

      for (key in self.model) {
        if (self.model[key]) {
          if (self.model[key]() === null) { self.model[key](""); }
        }
      }

      const payload = ko.mapping.toJS(self.model);

      ImportLCModel.fetchPDF(payload);
    };

    self.onLCSelected = function (data) {
      ImportLCModel.getImportLC(data.lc_number).done(function (data) {
        const parameters = {
          mode: "VIEW",
          list: self.listImportLC(),
          letterOfCreditDetails: data.letterOfCredit,
          applicantName: self.model.applicantName,
          lcStatus: self.model.lcStatus,
          lcNumber: self.model.lcNumber,
          beneName: self.model.beneName,
          fromAmount: self.model.fromAmount,
          toAmount: self.model.toAmount,
          status: self.model.status
        };

        params.dashboard.loadComponent("view-letter-of-credit", parameters);
      });
    };

    self.getRowId = function (rowIndex) {
      return ++rowIndex;
    };

    self.templateCardSelected = function (event, ui) {
      if (ui.option === "selection") {
        const selectedIdsArray = $.map(ui.items, function (selectedListItem) {
          return selectedListItem.id;
        });

        if (selectedIdsArray && selectedIdsArray.length > 0) {
          const data = {
            templateId: selectedIdsArray[0]
          };

          self.onTemplateNameSelected(data);
        }
      }
    };

    self.openFilterModal = function () {
      $("#searchModal").trigger("openModal");
    };

    self.hideSearchModal = function () {
      $("#searchModal").hide();
    };

    self.resetFilterModel = function () {
      let key;

      for (key in self.model) {
        if (self.model[key]) {
          if (key !== "lcType") {
            self.model[key]("");
          }

          self.model.lcStatus([]);
          self.model.expiryStatus([]);
          self.model.status([]);
        }
      }

      self.model.applicantName(self.applicantNameArray()[0].value);
    };

    self.filterList = function () {
      if (!params.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }

      $("#searchModal").hide();
      getImportLCs();
    };
  };

  vm.prototype.dispose = function () {
    this.issueDateSubscribe.dispose();
  };

  return vm;
});
