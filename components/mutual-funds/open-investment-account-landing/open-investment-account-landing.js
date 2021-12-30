define([
  "knockout",
  "ojL10n!resources/nls/open-investment-account-landing",
  "./model",
  "ojs/ojbutton",
  "ojs/ojselectcombobox",
  "ojs/ojnavigationlist",
  "ojs/ojcheckboxset"
], function(ko, resourceBundle, LandingModel) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.headerText);
    params.baseModel.registerComponent("open-investment-account-train", "mutual-funds");
    self.showOpenInvestmentAccountScreen = ko.observable(true);
    self.noOfAllowedInvestmentAccounts = ko.observable(0);
    self.noOfNomineesAllowed = ko.observable();
    self.showPage = ko.observable(false);

    LandingModel.getInvestmentAccounts().done(function(data) {
      const noOfInvestmentAccounts = data.investmentAccounts.length;

      LandingModel.fetchMaintanaceDetails().done(function(data) {
        for (let i = 0; i < data.configurationDetails.length; i++) {
          if (data.configurationDetails[i].propertyId === "WM_MF_NO_OF_INVESTMENT_ACCOUNT_ALLOWED") {
            self.noOfAllowedInvestmentAccounts(parseInt(data.configurationDetails[i].propertyValue));
          }
        }

        for (let i = 0; i < data.configurationDetails.length; i++) {
          if (data.configurationDetails[i].propertyId === "WM_MF_NUMBER_OF_NOMINEE_ALLOWED") {
            self.noOfNomineesAllowed(parseInt(data.configurationDetails[i].propertyValue));
          }
        }

        if (noOfInvestmentAccounts < self.noOfAllowedInvestmentAccounts()) {
          self.showOpenInvestmentAccountScreen(true);
        } else {
          self.showOpenInvestmentAccountScreen(false);
        }

        self.showPage(true);
      });

    });

    self.showForm = function() {
      params.dashboard.loadComponent("open-investment-account-train", {
        noOfNomineesAllowed: self.noOfNomineesAllowed()
      });

    };
  };
});
