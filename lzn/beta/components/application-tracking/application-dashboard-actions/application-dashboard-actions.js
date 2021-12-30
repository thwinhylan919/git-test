define([
    "knockout",
  "jquery",
  "./model",
    "ojL10n!lzn/beta/resources/nls/application-dashboard-actions"
], function(ko, $, ApplicationDashboardActionsModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;
    let index;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;

    self.navigateFurther = function(type) {
      switch (type) {
        case "OfferDocuments":
          rootParams.baseModel.registerComponent("application-offer-container", "application-tracking");
          self.productTrackingComponentName("application-offer-container");
          break;
        case "AdditionalInfo":
          rootParams.baseModel.registerComponent("mortgage-additional-details", "application-tracking");
          self.productTrackingComponentName("mortgage-additional-details");
          break;
        case "DocumentUpload":
          rootParams.baseModel.registerComponent("application-documents", "application-tracking");
          self.productTrackingComponentName("application-documents");
          break;
        case "CardPreferences":
          rootParams.baseModel.registerComponent("card-additional-preferences", "application-tracking");
          self.productTrackingComponentName("card-additional-preferences");
          break;
        default:
          break;
      }
    };

    self.dialogTitle = ko.observable("");
    self.dialogMessage = ko.observable("");

    self.viewApplication = function() {
      rootParams.baseModel.registerComponent("application-documents", "application-tracking");
      self.productTrackingComponentName("application-documents");
    };

    self.pendingActionList = ko.observableArray([]);
    self.request = $.extend({}, self.baseRequest);

    ApplicationDashboardActionsModel.fetchPending(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId()).done(function(data) {
      if (!self.currentUser().isPrimaryApplicant()) {
        for (index = 0; index < data.pendingActions.length; index++) {
          if (data.pendingActions[index].type === "AdditionalInfo") {
            data.pendingActions.splice(index, 1);
          }
        }
      }

      self.pendingActionList(data.pendingActions);
    });
  };
});