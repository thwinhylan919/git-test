define([
    "knockout",
    "./model",
    "ojL10n!lzn/alpha/resources/nls/loan-account-summary",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojinputnumber"
], function(ko, accountSummaryModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.validationTracker = ko.observable();
    self.accountSummaryInfoLoaded = ko.observable(false);
    self.isEPIPresent = ko.observable(false);
    self.isIOIPresent = ko.observable(false);
    self.stageDetails = [];

    accountSummaryModel.fetchAccountSummary(self.applicationInfo().currentSubmissionId(), self.appDetails().applicationId.value).done(function(data) {
      self.stageDetails = data.loanAccountConfigurationDTO.accountSummary;

      if (self.getIndex(self.stageDetails, "INTEREST") >= 0) {
        self.isIOIPresent(true);
      }

      if (self.getIndex(self.stageDetails, "PRINCIPAL") >= 0) {
        self.isEPIPresent(true);
      }

      self.accountSummaryInfoLoaded(true);
    });

    self.getIndex = function(obj, key) {
      for (let i = 0; i < obj.length; i++) {
        if (obj[i].stageName === key) {
          return i;
        }
      }
    };
  };
});