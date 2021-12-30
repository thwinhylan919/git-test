define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/loan-account-summary",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojinputnumber"
], function(ko, AccountSummaryModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.accountSummaryInfoLoaded = ko.observable(false);
    self.stageDetails = [];

    AccountSummaryModel.fetchAccountSummary(self.applicationInfo().currentSubmissionId(), self.appDetails().applicationId.value).done(function(data) {
      self.stageDetails = data.loanAccountConfigurationDTO.accountSummary;
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