define([
    "knockout",
    "ojL10n!resources/nls/wearable-instructions-next",
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
     *@Function goToWearableSetPinviaSecuritySettings
     *@param {Object} baseModel - is instance of baseModel
     *@param {Object} dashboard - is instance of dashboard
     *@return {void}.
     */
    self.goToWearableSetPinviaSecuritySettings = function(baseModel, dashboard) {
      window.Wearable.onConnect(function() {
        baseModel.registerComponent("security-landing", "security");

        dashboard.loadComponent("security-landing", {
          type: "wearableSetPin"
        }, self);
      }, function(error) {
        baseModel.showMessages(null, [self.resourceCommon.error[error]], "ERROR");
      });
    };
  };
});