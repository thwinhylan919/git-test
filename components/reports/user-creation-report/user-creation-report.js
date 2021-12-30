define([
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/user-creation-report",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox"
], function (ko, $, userCreationModel, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.Nls = resourceBundle.userCreation;
    self.validationTracker = rootParams.validationTracker;
    self.isEnterpriseRolesLoaded = ko.observable(false);
    self.enterpriseRoles = ko.observableArray();
    self.partyFlag = ko.observable(false);
    self.itsRetail = ko.observable(false);

    userCreationModel.fetchEnumeration().done(function (data) {
      self.enterpriseRoles(data.enterpriseRoleDTOs);
      self.isEnterpriseRolesLoaded(true);
    });

    $("#fromScheduledDate").val(self.today());
    $("#toScheduledDate").val(self.today() + 1);

    self.userSegmentSelected = function (event) {
      if (event.detail.value) {

        $("#userType").val(event.detail.value);

        if ("administrator".toUpperCase() === event.detail.value.toUpperCase()) {

          self.partyFlag(true);
          self.itsRetail(false);
          $("#partyId").val("");

        } else if ("retailuser".toUpperCase() === event.detail.value.toUpperCase()) {
          self.itsRetail(true);
          self.partyFlag(false);
        } else {

          self.partyFlag(false);
          self.itsRetail(false);

        }
      }
    };
  };
});