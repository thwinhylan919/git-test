define([
    "knockout",
  "./model",
        "ojL10n!resources/nls/user-type",
  "ojs/ojinputtext"
], function(ko, UserTypeFetchModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    self.userTypeEnums = ko.observableArray();
    self.userTypeEnumsLoaded = ko.observable(false);
    self.selectedUserType = rootParams.rootModel.selectedUserType;
    self.rolePreferencesList = ko.observable();

    let filter = [];

    self.diableUserType = ko.observable(false);

    if (rootParams.filter) {
      filter = rootParams.filter;
    }

    UserTypeFetchModel.init();

    UserTypeFetchModel.fetchUserGroupOptions().done(function(data) {
      ko.utils.arrayForEach(data.enterpriseRoleDTOs, function(data) {
        if (data.enterpriseRoleId && filter.toString().toLowerCase().indexOf(data.enterpriseRoleId.toLowerCase()) === -1) {
          self.userTypeEnums.push(data);
        }
      });

      self.userTypeEnumsLoaded(true);
    });

    self.userTypeOptionChangeHandler = function(event) {
      const value = event.detail.value;

      self.selectedUserType(value);
      self.userTypeSelectionIdle(false);
    };

    if (self.isCorpAdmin) {
      self.selectedUserType("corporateuser");
      self.diableUserType(true);
      self.diableUserType(true);
      self.userTypeSelectionIdle(false);
    } else if (rootParams.rootModel.disableEnterpriseRole) {
      self.diableUserType(true);
    } else {
      self.diableUserType(false);
    }
  };
});