define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/view-guarantee",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojdatetimepicker",
  "ojs/ojpagingtabledatasource",
  "ojs/ojtable",
  "ojs/ojvalidation",
  "ojs/ojknockout-validation",
  "ojs/ojlistview",
  "ojs/ojpopup",
  "ojs/ojvalidationgroup"
], function (oj, ko, $, OutwardBGModel, resourceBundle) {
  "use strict";

  const vm = function (params) {
    const self = this,
      getNewKoModel = function () {
        const KoModel = ko.mapping.fromJS(OutwardBGModel.getNewModel());

        return KoModel;
      };

    self.model = getNewKoModel().model;
    ko.utils.extend(self, params.rootModel);
    self.dataSourceCreated = ko.observable(false);
    self.listBankGuarantees = ko.observableArray();
    self.dataSource = ko.observable();

    if(self.params.backView && self.params.backView()){
      if(params.rootModel.params.list.length>0){
      self.listBankGuarantees(params.rootModel.params.list);
      self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.listBankGuarantees())));
      self.dataSourceCreated(true);
      }

      self.model.applicantName=params.rootModel.params.applicantName;
      self.model.beneName=params.rootModel.params.beneName;
      self.model.bgNumber=params.rootModel.params.bgNumber;
      self.model.bgStatus=params.rootModel.params.bgStatus;
      self.model.fromAmount=params.rootModel.params.fromAmount;
      self.model.toAmount=params.rootModel.params.toAmount;
      self.model.issueDatefrom=params.rootModel.params.issueDatefrom;
      self.model.issueDateto=params.rootModel.params.issueDateto;
    }

    self.resourceBundle = resourceBundle;
    self.beneNameArray = ko.observableArray();
    self.validationTracker = ko.observable();
    self.currencyListOptions = ko.observableArray();
    self.moreSearchOptions = ko.observable(false);

    self.selectedBG = ko.observable();
    self.claimsData=ko.observableArray();
    self.totalClaimsAmount = ko.observable();
    self.claimsDataSource = ko.observableArray();

    params.dashboard.headerName(self.resourceBundle.heading.outwardGuarantee);
    self.showSmallScreenAvailmentsData = ko.observable();
    self.totalAmountOfAvailment = ko.observable();

    self.showMoreSearchOptions = function () {
      self.moreSearchOptions(!self.moreSearchOptions());
    };

    self.outwardGuaranteeTracker = ko.observable();
    self.outwardGuaranteeValidGroup = ko.observable();
    params.baseModel.registerComponent("view-bank-guarantee", "guarantee");
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
          self.model[key]("");
          self.model.bgStatus([]);
          self.model.applicantName([]);
        }
      }

      self.dataSourceCreated(false);
    };

    self.statusArray = ko.observable([{
      label: self.resourceBundle.common.labels.active,
      value: "ACTIVE"
    },
    {
      label: self.resourceBundle.common.labels.cancelled,
      value: "CANCELLED"
    },
    {
      label: self.resourceBundle.common.labels.hold,
      value: "HOLD"
    },
    {
      label: self.resourceBundle.common.labels.reversed,
      value: "REVERSED"
    },
    {
      label: self.resourceBundle.common.labels.closed,
      value: "CLOSED"
    }
    ]);

    function getBankGuarantees() {
      self.dataSourceCreated(false);
      self.listBankGuarantees.removeAll();

      let key;

for(key in self.model) {
        if (self.model[key]) {
          if (self.model[key]() === null)
            {self.model[key]("");}
        }
      }

      const payload = ko.mapping.toJS(self.model);

      OutwardBGModel.getBankGuarantees(payload).done(function(data) {

        data.bankGuaranteeDTO = params.baseModel.sortLib(data.bankGuaranteeDTO, ["expiryDate"], ["desc"]);

        let availmentList = null;

        self.claimsDataSource(data.bankGuaranteeDTO);

        for (let i = 0; i < data.bankGuaranteeDTO.length; i++) {
          availmentList = null;

          if (data.bankGuaranteeDTO[i].claims && data.bankGuaranteeDTO[i].claims.length > 0) {
            data.bankGuaranteeDTO[i].claimsData = ko.observableArray();

            for (let j = 0; j < data.bankGuaranteeDTO[i].claims.length; j++) {

              data.bankGuaranteeDTO[i].claimsData.push({
                availmentId: data.bankGuaranteeDTO[i].claims[j].availmentId,
                availmentDate: data.bankGuaranteeDTO[i].claims[j].availmentDate,
                description: data.bankGuaranteeDTO[i].claims[j].description,
                availmentAmount_field: data.bankGuaranteeDTO[i].claims[j].availmentAmount ? data.bankGuaranteeDTO[i].claims[j].availmentAmount.amount : 0,
                availmentAmount: {
                  amount: data.bankGuaranteeDTO[i].claims[j].availmentAmount.amount,
                  currency: data.bankGuaranteeDTO[i].claims[j].availmentAmount.currency
                }
              });
            }

            availmentList = new oj.ArrayTableDataSource(data.bankGuaranteeDTO[i].claimsData, {
              idAttribute: "availmentId"
            });
          }

          self.listBankGuarantees.push({
            beneficiary: data.bankGuaranteeDTO[i].beneName,
            beneficiary_field: data.bankGuaranteeDTO[i].beneName,
            issue_date: data.bankGuaranteeDTO[i].issueDate,
            amount: params.baseModel.formatCurrency(data.bankGuaranteeDTO[i].contractAmount.amount, data.bankGuaranteeDTO[i].contractAmount.currency),
            outstanding_amount: params.baseModel.formatCurrency(data.bankGuaranteeDTO[i].guaranteeAmount.amount, data.bankGuaranteeDTO[i].guaranteeAmount.currency),
            expiry_date: data.bankGuaranteeDTO[i].expiryDate,
            bg_status: data.bankGuaranteeDTO[i].guaranteeStatus,
            bg_number: data.bankGuaranteeDTO[i].bgId,
            issue_date_field: data.bankGuaranteeDTO[i].issueDate,
            amount_field: data.bankGuaranteeDTO[i].contractAmount ? data.bankGuaranteeDTO[i].contractAmount.amount : 0,
            outstanding_amount_field: data.bankGuaranteeDTO[i].guaranteeAmount ? data.bankGuaranteeDTO[i].guaranteeAmount.amount : 0,
            expiry_date_field: data.bankGuaranteeDTO[i].expiryDate,
            totalAvailment_field: data.bankGuaranteeDTO[i].totalClaims ? data.bankGuaranteeDTO[i].totalClaims : 0,
            totalAvailment: {
              amount: data.bankGuaranteeDTO[i].totalClaims,
              currency: data.bankGuaranteeDTO[i].guaranteeAmount.currency
            },
            availmentDataSource: availmentList
          });
        }

        self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.listBankGuarantees())));
        self.dataSourceCreated(true);
      });
    }

    self.searchBankGuarantee = function () {
      const tracker = document.getElementById("outwardGuaranteeTracker");

      if (tracker.valid === "valid") {
        getBankGuarantees();
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };

    self.totalAvailmentLabel = function (context) {
      const parentElement = $(context.footerContext.parentElement);

      parentElement.append(self.resourceBundle.labels.total);
    };

    self.onBGSelected = function (data) {
      OutwardBGModel.getBGDetails(data.bg_number).done(function (data) {
        const parameters = {
          mode: "VIEW",
          guaranteeDetails: data.bankGuarantee,
          list:self.listBankGuarantees(),
          guaranteeTransactionType: "OUTWARD",
          applicantName:self.model.applicantName,
          beneName:self.model.beneName,
          bgNumber:self.model.bgNumber,
          bgStatus:self.model.bgStatus,
          fromAmount:self.model.fromAmount,
          toAmount:self.model.toAmount,
          issueDatefrom:self.model.issueDatefrom,
          issueDateto:self.model.issueDateto
        };

        params.dashboard.loadComponent("view-bank-guarantee", parameters);
      });
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

    self.download = function () {
      let key;

      for (key in self.model) {
        if (self.model[key]) {
          if (self.model[key]() === null) { self.model[key](""); }
        }
      }

      const payload = ko.mapping.toJS(self.model);

      OutwardBGModel.fetchPDF(payload);
    };

    self.showAvailmentDetails = function(event) {
     const popup = document.querySelector("#claim-details");

        if (popup.isOpen()) {
            popup.close();
      } else {
        let totalAmount = 0;

        for (let i = 0; i < self.claimsDataSource().length; i++) {
            if (event.bg_number === self.claimsDataSource()[i].bgId) {
                self.claimsData.removeAll();

                for (let j = 0; j < self.claimsDataSource()[i].claims.length; j++) {
                    self.claimsData.push({
                        availmentId: self.claimsDataSource()[i].claims[j].availmentId,
                        claimDate: self.claimsDataSource()[i].claims[j].availmentDate,
                        description: self.claimsDataSource()[i].claims[j].description,
                        claimAmount: params.baseModel.formatCurrency(self.claimsDataSource()[i].claims[j].availmentAmount.amount, self.claimsDataSource()[i].claims[j].availmentAmount.currency)
                    });

                    totalAmount = totalAmount + self.claimsDataSource()[i].claims[j].availmentAmount.amount;
                }
            }
        }

        self.totalClaimsAmount(totalAmount);
        popup.open();
      }
    };

    self.dataSourceclaims = new oj.ArrayTableDataSource(self.claimsData, { idAttribute: "availmentId" });

    if (self.beneNameArray().length === 0) {
      OutwardBGModel.fetchPartyDetails().done(function (data) {
        self.beneNameArray.push({
          label: data.party.personalDetails.fullName,
          value: data.party.id.value
        });

        OutwardBGModel.fetchPartyRelations().done(function (partyData) {
          for (let i = 0; i < partyData.partyToPartyRelationship.length; i++) {
            self.beneNameArray.push({
              label: partyData.partyToPartyRelationship[i].relatedPartyName,
              value: partyData.partyToPartyRelationship[i].relatedParty.value
            });
          }

          if (params.baseModel.small()) {
            self.model.applicantName(self.beneNameArray()[0].value);
            getBankGuarantees();
          }
        });
      });
    }

    self.showSmallScreenAvailments = function (data) {
      self.showSmallScreenAvailmentsData(data.availmentDataSource);
      self.totalAmountOfAvailment(params.baseModel.formatCurrency(data.totalAvailment.amount, data.totalAvailment.currency));
      $("#bgDetailsDialog").trigger("openModal");
    };

    self.close = function () {
      $("#bgDetailsDialog").hide();
    };

    self.validateFromAmount = {
      validate: function (value) {
        if (isNaN(value) || value.length > 15 || value < 0) {
          throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resourceBundle.tradeFinanceErrors.common.invalidAmount));
        }

        if (self.model.toAmount()) {
          let from;

          if (params.baseModel.small()) {
            from = oj.Components.getWidgetConstructor($("#modalToAmount"));
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
          self.model[key]("");
          self.model.bgStatus([]);
        }
      }

      self.model.applicantName(self.beneNameArray()[0].value);
    };

    self.filterList = function () {
      if (!params.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }

      $("#searchModal").hide();
      getBankGuarantees();
    };
  };

  vm.prototype.dispose = function () {
    this.issueDateSubscribe.dispose();
  };

  return vm;
});
