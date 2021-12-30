define([
    "knockout",
  "jquery",
    "ojL10n!lzn/gamma/resources/nls/application-dashboard-view",
  "ojs/ojaccordion",
  "ojs/ojcollapsible",
  "ojs/ojradioset"
], function(ko, $, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.pendingActionList = ko.observableArray([]);
    self.request = $.extend({}, self.baseRequest);

    self.viewList = ko.observableArray([{
        viewSectionName: self.resource.applications
      },
      {
        viewSectionName: self.resource.statusHistory
      }
    ]);

    if (self.productClassName() === "LOANS") {
      rootParams.baseModel.registerComponent("app-tracker-documents", "application-tracking");
      rootParams.baseModel.registerComponent("app-tracker-offer", "application-tracking");
    }
  };
});