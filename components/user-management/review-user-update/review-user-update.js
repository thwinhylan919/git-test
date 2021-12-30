define([

  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/user-management",
  "ojs/ojcheckboxset",
  "ojs/ojswitch"
], function (ko, $, reviewUserUpdateModel, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.accessibleEntityArray = ko.observableArray([]);
    self.accessibleEntityTemplate = ko.observableArray([]);
    rootParams.baseModel.registerComponent("tooltip", "home");

    if (!self.userSegments) { self.userSegments = ko.observableArray([]); }

    self.limitGroupName = ko.observable();
    self.templateLoaded = ko.observable(false);
    self.accessPoint = ko.observableArray([]);
    self.accessPointGroup = ko.observableArray([]);
    self.isAccessPointFetched = ko.observable(false);
    self.noLimitsHomeEntity = ko.observable(true);

    if (!self.isUserSegmentsFetched) { self.isUserSegmentsFetched = ko.observable(false); }

    if (!self.selectedSegmentCode) { self.selectedSegmentCode = ko.observable(); }

    if (!self.selectedSegmentName) { self.selectedSegmentName = ko.observable(); }

    if (!self.selectedSegmentRoles) { self.selectedSegmentRoles = ko.observableArray(); }

    if (!self.isSegmentContainsRole) { self.isSegmentContainsRole = ko.observable(false); }

    self.homeEntityLimitPackage = rootParams.rootModel.limitPackageDetails ? ko.observable(rootParams.rootModel.limitPackageDetails()) : ko.observable();

    const searchParameters = {
      accessType: "INT"
    };

    self.fetchChannelDescription = function (item) {
      if (item.accessPointGroupType === "SINGLE") {
        for (let b = 0; b < self.accessPoint().length; b++) {
          if (item.accessPointValue === self.accessPoint()[b].value) { return self.accessPoint()[b].text; }
        }
      } else {
        for (let b = 0; b < self.accessPointGroup().length; b++) {
          if (item.accessPointValue === self.accessPointGroup()[b].value) { return self.accessPointGroup()[b].text; }
        }
      }
    };

    self.setHomeEntityLimits = function () {
      if (self.homeEntityLimitPackage()) {
        for (let j = 0; j < self.homeEntityLimitPackage().length; j++) {
          if (self.homeEntityLimitPackage()[j].selectedLimitPackage()) {
            self.noLimitsHomeEntity(false);
            break;
          }
        }
      }

      if (self.transactionDetails && self.transactionDetails().transactionSnapshot) {
        for (let l = 0; l < self.entityIdList().length; l++) {
          if (self.entityIdList()[l].businessEntity === self.userFullData().homeEntity && self.entityIdList()[l].limitPackageList.length) {
            self.homeEntityLimitPackage(self.entityIdList()[l].limitPackageList);
            self.noLimitsHomeEntity(false);
          }
        }
      }
    };

    if (rootParams.rootModel.params.data) {
      self.userFullData = ko.observable(ko.toJS(rootParams.rootModel.params.data));
    }

    if (rootParams.rootModel.params.data.limitPackage) {
      self.selectedUserLimit = rootParams.rootModel.params.data.limitPackage;
    }

    reviewUserUpdateModel.fetchAccess(searchParameters).done(function (data) {
      for (let i = 0; i < data.accessPointListDTO.length; i++) {
        self.accessPoint().push({
          text: data.accessPointListDTO[i].description,
          value: data.accessPointListDTO[i].id
        });
      }

      self.isAccessPointFetched(true);
    });

    if (self.transactionDetails === undefined) {
        self.transactionDetails = ko.observable(rootParams);
        self.transactionDetails().transactionSnapshot = self.userFullData();
        }

    if (self.transactionDetails && self.transactionDetails().transactionSnapshot) {
      const searchParameter = {
        selectedUser: self.transactionDetails().transactionSnapshot.userType
      };

      reviewUserUpdateModel.fetchUserSegments(searchParameter).done(function (data) {
        self.userSegments([]);

        for (let j = 0; j < data.segmentdtos.length; j++) {
          if (data.segmentdtos[j].code === self.transactionDetails().transactionSnapshot.segmentCode) {
            self.selectedSegmentCode(data.segmentdtos[j].code);
            self.selectedSegmentName(data.segmentdtos[j].name);

            if (data.segmentdtos[j].roles !== undefined) {
              self.selectedSegmentRoles(data.segmentdtos[j].roles);
              self.isSegmentContainsRole(true);
            }
          }

          self.userSegments().push({
            text: data.segmentdtos[j].name,
            value: data.segmentdtos[j].code
          });

          self.isUserSegmentsFetched(true);
        }
      });

      self.selectedAccessPoint = ko.observableArray([]);

      for (let i = 0; i < self.transactionDetails().transactionSnapshot.userAccessPointRelationshipList.length; i++) {
        if (self.transactionDetails().transactionSnapshot.homeEntity === self.transactionDetails().transactionSnapshot.userAccessPointRelationshipList[i].determinantValue && self.transactionDetails().transactionSnapshot.userAccessPointRelationshipList[i].status === true) {
          self.selectedAccessPoint.push(self.transactionDetails().transactionSnapshot.userAccessPointRelationshipList[i].accessPointId);
        }
      }

      if (self.transactionDetails().transactionSnapshot.accessibleEntities.length > 0) {
        self.accessibleEntities = ko.observableArray([]);

        for (let k = 0; k < self.transactionDetails().transactionSnapshot.accessibleEntities.length; k++) {
          const temp = [];

          for (let m = 0; m < self.transactionDetails().transactionSnapshot.userAccessPointRelationshipList.length; m++) {
            if (self.transactionDetails().transactionSnapshot.accessibleEntities[k].entityId !== undefined) {
              if (self.transactionDetails().transactionSnapshot.accessibleEntities[k].entityId !== self.userFullData().homeEntity && self.transactionDetails().transactionSnapshot.accessibleEntities[k].entityId === self.userFullData().userAccessPointRelationshipList[m].determinantValue && self.userFullData().userAccessPointRelationshipList[m].status === true) {
                temp.push(self.userFullData().userAccessPointRelationshipList[m].accessPointId);
              }
            }
          }

          self.accessibleEntities.push({
            selectedAccessPoints: temp,
            accessPointId: self.transactionDetails().transactionSnapshot.accessibleEntities[k].entityId
          });
        }
      }
    }

    self.entityIdList = ko.observableArray();

    self.setEntityLimitPackages = function () {
      if (self.userFullData().limitPackages !== undefined) {
        for (let g = 0; g < self.userFullData().limitPackages.length; g++) {
          const tempArray = [];

          for (let h = 0; h < self.userFullData().limitPackages[g].entityLimitPackageMappingDTO.length; h++) {
            tempArray.push({
              accessPointGroupType: self.userFullData().limitPackages[g].entityLimitPackageMappingDTO[h].limitPackage.accessPointGroupType,
              accessPointValue: self.userFullData().limitPackages[g].entityLimitPackageMappingDTO[h].limitPackage.accessPointValue,
              selectedLimitPackage: ko.observable(self.userFullData().limitPackages[g].entityLimitPackageMappingDTO[h].limitPackage.key.id),
              description: self.fetchChannelDescription(self.userFullData().limitPackages[g].entityLimitPackageMappingDTO[h].limitPackage)
            });
          }

          self.entityIdList.push({
            businessEntity: self.userFullData().limitPackages[g].targetUnit,
            limitPackageList: tempArray
          });
        }
      }
    };

    self.prepareAccessibleEntity = function () {
      const arg = [];

      if (self.userFullData().userType !== "administrator") {
        let req_array = self.userFullData().accessibleEntities;

        req_array = $.map(req_array, function (node) {
          for (let g = 0; g < self.entityIdList().length; g++) {
            if (self.entityIdList()[g].businessEntity === node.entityId) {
              node.limitPackage = self.entityIdList()[g].limitPackageList;
            }
          }

          return node;
        });

        for (let k = 0; k < req_array.length; k++) {
          if (req_array[k].entityId !== self.userFullData().homeEntity) {
            arg.entityId = req_array[k].entityId;
            arg.entityName = req_array[k].entityName;
            arg.displayValue = req_array[k].userPartyRelationship.partyId.displayValue;
            arg.value = req_array[k].userPartyRelationship.partyId.value;
            arg.limitPackage = req_array[k].limitPackage;
            arg.limitPackageName = req_array[k].limitPackageName;
            arg.partyName = req_array[k].partyName;
            arg.isLimitPackageAttached = !!req_array[k].limitPackage.length;
            arg.selectedAccessPoints = self.accessibleEntities()[k].selectedAccessPoints;
            self.addAccessibleEntity(arg);
          }
        }
      } else {
        for (let index = 0; index < self.userFullData().accessibleEntities.length; index++) {
          if (self.userFullData().accessibleEntities[index].entityId !== undefined) {
            if (self.userFullData().accessibleEntities[index].entityId !== self.userFullData().homeEntity) {
              arg.entityId = self.userFullData().accessibleEntities[index].entityId;
              arg.entityName = self.userFullData().accessibleEntities[index].entityName;
              arg.selectedAccessPoints = self.accessibleEntities()[index].selectedAccessPoints;
              self.addAccessibleEntity(arg);
            }
          }
        }
      }
    };

    self.addAccessibleEntity = function (arg) {
      arg = arg ? arg : [];

      self.partyInfo = {
        partyFirstName: ko.observable(),
        partyLastName: ko.observable(),
        userType: "CUSTOMER",
        partyName: arg.partyName ? ko.observable(arg.partyName) : ko.observable(),
        partyDetailsFetched: ko.observable(true),
        additionalDetails: ko.observable(),
        userTypeLabel: ko.observable(),
        party: {
          value: arg.value ? ko.observable(arg.value) : ko.observable(),
          displayValue: arg.displayValue ? ko.observable(arg.displayValue) : ko.observable()
        }
      };

      self.accessibleEntityArray.push({
        entityId: arg.entityId ? ko.observable(arg.entityId) : ko.observable(),
        entityName: arg.entityName ? ko.observable(arg.entityName) : ko.observable(),
        entityList: self.entityList,
        partyInfo: self.partyInfo,
        limitPackage: arg.limitPackage ? ko.observable(arg.limitPackage) : ko.observable(),
        childRoles: ko.observableArray([]),
        entityChange: arg.entityId ? ko.observable(true) : ko.observable(false),
        entityUserLimitListLoaded: ko.observable(false),
        entityUserLimit: ko.observable(),
        userType: self.userFullData().userType,
        limitPackageName: arg.limitPackageName ? ko.observable(arg.limitPackageName) : ko.observable(),
        entitiesListLoaded: self.entitiesListLoaded,
        accessibleEntitySet: arg.entityId ? ko.observable(true) : ko.observable(false),
        accessPointList: ko.observableArray([]),
        isLimitPackageAttached: arg.isLimitPackageAttached ? ko.observable(arg.isLimitPackageAttached) : ko.observable(),
        selectedAccessPoints: arg.selectedAccessPoints
      });
    };

    self.propagatedData = ko.toJS(rootParams.rootModel.params.data);
    self.statusOptionValue = ko.observable();
    self.nls = resourceBundle;
    self.resourceBundle = resourceBundle;
    rootParams.baseModel.registerElement("action-header");
    self.isLimitsLoaded = ko.observable(false);
    self.deviceDataLoaded = ko.observable(false);
    self.userGroupsList = ko.observableArray();
    self.childRoleEnums = ko.observableArray([]);
    self.childRoleEnumsLoaded = ko.observable(false);

    self.getEnterpriseRoles = function () {
      reviewUserUpdateModel.getEnterpriseRoles().done(function (data) {
        ko.utils.arrayForEach(data, function (item) {
          if (self.userFullData().userGroups.indexOf(item.enterpriseRoleId) > -1) {
            self.userType = item;
          }
        });
      });
    };

    self.getEnterpriseRoles();

    if (self.userFullData().userGroups.indexOf(self.userFullData().userType) > -1) {
      const index = self.userFullData().userGroups.indexOf(self.userFullData().userType);

      self.userFullData().userGroups.splice(index, 1);
    }

    reviewUserUpdateModel.fetchChildRole(self.userFullData().userType).done(function (data) {
      self.childRoleEnums(data.applicationRoleDTOs);
      self.childRoleEnumsLoaded(true);
    });

    self.setEntityTemplate = function () {
      Promise.all([reviewUserUpdateModel.listAccessPointGroup()])
        .then(function (response) {
          const data1 = response[0];

          for (let i = 0; i < data1.accessPointGroupListDTO.length; i++) {
            self.accessPointGroup.push({
              text: data1.accessPointGroupListDTO[i].description,
              value: data1.accessPointGroupListDTO[i].accessPointGroupId
            });
          }

          self.setEntityLimitPackages();
          self.prepareAccessibleEntity();
          self.accessibleEntityTemplate.removeAll();
          ko.utils.arrayPushAll(self.accessibleEntityTemplate, self.accessibleEntityArray());
          self.setHomeEntityLimits();
          self.isAccessPointFetched(true);
          self.templateLoaded(true);
        });
    };

    if (rootParams.rootModel.params.accessibleEntityTemplate) {
      self.accessibleEntityTemplate.removeAll();
      ko.utils.arrayPushAll(self.accessibleEntityTemplate, ko.toJS(rootParams.rootModel.accessibleEntityArray()));
      self.setHomeEntityLimits();
      self.templateLoaded(true);
    } else {
      self.setEntityTemplate();
    }
  };
});
