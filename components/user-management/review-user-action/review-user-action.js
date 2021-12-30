define([

  "knockout",
  "./model",
  "ojL10n!resources/nls/user-management",
  "ojs/ojswitch",
  "ojs/ojcheckboxset"
], function(ko, reviewUserActionModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);

    if (rootParams.rootModel.params.data) {
      self.userFullData = ko.observable(ko.toJS(rootParams.rootModel.params.data));
    }

    self.statusOptionValue = ko.observable();
    self.statusOptionValue(self.userFullData().lockStatus === "LOCK");
    self.nls = resourceBundle;
    self.resourceBundle = resourceBundle;
    rootParams.baseModel.registerElement("action-header");
    self.approverReview = ko.observable(false);
    self.userType = ko.observable();

    self.userGroupsList = ko.observableArray();
    self.partyId = ko.observable();

    self.setHomeEntityParty = function() {
      for (let f = 0; f < self.userFullData().userPartyRelationshipDTOs.length; f++) {
        if (self.userFullData().userPartyRelationshipDTOs[f].determinantValue === self.userFullData().homeEntity) {
          self.partyId(self.userFullData().userPartyRelationshipDTOs[f].partyId.displayValue);
        }
      }
    };

    self.getEnterpriseRoles = function() {
      reviewUserActionModel.getEnterpriseRoles().done(function(data) {
        ko.utils.arrayForEach(data.enterpriseRoleDTOs, function(item) {
          if (self.userFullData().userGroups.indexOf(item.enterpriseRoleId) > -1) {
            self.userGroupsList.push(item);
          }
        });

        for (let i = 0; i < self.userGroupsList().length; i++) {
          self.userType(self.userGroupsList()[i].enterpriseRoleName);
        }

        self.setHomeEntityParty();
      });
    };

    self.getEnterpriseRoles();
  };
});
