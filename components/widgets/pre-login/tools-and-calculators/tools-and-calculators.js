define([
  "knockout",

  "ojL10n!resources/nls/tools-and-calculators"
], function (ko, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    rootParams.baseModel.registerComponent("td-calculator", "widgets/calculators");
    rootParams.baseModel.registerComponent("loan-calculator", "widgets/calculators");
    rootParams.baseModel.registerComponent("loan-eligibility-calculator", "widgets/calculators");
    rootParams.baseModel.registerComponent("forex-calculator", "widgets/calculators");
    rootParams.baseModel.registerComponent("product-header-text", "widgets/pre-login");

    if (!rootParams.dashboard.isDashboard()) {
      rootParams.dashboard.headerName(self.nls.toolCalc.labels.toolHeading);
    }

    self.openCal = function (data) {
      rootParams.dashboard.loadComponent(data.id, {});
    };

    self.toolsData = [{
        icons: "icons icon-loans",
        blueTxt: self.nls.toolCalc.blueTxt.loan,
        id: "loan-calculator"
      },
      {
        icons: "icons icon-request-money",
        blueTxt: self.nls.toolCalc.blueTxt.termDeposit,
        id: "td-calculator"
      },
      {
        icons: "icons icon-eligibility",
        blueTxt: self.nls.toolCalc.blueTxt.eligibility,
        id: "loan-eligibility-calculator"
      },
      {
        icons: "icons icon-foreign-exchange",
        blueTxt: self.nls.toolCalc.blueTxt.FECalculator,
        id: "forex-calculator"
      }
    ];
  };
});