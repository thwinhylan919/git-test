define([
    "knockout",
    "ojL10n!resources/nls/wearable-instructions",
  "ojs/ojbutton"
], function(ko, ResourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resourceCommon = ResourceBundle;
    self.resource = ResourceBundle[rootParams.baseModel.cordovaDevice()];
    rootParams.dashboard.headerName(self.resourceCommon.header);

    /**
     *THis this is the click handler for the proceed button.
     *@Function goTonextInstruction
     *@param {Object} baseModel - is instance of baseModel
     *@param {Object} dashboard - is instance of dashboard
     *@return {void}.
     */
    self.goTonextInstruction = function(baseModel, dashboard) {
      baseModel.registerComponent("wearable-instructions-next", "security");

      dashboard.loadComponent("wearable-instructions-next", {
        type: "wearableSetPin"
      }, self);
    };
  };
});