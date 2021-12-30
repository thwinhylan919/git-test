define([
    "knockout",
    "./model",
  "ojL10n!resources/nls/customize-card",
  "ojs/ojselectcombobox",
  "ojs/ojinputtext"
], function(ko, CustomizeCardModelObject, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this,
      CustomizeCardModel = new CustomizeCardModelObject();

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.productDetails().simulationId = ko.observable("");
    self.optedForBalanceTranser = ko.observable("OPTION_NO");
    self.optedForAddOnHolder = ko.observable("OPTION_NO");
    self.isAddOnHolder = ko.observable(false);
    rootParams.baseModel.registerComponent("card-addon", "origination");
    rootParams.baseModel.registerComponent("card-balance-transfer", "origination");
    self.accountDetailsLoaded = ko.observable(false);
    self.showContinue = ko.observable(true);

    if (self.applicantType === "PRIMARY") {
      self.applicantObject = ko.observable(rootParams.applicantObject);
    } else if (self.applicantType === "JOINT") {
      self.applicantObject = rootParams.applicantObject()[self.coAppCurrentIndex - 1];
      self.employmentProfileId(rootParams.empProfileIds()[0]);
    }

     if (!self.applicantObject().creditCardInfo) {
      self.applicantObject().creditCardInfo = {
        customizeCard: {
          addonCards: ko.observable(),
          balanceTransfer: ko.observable()}
      };
    }

    self.submitAccountConfig = function() {
      self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
      self.productDetails().currentStage.stages[0].isComplete=true;

    };

    CustomizeCardModel.fetchAccountDetails(self.productDetails().submissionId.value, self.productDetails().facilityId).done(function(data) {
      if (data.simulationId) {
        self.productDetails().simulationId(data.simulationId);
      }

      self.productDetails().balanceTransferDetails = {};
      self.productDetails().addonDetails = {};
      self.accountDetailsLoaded(true);

    });
  };
});