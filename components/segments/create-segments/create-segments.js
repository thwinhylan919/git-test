define([
  "ojs/ojcore",
  "knockout",

  "./model",
  "ojL10n!resources/nls/create-segments",
  "ojs/ojvalidationgroup",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojbutton",
  "ojs/ojswitch"
], function (oj, ko, Model, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    self.nls = resourceBundle;
    params.dashboard.headerName(self.nls.SegmentDefinition.header);

    const confirmScreenExtensions = {};

    params.baseModel.registerElement("confirm-screen");
    params.baseModel.registerElement("modal-window");
    params.baseModel.registerComponent("review-create-segments", "segments");
    params.baseModel.registerComponent("access-point-mapping", "financial-limits");
    self.dataLoaded = ko.observable(false);
    self.mode = params.rootModel.params.mode;
    self.searchData = params.rootModel.params.data;
    self.appRoleEnums = ko.observableArray([]);
    self.appRoles = ko.observableArray([]);
    self.appRoleEnumsLoaded = typeof params.rootModel.params.appRoleEnumsLoaded !== "undefined" ? params.rootModel.params.appRoleEnumsLoaded : typeof params.rootModel.previousState !== "undefined" ? params.rootModel.previousState.appRoleEnumsLoaded : ko.observable(false);
    self.mappedLimitPackages = ko.observableArray();
    self.status = self.mode === "create" ? ko.observable(true) : self.searchData.status() === "DISABLED" ? ko.observable(false) : ko.observable(true);
    self.accessPointType = ko.observable("INT");
    self.entityLimitPackageMapArray = typeof params.rootModel.params.entityLimitPackageMapArray !== "undefined" ? params.rootModel.params.entityLimitPackageMapArray : typeof params.rootModel.previousState !== "undefined" ? params.rootModel.previousState.entityLimitPackageMapArray : ko.observableArray();
    self.showLimitPackageSearchSection = typeof params.rootModel.params.showLimitPackageSearchSection !== "undefined" ? params.rootModel.params.showLimitPackageSearchSection : typeof params.rootModel.previousState !== "undefined" ? params.rootModel.previousState.showLimitPackageSearchSection : ko.observable(false);
    self.limitPackageDataLoaded = typeof params.rootModel.limitPackageDataLoaded !== "undefined" ? params.rootModel.limitPackageDataLoaded : typeof params.rootModel.previousState !== "undefined" ? params.rootModel.previousState.limitPackageDataLoaded : ko.observable(false);
    self.datasource = typeof params.rootModel.params.datasource !== "undefined" ? params.rootModel.params.datasource : ko.observable();
    self.enterpriseRoleOptions = ko.observableArray([]);

    if (self.entityLimitPackageMapArray().length === 0) {
      for (let i = 0; i < params.dashboard.userData.userProfile.accessibleEntities.length; i++) {
        self.entityLimitPackageMapArray.push({
          entityId: params.dashboard.userData.userProfile.accessibleEntities[i],
          entityName: params.dashboard.userData.userProfile.accessibleEntityDTOs[i].entityName,
          selectedLimitPackages: ko.observableArray(),
          limitPackages: ko.observableArray(),
          limitPackagesLoaded: ko.observable(false),
          limitPackageDetails: ko.observableArray()
        });
      }
    }

    const getNewKoModel = function () {
      const KoModel = Model.getNewModel();

      return ko.mapping.fromJS(KoModel);
    };

    self.modelInstance = params.rootModel.previousState ? params.rootModel.previousState.data : params.rootModel.params.data ? params.rootModel.params.data : getNewKoModel();

    Model.fetchEnterpriseRoles().then(function (data) {
      ko.utils.arrayForEach(data.enterpriseRoleDTOs, function (data) {
        if (data.enterpriseRoleId.toLowerCase() === "retailuser") {
          self.enterpriseRoleOptions.push(data);
          self.dataLoaded(true);
        }
      });
    });

    if (typeof params.rootModel.params.appRoleEnums !== "undefined" && params.rootModel.params.appRoleEnums().length > 0) {
      self.appRoleEnums(params.rootModel.params.appRoleEnums());
    } else if (typeof params.rootModel.previousState !== "undefined" && params.rootModel.previousState.appRoleEnums().length > 0) {
      self.appRoleEnums(params.rootModel.previousState.appRoleEnums());
    }

    if (typeof params.rootModel.params.appRoles !== "undefined" && params.rootModel.params.appRoles().length > 0) {
      self.appRoles.push(params.rootModel.params.appRoles());
    } else if (typeof params.rootModel.previousState !== "undefined" && params.rootModel.previousState.data.roles().length > 0) {
      ko.tasks.runEarly();
      self.appRoles.removeAll();

      for (let y = 0; y < params.rootModel.previousState.data.roles().length; y++) {
        self.appRoles.push(params.rootModel.previousState.data.roles()[y].appRoleId);
      }

    }

    if (self.mode === "edit") {
      if (self.status()) {
        self.modelInstance.status("ENABLED");
      } else {
        self.modelInstance.status("DISABLED");
      }

      self.appRoles.removeAll();

      if (self.searchData.roles().length > 0) {
        for (let w = 0; w < self.searchData.roles().length; w++) {
          self.appRoles.push(self.searchData.roles()[w].appRoleId);
          ko.tasks.runEarly();
          self.appRoleEnumsLoaded(true);
        }
      } else {
        self.appRoleEnumsLoaded(true);
      }

      if (self.entityLimitPackageMapArray().length > 0) {
        self.limitPackageDataLoaded(true);
      }

    }

    self.changeRole = function (event) {
      if (event.detail.value !== "") {
        Model.fetchChildRole(self.modelInstance.enterpriseRole()).done(function (data) {
          self.appRoleEnumsLoaded(false);
          self.appRoleEnums.removeAll();
          self.appRoles.removeAll();
          self.appRoleEnums(data.applicationRoleDTOs);
          ko.tasks.runEarly();
          self.appRoleEnumsLoaded(true);
        });

        self.mappedLimitPackages.removeAll();

        const assignableEntitiesData = [{
          key: {
            value: self.modelInstance.enterpriseRole(),
            type: "ROLE"
          }
        }];

        for (let index = 0; index < params.dashboard.userData.userProfile.accessibleEntities.length; index++) {
          self.mappedLimitPackages.push({
            methodType: "GET",
            uri: {
              value: "/limitPackages?assignableEntities={assignableEntities}",
              params: {
                assignableEntities: ko.toJSON(assignableEntitiesData)
              }
            },
            headers: {
              "Content-Type": "application/json",
              "Content-Id": index + 1,
              "X-Target-Unit": params.dashboard.userData.userProfile.accessibleEntities[index]
            }
          });
        }

        Model.fireBatch({
          batchDetailRequestList: self.mappedLimitPackages()
        }).done(function (batchData) {
          for (let x = 0; x < self.entityLimitPackageMapArray().length; x++) {
            for (let y = 0; y < batchData.batchDetailResponseDTOList.length; y++) {
              const batchResponseDTO = JSON.parse(batchData.batchDetailResponseDTOList[y].responseText);

              if (batchResponseDTO.limitPackageDTOList && batchResponseDTO.limitPackageDTOList.length && self.entityLimitPackageMapArray()[x].entityId === batchResponseDTO.limitPackageDTOList[0].key.determinantValue) {
                self.entityLimitPackageMapArray()[x].limitPackages(batchResponseDTO.limitPackageDTOList);
                self.entityLimitPackageMapArray()[x].limitPackagesLoaded(true);
                break;
              }
            }
          }

          self.datasource(new oj.ArrayTableDataSource(self.entityLimitPackageMapArray, {
            idAttribute: "entityId"
          }));

          self.limitPackageDataLoaded(true);
        });

      }
    };

    self.submit = function () {
      if (!params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
        return;
      }

      if (self.status()) {
        self.modelInstance.status("ENABLED");
      } else {
        self.modelInstance.status("DISABLED");
      }

      if (self.entityLimitPackageMapArray() !== null) {
        self.modelInstance.limits.removeAll();

        for (let x1 = 0; x1 < self.entityLimitPackageMapArray().length; x1++) {
          const entityLimitPackageDTO = {
            targetUnit: "",
            entityLimitPackageMappingDTO: []
          };

          entityLimitPackageDTO.targetUnit = self.entityLimitPackageMapArray()[x1].entityId;

          for (let x2 = 0; x2 < self.entityLimitPackageMapArray()[x1].limitPackageDetails().length; x2++) {
            if (self.entityLimitPackageMapArray()[x1].limitPackageDetails()[x2].selectedLimitPackage()) {
              const entityLimitPackageMappingDTO = {
                limitPackage: {
                  key: {
                    id: "",
                    determinantValue: ""
                  }
                }
              };

              entityLimitPackageMappingDTO.limitPackage.key.id = self.entityLimitPackageMapArray()[x1].limitPackageDetails()[x2].selectedLimitPackage;
              entityLimitPackageMappingDTO.limitPackage.key.determinantValue = self.entityLimitPackageMapArray()[x1].entityId;
              entityLimitPackageDTO.entityLimitPackageMappingDTO.push(entityLimitPackageMappingDTO);

              self.entityLimitPackageMapArray()[x1].selectedLimitPackages.push({
                key: {
                  id: self.entityLimitPackageMapArray()[x1].limitPackageDetails()[x2].selectedLimitPackage()
                },
                accessPointValue: self.entityLimitPackageMapArray()[x1].limitPackageDetails()[x2].accessPoint
              });
            }
          }

          if (entityLimitPackageDTO.entityLimitPackageMappingDTO.length > 0) {
            self.modelInstance.limits.push(entityLimitPackageDTO);
          }
        }
      }

      if (self.appRoles().length > 0) {
        self.modelInstance.roles.removeAll();

        for (let k = 0; k < self.appRoles().length; k++) {
          const appRoleList = {
            appRoleId: self.appRoles()[k]
          };

          self.modelInstance.roles.push(appRoleList);
        }
      } else {
        self.modelInstance.roles.removeAll();
      }

      const context = {};

      context.data = self.modelInstance;
      context.enterpriseRoles = self.enterpriseRoleOptions();
      context.appRoleEnums = self.appRoleEnums;
      context.status = self.status();
      context.mode = "review";
      context.prevmode = self.mode;
      context.confirmScreenExtensions = confirmScreenExtensions;
      context.entityLimitPackageMapArray = self.entityLimitPackageMapArray;
      context.appRoleEnumsLoaded = self.appRoleEnumsLoaded;
      context.limitPackageDataLoaded = self.limitPackageDataLoaded;
      params.dashboard.loadComponent("review-create-segments", context);

    };

  };
});