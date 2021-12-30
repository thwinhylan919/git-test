define([
    "knockout",
    "./model",
    "ojL10n!lzn/beta/resources/nls/application-insurance-view"
], function(ko, ApplicationInsuranceViewService, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.insuranceSummary = ko.observable({});
    self.dataLoaded = ko.observable(false);

    ApplicationInsuranceViewService.fetchAppInsurance(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId()).done(function(data) {
      self.insuranceSummary(data);
      self.dataLoaded(true);
    });
  };
});