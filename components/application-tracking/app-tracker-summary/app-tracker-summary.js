define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/application-summary",
  "ojs/ojprogressbar"
], function(ko, ApplicationSummaryModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;

    ApplicationSummaryModel.fetchApplicationSummary(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId()).done(function(data) {
      self.appDetails(data);
      self.isSummaryLoaded(true);
    });
  };
});