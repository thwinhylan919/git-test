define([

  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/review-create-segments",
  "ojs/ojformlayout",
  "ojs/ojvalidationgroup",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojcheckboxset",
  "ojs/ojbutton",
  "ojs/ojaccordion",
  "framework/elements/api/page-section/loader"
], function (ko, $, Model, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    self.nls = resourceBundle;
    params.dashboard.headerName(self.nls.SegmentDefinition.header);
    self.reviewHeader = params.rootModel.params.prevmode === "create" ? self.nls.SegmentDefinition.confirmScreenheaderCreate : self.nls.SegmentDefinition.confirmScreenheaderEdit;
    self.reviewData = typeof params.rootModel.previousState === "undefined" ? params.rootModel.params.data : typeof params.rootModel.previousState.searchData === "undefined" ? params.rootModel.previousState.data : params.rootModel.previousState.searchData;
    params.baseModel.registerElement("confirm-screen");
    params.baseModel.registerComponent("create-segments", "segments");
    self.confirm = params.rootModel.confirm;
    self.mode = params.rootModel.params.mode;
    self.reviewTransactionName = [];
    self.reviewTransactionName.header = self.nls.SegmentDefinition.header;
    self.reviewTransactionName.reviewHeader = self.nls.SegmentDefinition.reviewHeader;
    self.httpStatus = ko.observable();
    self.transactionStatus = ko.observable();
    self.limitArray = ko.observableArray();
    self.status = ko.observable();
    self.appRoles = ko.observableArray();
    self.appRoleEnums = ko.observableArray();
    self.dataLoaded = ko.observable(false);
    self.entityArray = ko.observableArray();
    self.mappedLimitPackages = ko.observableArray();
    self.entityLimitPackageMapArray = typeof params.rootModel.params.entityLimitPackageMapArray !== "undefined" ? params.rootModel.params.entityLimitPackageMapArray : ko.observableArray();
    self.accessPointGroup = ko.observableArray();
    self.accessPoint = ko.observableArray();

    /**
     * This function fetches list of access point.
     *
     * @function checkAccessPointDesc
     * @param {Object} accessPointId - Access point id.
     * @returns {Object} Description of access point.
     */
    function checkAccessPointDesc(accessPointId) {
      for (let a = 0; a < self.accessPoint().length; a++) {
        if (self.accessPoint()[a].value === accessPointId) {
          return self.accessPoint()[a].text;
        }
      }
    }

    /**
     * This function fetches list of access point group.
     *
     * @function checkAccessPointGrpDesc
     * @param {Object} accessPointGrpId - Access point group id.
     * @returns {Object} Description of access point group.
     */
    function checkAccessPointGrpDesc(accessPointGrpId) {
      for (let a = 0; a < self.accessPointGroup().length; a++) {
        if (self.accessPointGroup()[a].value === accessPointGrpId) {
          return self.accessPointGroup()[a].text;
        }
      }
    }

    if (self.mode === "approval") {
      Model.fetchEnterpriseRoles().then(function (data) {
        for (let a = 0; a < data.enterpriseRoleDTOs.length; a++) {
          if (data.enterpriseRoleDTOs[a].enterpriseRoleId === self.reviewData.enterpriseRole) {
            self.enterpriseRoleDTO = data.enterpriseRoleDTOs[a];
          }
        }
      });
    } else {
      self.enterpriseRoleDTO = ko.utils.arrayFirst(params.rootModel.params.enterpriseRoles, function (enterpriseRole) {
        return enterpriseRole.enterpriseRoleId === self.reviewData.enterpriseRole();
      });
    }

    if (params.rootModel.params.mode === "view" || self.mode === "approval") {
      self.dataLoaded(false);

      if (self.reviewData.status() === "ENABLED") {
        self.status(self.nls.SegmentDefinition.Enabled);
      } else {
        self.status(self.nls.SegmentDefinition.Disabled);
      }

      Model.fetchChildRole(self.reviewData.enterpriseRole()).done(function (data) {
        self.appRoleEnums.removeAll();
        self.appRoleEnums(data.applicationRoleDTOs);
        ko.tasks.runEarly();
        self.appRoles.removeAll();

        for (let x = 0; x < self.appRoleEnums().length; x++) {
          for (let y = 0; y < self.reviewData.roles().length; y++) {
            const roleId = self.mode === "approval" ? self.reviewData.roles()[y].appRoleId() : self.reviewData.roles()[y].appRoleId;

            if (self.appRoleEnums()[x].applicationRoleName === roleId) {
              self.appRoles().push({
                applicationRoleId: self.appRoleEnums()[x].applicationRoleId,
                applicationRoleName: self.appRoleEnums()[x].applicationRoleName
              });
            }
          }
        }
      });

      const searchParameters = {
        accessType: "INT"
      };

      Promise.all([Model.fetchAccess(searchParameters), Model.listAccessPointGroup()])
        .then(function (response) {
          const data = response[0],
            data1 = response[1];

          for (let i = 0; i < data1.accessPointGroupListDTO.length; i++) {
            self.accessPointGroup.push({
              text: data1.accessPointGroupListDTO[i].description,
              value: data1.accessPointGroupListDTO[i].accessPointGroupId
            });
          }

          for (let i = 0; i < data.accessPointListDTO.length; i++) {
            if (data.accessPointListDTO[i].type === "INT") {
              self.accessPoint().push({
                text: data.accessPointListDTO[i].description,
                value: data.accessPointListDTO[i].id
              });
            }
          }
        });

      const assignableEntitiesData = [{
        key: {
          value: self.reviewData.enterpriseRole(),
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

      Model.fireBatch({
        batchDetailRequestList: self.mappedLimitPackages()
      }).done(function (batchData) {

        for (let k = 0; k < self.entityLimitPackageMapArray().length; k++) {

          for (let y = 0; y < batchData.batchDetailResponseDTOList.length; y++) {
            const batchResponseDTO = JSON.parse(batchData.batchDetailResponseDTOList[y].responseText);

            if (batchResponseDTO.limitPackageDTOList && batchResponseDTO.limitPackageDTOList.length && self.entityLimitPackageMapArray()[k].entityId === batchResponseDTO.limitPackageDTOList[0].key.determinantValue) {
              self.entityLimitPackageMapArray()[k].limitPackages(batchResponseDTO.limitPackageDTOList);
              self.entityLimitPackageMapArray()[k].limitPackagesLoaded(true);

              if (self.reviewData.limits().length > 0) {
                self.limitArray.push({
                  id: k,
                  name: self.entityLimitPackageMapArray()[k].entityName,
                  packages: []
                });

                for (let x = 0; x < self.reviewData.limits().length; x++) {
                  const targetUnit = self.mode === "approval" ? self.reviewData.limits()[x].targetUnit() : self.reviewData.limits()[x].targetUnit;

                  if (targetUnit === batchResponseDTO.limitPackageDTOList[0].key.determinantValue) {
                    const entityLimitPackageMappingDTO = self.mode === "approval" ? self.reviewData.limits()[x].entityLimitPackageMappingDTO() : self.reviewData.limits()[x].entityLimitPackageMappingDTO;

                    for (let z = 0; z < entityLimitPackageMappingDTO.length; z++) {
                      for (let a = 0; a < self.entityLimitPackageMapArray()[k].limitPackages().length; a++) {
                        const limitPkgId = self.mode === "approval" ? entityLimitPackageMappingDTO[z].limitPackage.key.id() : entityLimitPackageMappingDTO[z].limitPackage.key.id;

                        if (self.entityLimitPackageMapArray()[k].limitPackages()[a].key.id === limitPkgId &&
                          self.entityLimitPackageMapArray()[k].entityId === targetUnit) {
                          let id = 0;

                          for (let d = 0; d < self.limitArray().length; d++) {
                            if (self.limitArray()[d].id === k) {
                              id = d;
                              break;
                            }
                          }

                          self.limitArray()[id].packages.push({
                            value: self.entityLimitPackageMapArray()[k].limitPackages()[a].key.id,
                            description: checkAccessPointDesc(self.entityLimitPackageMapArray()[k].limitPackages()[a].accessPointValue) || checkAccessPointGrpDesc(self.entityLimitPackageMapArray()[k].limitPackages()[a].accessPointValue) || self.nls.SegmentDefinition.global
                          });

                          self.entityLimitPackageMapArray()[k].selectedLimitPackages.push({
                            key: {
                              id: self.entityLimitPackageMapArray()[k].limitPackages()[a].key.id
                            },
                            accessPointValue: self.entityLimitPackageMapArray()[k].limitPackages()[a].accessPointValue
                          });
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }

        ko.tasks.runEarly();
        self.dataLoaded(true);
      });

    } else {
      self.dataLoaded(false);

      if (self.reviewData.status() === "ENABLED") {
        self.status(self.nls.SegmentDefinition.Enabled);
      } else {
        self.status(self.nls.SegmentDefinition.Disabled);
      }

      ko.tasks.runEarly();
      self.appRoles.removeAll();

      for (let x = 0; x < params.rootModel.params.appRoleEnums().length; x++) {
        for (let y = 0; y < self.reviewData.roles().length; y++) {
          if (params.rootModel.params.appRoleEnums()[x].applicationRoleName === self.reviewData.roles()[y].appRoleId) {
            self.appRoles().push({
              applicationRoleId: params.rootModel.params.appRoleEnums()[x].applicationRoleId,
              applicationRoleName: params.rootModel.params.appRoleEnums()[x].applicationRoleName
            });
          }
        }
      }

      if (self.entityLimitPackageMapArray()) {
        for (let i = 0; i < self.entityLimitPackageMapArray().length; i++) {
          self.entityArray()[i] = self.entityLimitPackageMapArray()[i].entityName;
        }
      }

      for (let x = 0; x < self.entityArray().length; x++) {
        for (let y = 0; y < self.entityLimitPackageMapArray().length; y++) {
          if (self.entityArray()[x] === self.entityLimitPackageMapArray()[y].entityName) {
            self.limitArray.push({
              id: x,
              name: self.entityArray()[x],
              packages: []
            });

            for (let z = 0; z < self.entityLimitPackageMapArray()[y].limitPackageDetails().length; z++) {
              if (self.entityLimitPackageMapArray()[y].limitPackageDetails()[z].selectedLimitPackage()) {
                self.limitArray()[x].packages.push({
                  value: self.entityLimitPackageMapArray()[y].limitPackageDetails()[z].selectedLimitPackage(),
                  description: self.entityLimitPackageMapArray()[y].limitPackageDetails()[z].description
                });
              }
            }
          }
        }
      }

      ko.tasks.runEarly();
      self.dataLoaded(true);
    }

    self.confirm = function () {
      if (self.reviewData.status() === "ENABLED") {
        self.reviewData.status("ENABLED");
      } else {
        self.reviewData.status("DISABLED");
      }

      if (params.rootModel.params.prevmode === "create") {
        Model.createSegment(ko.mapping.toJSON(self.reviewData)).then(function (data) {
          self.httpStatus = data.getResponseStatus();

          params.dashboard.loadComponent("confirm-screen", {
            transactionResponse: data,
            transactionName: self.nls.SegmentDefinition.header
          });
        });
      } else {
        Model.updateSegment(self.reviewData.code(), ko.mapping.toJSON(self.reviewData)).then(function (data) {
          self.httpStatus = data.getResponseStatus();

          params.dashboard.loadComponent("confirm-screen", {
            transactionResponse: data,
            transactionName: self.nls.SegmentDefinition.header
          });
        });
      }
    };

    self.edit = function () {
      const context = {},
        searchData = {};

      searchData.code = self.reviewData.code();
      searchData.name = self.reviewData.name();
      searchData.enterpriseRole = self.reviewData.enterpriseRole;
      searchData.roles = self.reviewData.roles();
      searchData.status = self.reviewData.status;
      searchData.limits = self.reviewData.limits;
      searchData.searchResults = params.rootModel.params.searchData.searchResults;
      searchData.searchCode = params.rootModel.params.searchData.searchCode;
      searchData.searchName = params.rootModel.params.searchData.searchName;
      searchData.searchEnterpriseRole = params.rootModel.params.searchData.searchEnterpriseRole;

      context.searchData = searchData;
      context.data = self.reviewData;
      context.enterpriseRoles = params.rootModel.params.enterpriseRoles;
      context.appRoleEnums = self.appRoleEnums;
      context.mode = "edit";
      context.entityLimitPackageMapArray = self.entityLimitPackageMapArray;
      params.dashboard.loadComponent("create-segments", context);

    };

    self.cancel = function () {
      $("#reviewCancel").trigger("openModal");
    };

    self.yes = function () {
      params.dashboard.loadComponent("search-segments", {});
    };

    self.no = function () {
      $("#reviewCancel").hide();
    };

  };
});