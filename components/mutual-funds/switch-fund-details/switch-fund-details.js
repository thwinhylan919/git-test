define([

  "knockout",

  "ojL10n!resources/nls/switch-funds-global",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojvalidationgroup",
  "ojs/ojselectcombobox",
  "ojs/ojradioset"
], function(ko, resourceBundle) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.fundDetails.pageHeader);
    self.switchTypesLoaded = ko.observable(false);
    params.baseModel.registerComponent("fund-information", "mutual-funds");
    params.baseModel.registerComponent("fund-info-bar", "mutual-funds");
    self.refresh = ko.observable(true);
    self.purchaseRefreshed = ko.observable(true);

    let i;

    self.switchTypes = function() {
      self.switchTypeData().splice(0, self.switchTypeData().length);

      const switchTypeResponse = [{
          label: self.resource.fundDetails.onetime,
          code: "ONE_TIME"
        },
        {
          label: self.resource.fundDetails.stpLabel,
          code: "STP"
        },
        {
          label: self.resource.fundDetails.pstpLabel,
          code: "PSTP"
        }
      ];

      for (i = 0; i < switchTypeResponse.length; i++) {
        self.switchTypeData.push({
          label: switchTypeResponse[i].label,
          code: switchTypeResponse[i].code
        });
      }

      self.switchTypesLoaded(true);
    };

    self.switchTypes();

    self.showInfoPanel = function() {
      params.dashboard.openRightPanel("fund-information", {
        schemeCode:  self.modelData.switchFund.switchOutDetails.scheme.schemeCode
      }, self.switchOutInfoScheme());
    };

    self.purchaseListener = function() {
      self.purchaseRefreshed(false);
      self.modelData.switchFund.switchOutDetails.fundHouseCode = null;
      self.modelData.switchFund.switchOutDetails.scheme.fundCategory.fundCategoryCode = null;
      self.modelData.switchFund.switchOutDetails.scheme.fundCategory.fundCategoryDesc = null;
      self.modelData.switchFund.switchOutDetails.scheme.schemeCode = null;
      self.modelData.switchFund.switchOutDetails.folioNumber = null;
      self.purchaseAmount("");
      self.suitabilityLoaded(false);
      self.isSuitableSwitchOut(false);
      ko.tasks.runEarly();
      self.purchaseRefreshed(true);
    };

    self.next = function() {
      const tracker = document.getElementById("fund-details");

      if (!params.baseModel.showComponentValidationErrors(tracker)) {
        return;
      }

      self.nextStep();
    };
  };
});
