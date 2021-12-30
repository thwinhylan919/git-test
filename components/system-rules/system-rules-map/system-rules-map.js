define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/system-rules",
  "ojs/ojknockout",
  "ojs/ojknockout-validation",
  "ojs/ojarraytabledatasource",
  "ojs/ojtable",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojswitch",
  "ojs/ojbutton",
  "ojs/ojcheckboxset",
  "ojs/ojpagingtabledatasource"
], function (oj, ko, RolePreferenceModel, ResourceBundle) {
  "use strict";

  return function (Params) {
    const self = this,
      getNewKoModel = function () {
        const KoModel = ko.mapping.fromJS(RolePreferenceModel.getNewModel());

        return KoModel;
      };

    Params.baseModel.registerComponent("access-point-mapping", "financial-limits");
    self.mode = ko.observable("CREATE");

    self.payload = getNewKoModel().payload;
    self.limitPackagePayload = typeof Params.rootModel.params.limitPackagePayload !== "undefined" ? Params.rootModel.params.limitPackagePayload : ko.observable();
    self.selectedRole = ko.observable();
    self.enterpriseRolesList = ko.observableArray([]);
    self.loginConfigList = typeof Params.rootModel.params.loginConfigList !== "undefined" ? Params.rootModel.params.loginConfigList : ko.observableArray([]);
    self.loginConfigMainteinedList = ko.observableArray([]);
    self.showEdit = ko.observable(false);
    self.validationTracker = ko.observable();
    self.isEnterpriseRolesLoaded = ko.observable();
    self.isLoginConfigListLoaded = ko.observable();
    self.isEnterpriseRoleSelected = typeof Params.rootModel.params.isEnterpriseRoleSelected !== "undefined" ? Params.rootModel.params.isEnterpriseRoleSelected : ko.observable(false);
    self.isPreferencesLoaded = ko.observable();
    self.isRolePreferencesLoaded = ko.observable(false);
    self.isPartyMappingRequired = ko.observable(false);
    self.isCustomerPreferenceCheck = ko.observable(false);
    self.isAccountAccessCheck = ko.observable(false);
    self.isLimitCheck = ko.observable(false);
    self.isApprovalCheck = ko.observable(false);
    self.preferencesListForPayload = ko.observableArray();
    self.isInitialScreenLoaded = typeof Params.rootModel.params.isInitialScreenLoaded !== "undefined" ? Params.rootModel.params.isInitialScreenLoaded : ko.observable(false);
    self.otpRequiredConstant = "OTP_REQUIRED";
    self.showLimitPackageSearchSection = typeof Params.rootModel.params.showLimitPackageSearchSection !== "undefined" ? Params.rootModel.params.showLimitPackageSearchSection : ko.observable(false);
    self.showLoginConfigSelectOptions = typeof Params.rootModel.params.showLoginConfigSelectOptions !== "undefined" ? Params.rootModel.params.showLoginConfigSelectOptions : ko.observable(false);
    self.limitPackageDataLoaded = typeof Params.rootModel.params.limitPackageDataLoaded !== "undefined" ? Params.rootModel.params.limitPackageDataLoaded : ko.observable(false);
    self.selectedRoleValues = ko.observableArray([]);
    self.entityLimitPackageMapArray = typeof Params.rootModel.params.entityLimitPackageMapArray !== "undefined" ? Params.rootModel.params.entityLimitPackageMapArray : ko.observableArray();
    self.mappedLimitPackages = ko.observableArray();
    self.datasource = ko.observable();
    self.statusDatasource = typeof Params.rootModel.params.statusDatasource !== "undefined" ? Params.rootModel.params.statusDatasource : ko.observable();
    Params.baseModel.registerElement("action-header");
    self.limitPackageDetails = ko.observableArray();
    self.accessPointType = ko.observable();
    self.showReviewForCreate = ko.observable(false);
    self.preferencesList = typeof Params.rootModel.params.preferencesList !== "undefined" ? Params.rootModel.params.preferencesList : ko.observableArray();
    self.isMandatoryComponent = ko.observable();
    self.loginConfigDataSource = ko.observable();
    self.isComponentEnabled = ko.observable();
    self.loginConfigTableList = typeof Params.rootModel.params.loginConfigTableList !== "undefined" ? Params.rootModel.params.loginConfigTableList : ko.observableArray();
    self.showTable = typeof Params.rootModel.params.showTable !== "undefined" ? Params.rootModel.params.showTable : ko.observable(true);
    self.loginConfigCurrentList = typeof Params.rootModel.params.loginConfigCurrentList !== "undefined" ? Params.rootModel.params.loginConfigCurrentList : ko.observableArray();
    self.loginConfigPayload = getNewKoModel().loginConfigPayload;
    self.batchPayload = ko.observableArray();
    self.disableMandatory = ko.observable();

    if (self.entityLimitPackageMapArray().length === 0) {
      for (let i = 0; i < Params.dashboard.userData.userProfile.accessibleEntities.length; i++) {
        self.entityLimitPackageMapArray.push({
          entityId: Params.dashboard.userData.userProfile.accessibleEntities[i],
          entityName: Params.dashboard.userData.userProfile.accessibleEntityDTOs[i].entityName,
          selectedLimitPackages: ko.observableArray(),
          limitPackages: ko.observableArray(),
          limitPackagesLoaded: ko.observable(false),
          limitPackageDetails: ko.observableArray()
        });
      }
    }

    ko.utils.extend(self, Params.rootModel);
    self.resource = ResourceBundle;
    Params.baseModel.registerComponent("review-system-rules-map", "system-rules");
    Params.dashboard.headerName(self.resource.rolePreferences.systemRules);

    if (self.params.mode) {
      self.mode(self.params.mode);
    }

    let accountRelCheckLabel;

    self.getEnterpriseRoles = function () {
      RolePreferenceModel.getEnterpriseRoles().done(function (data) {
        self.isEnterpriseRolesLoaded(false);
        self.enterpriseRolesList.removeAll();

        for (let i = 0; i < data.enterpriseRoleDTOs.length; i++) {
          self.enterpriseRolesList.push({
            text: data.enterpriseRoleDTOs[i].enterpriseRoleName,
            value: data.enterpriseRoleDTOs[i].enterpriseRoleId
          });
        }

        self.isEnterpriseRolesLoaded(true);
      });
    };

    RolePreferenceModel.getLoginConfigComponents().done(function (data) {
      self.isLoginConfigListLoaded(false);
      self.loginConfigList.removeAll();

      for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
        self.loginConfigList.push({
          id: data.enumRepresentations[0].data[i].code,
          name: data.enumRepresentations[0].data[i].description
        });
      }
    });

    self.compare = function (a, b) {
      if (a.text < b.text) {
        return -1;
      }

      if (a.text > b.text) {
        return 1;
      }

      return 0;
    };

    self.getRolePreferences = function () {
      RolePreferenceModel.getRolePreferences(self.selectedRole()).done(function (data) {
        let j;

        for (let i = 0; i < self.preferencesList().length; i++) {
          for (j = 0; j < data.rolePreferencesList.length; j++) {
            if (self.preferencesList()[i].preferenceId === data.rolePreferencesList[j].preferenceId) {
              data.rolePreferencesList[j].text = self.preferencesList()[i].text;
              break;
            }
          }
        }

        self.preferencesList.removeAll();
        self.showLimitPackageSearchSection(false);

        for (j = 0; j < data.rolePreferencesList.length; j++) {
          if (data.rolePreferencesList[j].preferenceId === "PARTY_MAPPING") {
            self.preferencesList()[0] = data.rolePreferencesList[j];
          } else if (data.rolePreferencesList[j].preferenceId === "CUSTOMER_PREFERENCES") {
            self.preferencesList()[1] = data.rolePreferencesList[j];
          } else if (data.rolePreferencesList[j].preferenceId === "ACCOUNT_ACCESS") {
            self.preferencesList()[2] = data.rolePreferencesList[j];
          } else if (data.rolePreferencesList[j].preferenceId === "APPROVAL") {
            self.preferencesList()[3] = data.rolePreferencesList[j];
          } else if (data.rolePreferencesList[j].preferenceId === "ACCOUNT_RELATIONSHIP_CHECK") {
            self.preferencesList()[4] = data.rolePreferencesList[j];

            if (self.mode() !== "EDIT") {
              self.preferencesList()[4].text = accountRelCheckLabel;
            }
          } else if (data.rolePreferencesList[j].preferenceId === "LOGIN_FLOW_REQUIRED") {
            self.preferencesList()[5] = data.rolePreferencesList[j];

          } else if (data.rolePreferencesList[j].preferenceId === "LIMITS_CHECK") {
            self.mappedLimitPackages.removeAll();

            const assignableEntitiesData = [{
              key: {
                value: self.selectedRole(),
                type: "ROLE"
              }
            }];

            for (let index = 0; index < Params.dashboard.userData.userProfile.accessibleEntities.length; index++) {
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
                  "X-Target-Unit": Params.dashboard.userData.userProfile.accessibleEntities[index]
                }
              });
            }

            RolePreferenceModel.fireBatch({
              batchDetailRequestList: self.mappedLimitPackages()
            }).done(function (data2) {
              if (data.assignedLimitPackageDTOs) {
                for (let k = 0; k < self.entityLimitPackageMapArray().length; k++) {
                  self.entityLimitPackageMapArray()[k].selectedLimitPackages.removeAll();

                  for (let z = 0; z < data.assignedLimitPackageDTOs.length; z++) {
                    if (self.entityLimitPackageMapArray()[k].entityId === data.assignedLimitPackageDTOs[z].targetUnit) {
                      for (let q = 0; q < data.assignedLimitPackageDTOs[z].entityLimitPackageMappingDTO.length; q++) {
                        self.entityLimitPackageMapArray()[k].selectedLimitPackages.push(data.assignedLimitPackageDTOs[z].entityLimitPackageMappingDTO[q].limitPackage);
                      }
                    }
                  }
                }
              }

              for (let x = 0; x < self.entityLimitPackageMapArray().length; x++) {
                for (let y = 0; y < data2.batchDetailResponseDTOList.length; y++) {
                  const batchResponseDTO = JSON.parse(data2.batchDetailResponseDTOList[y].responseText);

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

            self.preferencesList()[6] = data.rolePreferencesList[j];

            if (self.preferencesList()[6].value) {
              self.showLimitPackageSearchSection(true);
            } else {
              self.showLimitPackageSearchSection(false);
            }
          }
        }

        self.loginConfigMainteinedListSubscription();
      });

      self.isEnterpriseRoleSelected(true);
      self.isInitialScreenLoaded(false);
    };

    self.loginConfigMainteinedListSubscription = function () {
      const selectedRoleType = {
        role: self.selectedRole()
      };

      RolePreferenceModel.getLoginConfigList(selectedRoleType).done(function (data) {
        self.loginConfigCurrentList([]);

        for (let i = 0; i < data.logConfigDTOs.length; i++) {

          self.loginConfigCurrentList.push(data.logConfigDTOs[i]);
        }

        self.showTable(false);
        ko.tasks.runEarly();
        self.loginConfigMainteinedList.removeAll();

        if (data.logConfigDTOs.length !== 0) {
          self.loginConfigTableList([]);

          for (let i = 0; i < data.logConfigDTOs.length; i++) {
            const componentDetails = {};

            componentDetails.id = data.logConfigDTOs[i].id;
            componentDetails.description = data.logConfigDTOs[i].description;
            componentDetails.displayOrder = data.logConfigDTOs[i].displayOrder;
            componentDetails.role = data.logConfigDTOs[i].role;
            componentDetails.mandatory = ko.observable(data.logConfigDTOs[i].mandatory);
            componentDetails.uiComponentName = data.logConfigDTOs[i].id;
            componentDetails.enabled = ko.observableArray([data.logConfigDTOs[i].enabled.toString()]);
            componentDetails.dependentTasks = data.logConfigDTOs[i].dependentTasks;
            componentDetails.role = data.logConfigDTOs[i].role;
            componentDetails.version = data.logConfigDTOs[i].version;
            componentDetails.mandatoryDisabled = ko.observable(true);

            if (componentDetails.enabled()[0] === "true") {
              componentDetails.mandatoryDisabled(false);
            }

            self.loginConfigTableList().splice(data.logConfigDTOs[i].displayOrder, 0, componentDetails);
          }

          if (data.logConfigDTOs.length !== self.loginConfigList().length) {
            const set1 = new Set();

            for (let i = 0; i < data.logConfigDTOs.length; i++) {
              set1.add(data.logConfigDTOs[i].id);
            }

            for (let j = 0; j < self.loginConfigList().length; j++) {
              if (set1.has(self.loginConfigList()[j].id) === false) {
                const componentDetails = {};

                componentDetails.id = self.loginConfigList()[j].id;
                componentDetails.description = self.loginConfigList()[j].name;
                componentDetails.role = selectedRoleType;
                componentDetails.mandatory = ko.observable(false);
                componentDetails.uiComponentName = self.loginConfigList()[j].id;
                componentDetails.enabled = ko.observableArray([""]);
                componentDetails.dependentTasks = ko.observableArray([]);
                componentDetails.role = self.selectedRole();
                componentDetails.mandatoryDisabled = ko.observable(true);

                if (componentDetails.enabled()[0] === "true") {
                  componentDetails.mandatoryDisabled(false);
                }

                self.loginConfigTableList().push(componentDetails);
              }

            }
          }

          self.statusDatasource(new oj.ArrayTableDataSource(self.loginConfigTableList(), {
            idAttribute: "id"
          }));
        } else {
          self.loginConfigTableList([]);

          for (let i = 0; i < self.loginConfigList().length; i++) {
            const componentDetails = {};

            componentDetails.id = self.loginConfigList()[i].id;
            componentDetails.description = self.loginConfigList()[i].name;
            componentDetails.displayOrder = i;
            componentDetails.role = selectedRoleType;
            componentDetails.mandatory = ko.observable(false);
            componentDetails.uiComponentName = self.loginConfigList()[i].id;
            componentDetails.enabled = ko.observableArray([""]);
            componentDetails.dependentTasks = ko.observableArray([]);
            componentDetails.role = self.selectedRole();
            componentDetails.mandatoryDisabled = ko.observable(true);

            if (componentDetails.enabled()[0] === "true") {
              componentDetails.mandatoryDisabled(false);
            }

            self.loginConfigTableList().splice(i, 0, componentDetails);
          }

          self.statusDatasource(new oj.ArrayTableDataSource(self.loginConfigTableList(), {
            idAttribute: "id"
          }));
        }

        for (let i = 0; i < self.preferencesList().length; i++) {
          if (self.preferencesList()[i].preferenceId === "LOGIN_FLOW_REQUIRED" && self.preferencesList()[i].value === true) {
            self.showLoginConfigSelectOptions(true);
          }
        }

        ko.tasks.runEarly();
        self.showTable(true);
      });
    };

    self.displayOrderUp = function (rowContext, rowIndex) {
      if (!rowContext.mandatoryDisabled()) {
        self.showTable(false);
        ko.tasks.runEarly();

        const i = rowIndex;

        if (i > 0) {
          const rawNumbers = self.loginConfigTableList();

          self.loginConfigTableList.splice(i - 1, 2, rawNumbers[i], rawNumbers[i - 1]);
        }

        self.statusDatasource(new oj.ArrayTableDataSource(self.loginConfigTableList(), {
          idAttribute: "id"
        }));

        ko.tasks.runEarly();
        self.showTable(true);
      }
    };

    self.displayOrderDown = function (rowContext, rowIndex) {
      if (!rowContext.mandatoryDisabled()) {
        self.showTable(false);
        ko.tasks.runEarly();

        const i = rowIndex;

        if (i < self.loginConfigTableList().length - 1) {
          const rawNumbers = self.loginConfigTableList();

          self.loginConfigTableList.splice(i, 2, rawNumbers[i + 1], rawNumbers[i]);
        }

        self.statusDatasource(new oj.ArrayTableDataSource(self.loginConfigTableList(), {
          idAttribute: "id"
        }));

        ko.tasks.runEarly();
        self.showTable(true);
      }
    };

    self.holdingPatternChangeHandler = function (rowContext) {
      if (rowContext.enabled()[0] === "true") {
        rowContext.mandatoryDisabled(false);
      } else {
        rowContext.mandatoryDisabled(true);
        rowContext.mandatory(false);
      }
    };

    self.getPreferences = function () {
      RolePreferenceModel.getPreferences().done(function (data) {
        for (let i = 0; i < data.rolePreferencesList.length; i++) {
          if (data.rolePreferencesList[i].rolePreferenceId === "PARTY_MAPPING") {
            self.preferencesList()[0] = {
              text: data.rolePreferencesList[i].description,
              preferenceId: data.rolePreferencesList[i].rolePreferenceId,
              value: false
            };
          } else if (data.rolePreferencesList[i].rolePreferenceId === "CUSTOMER_PREFERENCES") {
            self.preferencesList()[1] = {
              text: data.rolePreferencesList[i].description,
              preferenceId: data.rolePreferencesList[i].rolePreferenceId,
              value: false
            };
          } else if (data.rolePreferencesList[i].rolePreferenceId === "ACCOUNT_ACCESS") {
            self.preferencesList()[2] = {
              text: data.rolePreferencesList[i].description,
              preferenceId: data.rolePreferencesList[i].rolePreferenceId,
              value: false
            };
          } else if (data.rolePreferencesList[i].rolePreferenceId === "APPROVAL") {
            self.preferencesList()[3] = {
              text: data.rolePreferencesList[i].description,
              preferenceId: data.rolePreferencesList[i].rolePreferenceId,
              value: false
            };
          } else if (data.rolePreferencesList[i].rolePreferenceId === "ACCOUNT_RELATIONSHIP_CHECK") {
            self.preferencesList()[4] = {
              text: data.rolePreferencesList[i].description,
              preferenceId: data.rolePreferencesList[i].rolePreferenceId,
              value: false
            };

            accountRelCheckLabel = data.rolePreferencesList[i].description;
          } else if (data.rolePreferencesList[i].rolePreferenceId === "LOGIN_FLOW_REQUIRED") {
            self.preferencesList()[5] = {
              text: data.rolePreferencesList[i].description,
              preferenceId: data.rolePreferencesList[i].rolePreferenceId,
              value: false
            };

          } else if (data.rolePreferencesList[i].rolePreferenceId === "LIMITS_CHECK") {
            self.preferencesList()[6] = {
              text: data.rolePreferencesList[i].description,
              preferenceId: data.rolePreferencesList[i].rolePreferenceId,
              value: false
            };
          }
        }

        self.isInitialScreenLoaded(true);
      });
    };

    self.getEnterpriseRoles();

    if (self.mode() === "CREATE") {
      self.getPreferences();
    }

    self.cancelRolePreference = function () {
      window.location = "dashboard.html";
    };

    self.createRolePreference = function () {
      if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
        for (let x = 0; x < self.entityLimitPackageMapArray().length; x++) {
          if (self.entityLimitPackageMapArray()[x].packageId().toString() === "") {
            Params.baseModel.showMessages(null, [self.resource.rolePreferences.limitPackageSelectionError], "ERROR");
            break;
          }
        }

        return;
      }

      self.preferencesListForPayload.removeAll();

      if (self.selectedRole()) {
        self.payload.roleId(self.selectedRole());

        for (let i = 0; i < self.preferencesList().length; i++) {
          self.preferencesListForPayload.push({
            roleId: self.preferencesList()[i].roleId,
            preferenceId: self.preferencesList()[i].preferenceId,
            value: self.preferencesList()[i].value
          });
        }

        self.payload.preferenceMappingDTOs = self.preferencesListForPayload();
        self.limitPackagePayload = getNewKoModel().limitPackage;
        self.limitPackagePayload.roleId(self.selectedRole());
        self.limitPackagePayload.entityLimitPackageDTOs.removeAll();

        if (self.entityLimitPackageMapArray() !== null) {
          for (let x1 = 0; x1 < self.entityLimitPackageMapArray().length; x1++) {
            const entityLimitPackageDTO = {
              targetUnit: "",
              entityLimitPackageMappingDTO: []
            };

            entityLimitPackageDTO.targetUnit = self.entityLimitPackageMapArray()[x1].entityId;
            self.entityLimitPackageMapArray()[x1].selectedLimitPackages.removeAll();

            for (let x2 = 0; x2 < self.entityLimitPackageMapArray()[x1].limitPackageDetails().length; x2++) {
              if (self.entityLimitPackageMapArray()[x1].limitPackageDetails()[x2].selectedLimitPackage()) {

                for (let b = 0; b < self.entityLimitPackageMapArray()[x1].limitPackages().length; b++) {
                  if (self.entityLimitPackageMapArray()[x1].limitPackages()[b].key.id === self.entityLimitPackageMapArray()[x1].limitPackageDetails()[x2].selectedLimitPackage()) {
                    self.entityLimitPackageMapArray()[x1].selectedLimitPackages.push(self.entityLimitPackageMapArray()[x1].limitPackages()[b]);
                  }
                }

                const entityLimitPackageMappingDTO = {
                  id: "",
                  limitPackage: {
                    key: {
                      id: "",
                      determinantValue: ""
                    }
                  },
                  assignedEntity: {
                    key: {
                      type: "",
                      determinantValue: "",
                      value: ""
                    }
                  },
                  utilizedBy: ""
                };

                entityLimitPackageMappingDTO.limitPackage.key.id = self.entityLimitPackageMapArray()[x1].limitPackageDetails()[x2].selectedLimitPackage;
                entityLimitPackageMappingDTO.limitPackage.key.determinantValue = self.entityLimitPackageMapArray()[x1].entityId;
                entityLimitPackageMappingDTO.assignedEntity.key.determinantValue = self.entityLimitPackageMapArray()[x1].entityId;
                entityLimitPackageMappingDTO.assignedEntity.key.type = "ROLE";
                entityLimitPackageMappingDTO.assignedEntity.key.value = self.selectedRole();
                entityLimitPackageDTO.entityLimitPackageMappingDTO.push(entityLimitPackageMappingDTO);
              }
            }

            if (entityLimitPackageDTO.entityLimitPackageMappingDTO.length > 0) {
              self.limitPackagePayload.entityLimitPackageDTOs.push(entityLimitPackageDTO);
            }
          }
        }
      }
    };

    self.showLimitPackage = function (data, event) {
      if (event.preferenceId === "LIMITS_CHECK" && event.value === true) {
        self.showLimitPackageSearchSection(true);
      } else {
        self.showLimitPackageSearchSection(false);
      }
    };

    self.showLoginConfig = function (data, event) {
      if (event.preferenceId === "LOGIN_FLOW_REQUIRED" && event.value === true) {
        self.showLoginConfigSelectOptions(true);
      } else {
        self.showLoginConfigSelectOptions(false);
      }
    };

    if (self.mode() === "EDIT") {
      self.payload = ko.mapping.fromJS(self.params.payload);
      self.payload.preferenceMappingDTOs(self.params.preferencesList());
      self.selectedRole(self.payload.roleId());
      self.showEdit(true);
    }

    self.submit = function () {
      if (self.loginConfigCurrentList().length !== 0) {

        self.loginConfigPayload.logConfigDTOs([]);

        for (let i = 0; i < self.loginConfigTableList().length; i++) {
          const updateConfigPayloadJSON = {};

          updateConfigPayloadJSON.id = self.loginConfigTableList()[i].id;
          updateConfigPayloadJSON.role = self.loginConfigTableList()[i].role;
          updateConfigPayloadJSON.displayOrder = i + 1;

          let boolValue = false;

          if (self.loginConfigTableList()[i].enabled()[0] === "true") {
            boolValue = true;
          }

          updateConfigPayloadJSON.enabled = boolValue;
          updateConfigPayloadJSON.mandatory = self.loginConfigTableList()[i].mandatory();
          updateConfigPayloadJSON.version = self.loginConfigTableList()[i].version;
          updateConfigPayloadJSON.description = self.loginConfigTableList()[i].description;
          updateConfigPayloadJSON.dependentTasks = self.loginConfigTableList()[i].dependentTasks;
          self.loginConfigPayload.logConfigDTOs.push(updateConfigPayloadJSON);
        }

      } else {
        for (let i = 0; i < self.loginConfigTableList().length; i++) {
          let payload = {};

          payload.id = self.loginConfigTableList()[i].id;
          payload.role = self.loginConfigTableList()[i].role;
          payload.displayOrder = i + 1;

          let boolValue = false;

          if (self.loginConfigTableList()[i].enabled()[0]) {
            boolValue = true;
          }

          payload.enabled = boolValue;
          payload.mandatory = self.loginConfigTableList()[i].mandatory();
          payload.description = self.loginConfigTableList()[i].description;
          payload.dependentTasks = self.loginConfigTableList()[i].dependentTasks();
          payload = ko.toJSON(payload);

          self.batchPayload.push({
            methodType: "POST",
            uri: {
              value: "/loginconfig"
            },
            payload: payload,
            headers: {
              "Content-Type": "application/json",
              "Content-Id": i + 1
            }
          });
        }
      }

      self.createRolePreference();

      const context = {};

      context.mode = "REVIEW";
      context.payload = ko.mapping.toJS(self.payload);
      context.loginmode = "LOGINCONFIG_REVIEW";
      context.loginConfigPayload = ko.mapping.toJS(self.loginConfigPayload);
      context.loginConfigTableList = self.loginConfigTableList;
      context.isEnterpriseRoleSelected = self.isEnterpriseRoleSelected;
      context.preferencesList = self.preferencesList;
      context.limitArray = self.limitArray;
      context.entityLimitPackageMapArray = self.entityLimitPackageMapArray;
      context.showLimitPackageSearchSection = self.showLimitPackageSearchSection;
      context.limitPackageDataLoaded = self.limitPackageDataLoaded;
      context.selectedRole = self.selectedRole;

      context.showLoginConfigSelectOptions = self.showLoginConfigSelectOptions;
      context.showTable = self.showTable;
      context.isInitialScreenLoaded = self.isInitialScreenLoaded;
      context.loginConfigCurrentList = self.loginConfigCurrentList;
      context.loginConfigList = self.loginConfigList;
      context.statusDatasource = self.statusDatasource;
      context.limitPackagePayload = self.limitPackagePayload;
      context.batchPayload = self.batchPayload;
      Params.dashboard.loadComponent("review-system-rules-map", context);
    };

  };
});
