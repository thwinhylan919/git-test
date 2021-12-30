define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/accessible-entity",
  "ojs/ojinputtext",
  "ojs/ojknockout-validation"
], function (ko, accessibleEntityModel, locale) {
  "use strict";

  const vm = function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.productId = self.productId || ko.observableArray();
    self.locale = locale;
    rootParams.baseModel.registerElement("page-section");
    rootParams.baseModel.registerElement("row");
    rootParams.baseModel.registerElement("action-header");
    rootParams.baseModel.registerComponent("party-validate", "common");
    self.entityDetails = rootParams.entityDetails;
    self.selectedAccessType = ko.observable("INT");

    self.validationTracker = rootParams.validationTracker;
    self.selectedDeterminantValue = ko.observable();

    const prevEntityId = [],
      entityName = [];

    self.assignableEntitiesData = [{
      key: {
        value: rootParams.parentRole,
        type: "ROLE"
      }
    }];

    self.header = self.locale.accessibleEntity.limit;
    self.selectedLimitPackagesEditMode = ko.observableArray();
    self.accessPointType = ko.observable("INT");

    if (self.entityDetails.limitPackage() !== undefined && self.entityDetails.limitPackage().length) {
      for (let i = 0; i < self.entityDetails.limitPackage().length; i++) {
        if (!self.entityDetails.limitPackage()[i].selectedLimitPackage) {
          self.selectedLimitPackagesEditMode.push({
            key: {
              id: self.entityDetails.limitPackage()[i].limitPackage.key.id
            },
            accessPointValue: self.entityDetails.limitPackage()[i].accessPointValue
          });
        } else {
          self.selectedLimitPackagesEditMode.push({
            key: {
              id: self.entityDetails.limitPackage()[i].selectedLimitPackage()
            },
            accessPointValue: self.entityDetails.limitPackage()[i].accessPoint
          });
        }
      }
    }

    self.updateEntityList = function (entityId, prevEntityId) {
      const array = self.entityDetails.entityList();
      let index = null;

      for (let i = 0; i < array.length; i++) {
        if (array[i].entityId === entityId) {
          index = i;
        }
      }

      self.entityDetails.entityList().splice(index, 1);
      self.entityDetails.entityList(self.entityDetails.entityList().slice(0));

      if (prevEntityId.length > 0) {
        self.entityDetails.entityList().push({
          entityId: prevEntityId[0],
          entityName: entityName[prevEntityId[0]]
        });
      }
    };

    if (self.entityDetails.entityId()) {
      accessibleEntityModel.fetchUserLimitOptions(self.entityDetails.entityId(), ko.toJSON(self.assignableEntitiesData)).done(function (data) {
        self.entityDetails.entityUserLimit(data.limitPackageDTOList);
        self.entityDetails.entityUserLimitListLoaded(false);
        ko.tasks.runEarly();
        self.entityDetails.entityUserLimitListLoaded(true);
      });
    }

    self.entityUserLimit = ko.observable();
    self.entityUserLimitListLoaded = ko.observable(false);

    for (let i = 0; i < rootParams.dashboard.userData.userProfile.accessibleEntityDTOs.length; i++) {
      entityName[rootParams.dashboard.userData.userProfile.accessibleEntityDTOs[i].entityId] = rootParams.dashboard.userData.userProfile.accessibleEntityDTOs[i].entityName;
    }

    self.entityIdSubscription = self.entityDetails.entityId.subscribe(function (newValue) {
      if (newValue) {
        self.entityAccessPoint(newValue);
        self.entityDetails.accessibleEntitySet(true);
      }

      if (newValue && self.entityDetails.userType !== "administrator") {
        self.entityDetails.entityChange(false);
        ko.tasks.runEarly();

        self.entityDetails.partyInfo = {
          partyFirstName: ko.observable(),
          partyLastName: ko.observable(),
          userType: "CUSTOMER",
          partyName: ko.observable(),
          partyDetailsFetched: ko.observable(),
          additionalDetails: ko.observable(),
          userTypeLabel: ko.observable(),
          party: {
            value: ko.observable(),
            displayValue: ko.observable()
          }
        };

        self.entityDetails.entityChange(true);

        accessibleEntityModel.fetchUserLimitOptions(self.entityDetails.entityId(), ko.toJSON(self.assignableEntitiesData)).done(function (data) {
          self.entityDetails.entityUserLimit(data.limitPackageDTOList);
          self.entityDetails.entityUserLimitListLoaded(false);
          ko.tasks.runEarly();
          self.entityDetails.entityUserLimitListLoaded(true);
        });
      }

      self.updateEntityList(newValue, prevEntityId);
      self.entityDetails.entityName(prevEntityId.length > 0 ? entityName[prevEntityId[0]] : entityName[newValue]);
      prevEntityId.pop();
      prevEntityId.push(newValue);
    });
  };

  vm.prototype.dispose = function () {
    self.entityIdSubscription.dispose();
  };

  return vm;
});
