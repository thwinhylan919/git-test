define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/authentication",
  "ojs/ojselectcombobox",
  "ojs/ojknockout-validation",
  "ojs/ojvalidationgroup"
], function (ko, SegmentAuthenticationMapingModel, ResourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = ResourceBundle;
    rootParams.dashboard.headerName(self.nls.authentication.headers.authentication);
    self.userSegmentsLoaded = ko.observable(false);
    self.validationTracker = ko.observable();
    rootParams.baseModel.registerComponent("view-authentication-maintenance", "authentication");

    self.back = function () {
      history.back();
    };

    self.userSegmentsList = ko.observableArray();
    self.userSegmentsForRoleList = self.userSegmentsForRoleList || ko.observableArray();
    self.userSegmentsForRoleLoaded = self.userSegmentsForRoleLoaded || ko.observable(false);
    self.segmentSelected = self.segmentSelected || ko.observable();
    self.segmentSelectedForRole = self.segmentSelectedForRole || ko.observable();

    self.save = function () {

      if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("userRoleTracker"))) {
        return;
      }

      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }

      rootParams.dashboard.loadComponent("view-authentication-maintenance", {
        selectedSegmentId: self.segmentSelected(),
        selectedEntityId: "SEGMENT",
        selectedEntityValue: self.segmentSelectedForRole()
      }, self);
    };

    SegmentAuthenticationMapingModel.listUserSegments().done(function (data) {
      self.userSegmentsList(data.enterpriseRoleDTOs);
      self.userSegmentsLoaded(true);
    });

    const segmentSelectedSubscribe = self.segmentSelected.subscribe(function () {
      self.userSegmentsForRoleLoaded(false);

      SegmentAuthenticationMapingModel.listUserSegmentsForRole(self.segmentSelected()).done(function (data) {
        if (data && data.segmentdtos && data.segmentdtos.length > 0) {
          self.userSegmentsForRoleList(data.segmentdtos);
          self.userSegmentsForRoleLoaded(true);
        }

        self.segmentSelectedForRole(null);
      });
    });

    self.dispose = function () {
      segmentSelectedSubscribe.dispose();
    };

  };
});