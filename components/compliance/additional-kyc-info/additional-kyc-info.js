define([

  "knockout",

  "./model",

  "ojL10n!resources/nls/compliance",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojradioset",
  "ojs/ojvalidationgroup"
], function(ko, AdditionalKycModel, ResourceBundle) {
  "use strict";

  return function(Params) {
    const self = this;

    ko.utils.extend(self, Params.rootModel);
    self.resource = ResourceBundle;
    self.index = Params.index;
    self.kycDataLoaded = ko.observable(false);

    self.continueKYCInfo = function() {
      const kycInfoTracker = document.getElementById("kycInfoTracker");

      if (kycInfoTracker && kycInfoTracker.valid !== "valid") {
        kycInfoTracker.showMessages();
        kycInfoTracker.focusOn("@firstInvalidShown");

        return false;
      }

      self.stages()[self.index].expanded(false);
      self.stages()[self.index + 1].expanded(true);
    };

    AdditionalKycModel.fetchOccupationList().done(function(data) {
      self.occupations(data.enumRepresentations[0].data);

      AdditionalKycModel.fetchGrossAnnualIncomeList().done(function(data) {
        self.incomeRanges(data.enumRepresentations[0].data);
        self.kycDataLoaded(true);
      });
    });
  };
});