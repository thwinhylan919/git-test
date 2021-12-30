define([

  "knockout",

  "./model",
  "ojL10n!resources/nls/mutual-funds-risk-profile",
  "ojs/ojbutton",
  "ojs/ojselectcombobox"
], function (ko, Model, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    self.groupValid = ko.observable();
    self.defaultRole = ko.observableArray([]);
    self.overallQuestion = ko.observable();
    params.dashboard.headerName(self.resource.riskProfileTitle);
    self.applicableRoles = ko.observable();
    self.accountNumber = ko.observableArray();
    self.accountsLoaded = ko.observable(false);

    self.investmentAccountYes = ko.observable(false);

    Model.getInvestmentAccounts().done(function (data) {
      if (data.investmentAccounts.length) {

        self.investmentAccountYes(true);

        self.investmentAccount = ko.observable({
          value: ko.observable(),
          displayValue: ko.observable(),
          name:ko.observable(),
          pattern:ko.observable()
        });

        self.valueChange = function () {
          let j;

          for (j = 0; j < self.accountNumber().length; j++) {
            if (self.accountNumber()[j].value === self.investmentAccount().value()) {
              self.investmentAccount().displayValue = self.accountNumber()[j].text;
              self.investmentAccount().name = self.accountNumber()[j].name;
              self.investmentAccount().pattern = self.accountNumber()[j].pattern;

              break;
            }
          }
        };

        for (let i = 0; i < data.investmentAccounts.length; i++) {
          self.accountNumber.push({
            text: data.investmentAccounts[i].accountId.displayValue,
            value: data.investmentAccounts[i].accountId.value,
            name: data.investmentAccounts[i].primaryHolderName,
            pattern: data.investmentAccounts[i].holdingPattern
          });
        }

        self.accountsLoaded(true);

        params.baseModel.registerComponent("risk-profile-questionnaire", "mutual-funds");

        self.showRiskProfile = function () {
          params.dashboard.loadComponent("risk-profile-questionnaire", {
            investmentAccount: self.investmentAccount()
          });
        };
      } else {
        params.baseModel.registerComponent("open-investment-account-landing", "mutual-funds");
        params.dashboard.loadComponent("open-investment-account-landing", {});
      }
    });
  };
});
