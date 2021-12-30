define([
    "knockout",
    "./model",
    "ojL10n!lzn/gamma/resources/nls/application-summary",
  "ojs/ojprogressbar"
], function(ko, ApplicationSummaryModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;
    let index = 0;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.dataLoaded = ko.observable(false);
    self.screensToContainThis = ko.observable(["app-tracker-dashboard"]);

    self.shouldSummaryBeShown = function() {
      for (index = 0; index < self.screensToContainThis().length; index++) {
        if (self.productTrackingComponentName() === self.screensToContainThis()[index]) {
          return true;
        }
      }

      return false;
    };

    ApplicationSummaryModel.fetchApplicationSummary(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId()).done(function(data) {
      self.appDetails(data);
      self.isSummaryLoaded(true);
      self.isSummaryResponse(true);
    });

    self.showCancelApplication(false);
    self.dataLoaded(true);
  };
});