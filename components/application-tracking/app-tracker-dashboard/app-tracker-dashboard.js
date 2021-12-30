define([
    "knockout",
  "jquery",
  "./model",
    "ojL10n!resources/nls/application-dashboard",
  "ojs/ojknockout",
  "ojs/ojbutton"
], function(ko, $, ApplicationDashboardModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.headingText(self.resource.headingText);
    rootParams.baseModel.registerComponent("modal-window", "base-components");
    rootParams.baseModel.registerComponent("app-tracker-dashboard-view", "application-tracking");

    self.cancelApplication = function() {
      if (self.applicationInfo().currentApplicationId() !== "") {
        ApplicationDashboardModel.withdrawApplication(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId()).done(function() {
          $("#confirmCancellationModelWindow").trigger("closeModal");
          $("#successfullyCancelledModalWindow").trigger("openModal");
        }).fail(function() {
          $("#confirmCancellationModelWindow").trigger("closeModal");
        });
      }
    };
  };
});