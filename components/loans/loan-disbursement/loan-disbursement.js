define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
    "ojL10n!resources/nls/loan-disbursement",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojlistview"
], function(oj, ko, $, ViewLoansDisbursementModel, locale) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.locale = locale;

    rootParams.dashboard.headerName(self.locale.disbursement.disbursementDetails);
    rootParams.baseModel.setwebhelpID("loans-disbursement");
    self.disbursementData = ko.observableArray();
    self.loanDetails = ko.observable();
    self.accountNumberSelected = ko.observable();
    self.additionalDetails = ko.observable();
    self.detailsFetched = ko.observable(false);
    rootParams.baseModel.registerElement("date-box");
    rootParams.baseModel.registerComponent("account-nickname", "accounts");
    rootParams.baseModel.registerElement("page-section");
    rootParams.baseModel.registerElement("row");
    rootParams.baseModel.registerElement("account-input");

    self.getItemInitialDisplay = function(index) {
      return index < 3 ? "" : "none";
    };

    self.datasource = new oj.ArrayTableDataSource(self.disbursementData, {
      idAttribute: "id"
    });

    self.mainFunction = function(accountNumber, fireAccountRead) {
      $.when(ViewLoansDisbursementModel.fetchDisbursementInfo(accountNumber), fireAccountRead ? ViewLoansDisbursementModel.fetchAccountRead(accountNumber) : null).done(function(disbursementData, accountDetails) {
        self.detailsFetched(false);

        if (fireAccountRead && accountDetails) {
          self.loanDetails(accountDetails.loanAccountDetails);
        } else if (!self.accountNumber) {
          self.loanDetails(self.params);
        } else {
          self.loanDetails(ko.utils.unwrapObservable(self.loanViewDetails()));
        }

        rootParams.dashboard.helpComponent.componentName("loan-disbursement");
        rootParams.dashboard.helpComponent.params(self.loanDetails());

        self.disbursementData.removeAll();

        for (let i = 0; i < disbursementData.loanDisbursementDetailsDTOs.length; i++) {
          self.disbursementData.push({
            id: disbursementData.loanDisbursementDetailsDTOs[i].accountId.value,
            date: disbursementData.loanDisbursementDetailsDTOs[i].date,
            amount: rootParams.baseModel.formatCurrency(disbursementData.loanDisbursementDetailsDTOs[i].amount.amount, self.loanDetails().approvedAmount.currency)
          });
        }

        self.detailsFetched(true);
      });
    };

    self.checkAccountDropDown = ko.computed(function() {
      if (self.accountNumberSelected()) {
        self.detailsFetched(false);

        if(self.params.id) {
          self.mainFunction(self.accountNumberSelected(), false);
        } else {
          self.mainFunction(self.accountNumberSelected(), true);
        }

        self.loanDetails("");
      }
    }, self);

    self.dispose = function() {
      self.checkAccountDropDown.dispose();
    };

    if (self.params.id) {
      self.accountNumberSelected(self.params.id.value);
    }
  };
});