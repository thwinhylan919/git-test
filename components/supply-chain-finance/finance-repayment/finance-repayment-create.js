define([
  "knockout",
  "./model",
  "ojs/ojcore",
  "ojL10n!resources/nls/finance-repayment-create",
  "ojs/ojswitch",
  "ojs/ojcheckboxset",
  "ojs/ojvalidationgroup",
  "ojs/ojselectcombobox",
  "ojs/ojpopup",
  "ojs/ojtable",
  "ojs/ojlistview",
  "ojs/ojarraytabledatasource",
  "ojs/ojlabel",
  "ojs/ojpagingdataproviderview",
  "ojs/ojpagingtabledatasource"
], function (ko, FinanceRepaymentModel, oj, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel || params.rootModel.previousState);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.title);
    params.baseModel.registerTransaction("finance-repayment", "supply-chain-finance");
    params.baseModel.registerElement("account-input");

    self.taskCode = "VAMA_I_VAS";
    self.debitTxnsAllowedValue = ko.observable();
    self.currencyLoaded = ko.observable(false);
    self.ShowbalAvailabilityOptions = ko.observable(false);
    self.correspondenceAddress = ko.observableArray();
    self.financeStatus = ko.observable();
    self.financeStatusList = ko.observableArray();
    self.financeDataLoaded = ko.observable(false);
    self.additionalDetails = ko.observable({});
    self.realCustomerName = params.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName;
    self.financeSearchResult = ko.observableArray();
    self.selectedFinances = [];
    self.selectedFinancesTemp = [];

    self.allCheck = ko.observableArray();
    self.financeList = ko.observableArray();

    FinanceRepaymentModel.financeSearchGet().then(function (response) {
      self.financeList(response.finances);

      FinanceRepaymentModel.financeStatusget().then(function (statuses) {

        for (let i = 0; i < statuses.enumRepresentations[0].data.length; i++) {
          self.financeStatusList().push({
            description: statuses.enumRepresentations[0].data[i].description,
            code: statuses.enumRepresentations[0].data[i].code
          });
        }

        if (response.finances) {
          for (let i = 0; i < response.finances.length; i++) {
            if (response.finances[i].amounts) {
              for (let j = 0; j < response.finances[i].amounts.length; j++) {
                if (response.finances[i].amounts[j].type === "OUTSTANDING") {
                  response.finances[i].outstandingAmount = response.finances[i].amounts[j].totalAmount ? response.finances[i].amounts[j].totalAmount : "-";
                } else if (response.finances[i].amounts[j].type === "REPAID") {
                  response.finances[i].repaidAmount = response.finances[i].amounts[j].totalAmount ? response.finances[i].amounts[j].totalAmount : "-";
                }
              }
            }

            if (response.finances[i].status) {
              for (let i = 0; i < self.financeStatusList().length; i++) {
                if (self.financeStatusList()[i].code === response.finances[i].status) {
                  response.finances[i].statusDescription = self.financeStatusList()[i].description;
                }
              }
            }
          }

          self.financeSearchResult(response.finances);
          self.financeDataLoaded(true);
        }

        ko.tasks.runEarly();

      });
    });

    self.dataSource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.financeSearchResult, {
      idAttribute: "id"
    }));

    self.selectFinanceListner = function (event) {
      if (event.detail.value[0]) {
        self.selectedFinancesTemp.push(event.detail.value[0]);

      } else if (event.detail.previousValue[0]) {
        self.selectedFinancesTemp.splice(self.selectedFinancesTemp.indexOf(event.detail.value[0]), 1);
      }
    };

    self.selectAllListener = function (event) {
      if (event.detail.value[0]) {
        self.allCheck.push("all");
        self.selectedFinances = self.financeList();
      } else if (event.detail.previousValue[0]) {

        self.selectedFinances = [];
        self.allCheck([]);
      }
    };

    self.submit = function () {

      if (self.allCheck()[0] !== "all") {
        for (let i = 0; i < self.selectedFinancesTemp.length; i++) {
          for (let j = 0; j < self.financeList().length; j++) {
            if (self.selectedFinancesTemp[i] === self.financeList()[j].id) {
              self.selectedFinances.push(self.financeList()[i]);
            }
          }
        }
      }

      const tracker = document.getElementById("tracker");

      if (tracker.valid === "valid") {

        params.dashboard.loadComponent("review-finance-repayment", {
          FinanceRepaymentDTO: self.selectedFinances,
          mode: "review"
        });
      }
    };

  };
});