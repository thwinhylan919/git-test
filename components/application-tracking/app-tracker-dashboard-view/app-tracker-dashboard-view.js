define([
    "knockout",
      "ojL10n!resources/nls/application-dashboard-view",
  "ojs/ojaccordion",
  "ojs/ojcollapsible",
  "ojs/ojradioset"
], function(ko, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    rootParams.baseModel.registerComponent("app-tracker-documents", "application-tracking");
    rootParams.baseModel.registerComponent("account-summary", "application-tracking");
  };
});