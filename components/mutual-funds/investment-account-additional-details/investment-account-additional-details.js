define([

  "knockout",

  "ojL10n!resources/nls/investment-account-additional-details",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojtrain",
  "ojs/ojselectcombobox",
  "ojs/ojvalidationgroup",
  "ojs/ojgauge",
  "ojs/ojselectcombobox"
], function(ko, resourceBundle) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.openAccountHeader);
    params.baseModel.registerComponent("investment-account-relatives", "mutual-funds");
    params.baseModel.registerComponent("investment-account-primary-asset", "mutual-funds");
    params.baseModel.registerComponent("investment-account-primary-liabilities", "mutual-funds");
    params.baseModel.registerComponent("investment-account-investments", "mutual-funds");
    params.baseModel.registerComponent("investment-account-review", "mutual-funds");

    self.dummyModal = {
      additionalDetails: {
        assets: [],
        liability: [],
        investments: [],
        relatives: []
      }
    };

    self.uiOptions = {
      menuFloat: "left",
      fullWidth: false,
      defaultOption: self.selectedComponent
    };

    self.menuOptions = ko.observableArray([{
        id: "investment-account-primary-asset",
        label: self.resource.primaryAsset
      },
      {
        id: "investment-account-primary-liabilities",
        label: self.resource.primaryLiabilities
      },
      {
        id: "investment-account-investments",
        label: self.resource.investments
      },
      {
        id: "investment-account-relatives",
        label: self.resource.relatives
      }
    ]);

    self.loadReview = function() {
      self.globalLoaded(false);
      ko.tasks.runEarly();

      params.dashboard.loadComponent("investment-account-review", {
        openInvestmentAccountData: self.openInvestmentAccountData(),
        showAdditionalDetailsSection: self.showAdditionalDetailsSection(),
        stepArray: self.stepArray()
      });

      self.globalLoaded(true);
    };

  };
});
