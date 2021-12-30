define([
    "knockout",
    "./model",
    "ojL10n!lzn/alpha/resources/nls/card-membership",
  "ojs/ojinputtext",
  "ojs/ojcheckboxset",
  "ojs/ojswitch"
], function(ko, CardMembershipModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this,
      CardMembershipModelObject = new CardMembershipModel(),
      getNewKoModel = function(modelData) {
        const KoModel = CardMembershipModelObject.getNewModel(modelData);

        return KoModel;
      };

    self.validationTracker = ko.observable();
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.membershipDetailsLoaded = ko.observable(false);
    self.primaryCardHolder().membership = getNewKoModel();

    self.updateMembershipDetails = function() {
      if (self.offerDetails.offerDetails[0].offerAdditionalDetails.cardOfferDetails.affinityCard) {
        self.primaryCardHolder().membership.membershipDetails.membershipName = self.offerDetails.offerDetails[0].offerAdditionalDetails.cardOfferDetails.affinityProgramName;

        const payload = ko.toJSON(self.primaryCardHolder().membership.membershipDetails);

        CardMembershipModelObject.updateMembershipDetails(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId(), payload).done(function() {
          self.uplTrackingDetails().additionalInfo.sections[2].isComplete(true);
          self.additionalInfoAccordion().close(3);
        });
      } else {
        self.uplTrackingDetails().additionalInfo.sections[2].isComplete(true);
        self.additionalInfoAccordion().close(3);
      }
    };

    CardMembershipModelObject.readMembershipDetails(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId()).done(function(data) {
      if (data.membershipDetails) {
        self.primaryCardHolder().membership = getNewKoModel(data.membershipDetails);
      }

      self.membershipDetailsLoaded(true);
    });
  };
});