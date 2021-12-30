define([

  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/authorization",
  "ojs/ojswitch",
  "ojs/ojselectcombobox",
  "ojs/ojcheckboxset",
  "ojs/ojinputtext",
  "ojs/ojradioset",
  "ojs/ojknockout-validation"
], function(ko, $, ApplicationRoleReadModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.appRoleId = ko.observable();
    self.switchReadUpdate = ko.observable("true");
    self.nls = resourceBundle;
    self.appRoleName = ko.observable();
    self.appDescription = ko.observable();
    self.userType = ko.observable();
    self.selectedSegments = ko.observableArray();
    self.isSegmentFetched = ko.observable(false);
    self.mappedSegments = ko.observableArray();
    self.segmentEntityArray = ko.observableArray();
    self.segmentEntityDisplay = ko.observableArray();
    self.accessType = ko.observable();
    self.selectedAccessType = ko.observable();
    self.accessPoint = ko.observableArray();
    self.moduleName = ko.observableArray();
    self.selectedModuleName = ko.observableArray();
    self.selectedAccessPoint = ko.observableArray();
    self.isAccessPointFetched = ko.observable(false);
    self.isModuleFetched = ko.observable(false);
    self.dataloaded = ko.observable(false);
    self.selectedItem = ko.observable();
    self.accessPointTabs = ko.observableArray();
    self.dataSourceToBePassed = ko.observable();
    self.roleAccessPointMap = ko.observableArray();
    self.dataSourceLoaded = ko.observable(false);
    self.scopes = ko.observableArray();
    self.selectedAccessScope = ko.observable();
    self.selectedScopeText = ko.observable();
    self.httpStatus = ko.observable();
    self.transactionStatus = ko.observable();
    self.transactionName = ko.observable();
    self.disabled = ko.observable(true);
    self.isNext = ko.observable(true);
    self.isEdit = ko.observable(false);
    self.componentId = ko.observable(true);
    self.userSegments = ko.observableArray();

    let accessTransactionMap = [],
      currentActionCount = [],
      countActions = [];

    rootParams.baseModel.registerComponent("role-transaction-update", "role-transaction-mapping");
    rootParams.baseModel.registerComponent("application-role-search", "role-transaction-mapping");
    rootParams.baseModel.registerComponent("map-transaction", "role-transaction-mapping");
    rootParams.baseModel.registerElement("action-header");
    rootParams.baseModel.registerComponent("transaction-mapping", "role-transaction-mapping");
    rootParams.baseModel.registerElement("confirm-screen");
    rootParams.baseModel.registerElement("action-widget");
    self.transactionName(self.nls.common.roleTransactionMappingTransactionName);
    rootParams.dashboard.headerName(self.nls.common.roleTransactionMapping);
    self.insertAllModules = ko.observableArray();

    ApplicationRoleReadModel.fetchScopes().done(function(data) {
      for (let j = 0; j < data.accessPointScopeListDTO.length; j++)
        {self.scopes().push({
          text: data.accessPointScopeListDTO[j].description,
          value: data.accessPointScopeListDTO[j].id
        });}
    });

    ApplicationRoleReadModel.fetchModuleName().done(function (data) {
      if (data.enumRepresentations) {
        for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
          self.moduleName().push({
            text: data.enumRepresentations[0].data[i].description,
            value: data.enumRepresentations[0].data[i].code
          });

          if (self.selectedModuleName() && self.selectedModuleName().indexOf("All") !== -1) {
            self.selectedModuleName.push(data.enumRepresentations[0].data[i].code);
          }

          self.insertAllModules().push(data.enumRepresentations[0].data[i].code);

        }

        self.isModuleFetched(true);
      }
    });

    ApplicationRoleReadModel.fetchRoleTransactionMapping(rootParams.rootModel.params.appRoleId).done(function(data) {
      self.dataloaded(false);
      accessTransactionMap = data.applicationRolePolicyMapDTO.accessTransactionMapDTO;
      self.appRoleId(data.applicationRolePolicyMapDTO.applicationRoleDTO.applicationRoleId);
      self.version = data.applicationRolePolicyMapDTO.applicationRoleDTO.version;
      self.appRoleName(data.applicationRolePolicyMapDTO.applicationRoleDTO.applicationRoleName);
      self.appDescription(data.applicationRolePolicyMapDTO.applicationRoleDTO.applicationRoleDescription);
      self.userType(data.applicationRolePolicyMapDTO.applicationRoleDTO.enterpriseRole);

      if (data.applicationRolePolicyMapDTO.modules && data.applicationRolePolicyMapDTO.modules.length === 1 && data.applicationRolePolicyMapDTO.modules[0] === "All") {
        self.selectedModuleName(self.insertAllModules());
      }
      else {
        self.selectedModuleName(data.applicationRolePolicyMapDTO.modules);
      }

      self.selectedAccessType(data.applicationRolePolicyMapDTO.applicationRoleDTO.accessPointType);
      self.selectedAccessScope(data.applicationRolePolicyMapDTO.applicationRoleDTO.accessPointScope);

      if (data.applicationRolePolicyMapDTO.roleSegmentMap.length !== 0) {
        for (let k = 0; k < data.applicationRolePolicyMapDTO.roleSegmentMap.length; k++)
          {self.selectedSegments.push(data.applicationRolePolicyMapDTO.roleSegmentMap[k].segmentCode);}
      }

      if (self.selectedAccessType() === "INT") {
        if (accessTransactionMap) {
          for (let j = 0; j < data.applicationRolePolicyMapDTO.accessTransactionMapDTO.length; j++) {
            self.selectedAccessPoint().push(data.applicationRolePolicyMapDTO.accessTransactionMapDTO[j].accessPoint);
          }
        }

        const searchParameters = {
          accessType: self.selectedAccessType()
        };

        ApplicationRoleReadModel.fetchAccess(searchParameters).done(function(data) {
          self.accessPoint([]);

          for (let i = 0; i < data.accessPointListDTO.length; i++) {
            self.accessPoint().push({
              text: data.accessPointListDTO[i].description,
              value: data.accessPointListDTO[i].id
            });

            self.isAccessPointFetched(true);
          }

          self.mapEntitlements();
        });
      }

      if (self.selectedAccessType() === "EXT") {
        ko.utils.arrayForEach(self.scopes(), function(item) {
          if (self.selectedAccessScope() === item.value)
            {self.selectedScopeText(item.text);}
        });

        self.mapEntitlements();
      }

      if (self.userType() === "retailuser") {

        self.isSegmentFetched(false);
        self.userSegments([]);

        const searchParameter = {
          selectedUser: self.userType()
        };

        ApplicationRoleReadModel.fetchUserSegments(searchParameter).done(function(data) {
          self.userSegments([]);

          for (let j = 0; j < data.segmentdtos.length; j++) {
            self.userSegments().push({
              text: data.segmentdtos[j].name,
              value: data.segmentdtos[j].code
            });
          }

          self.isSegmentFetched(true);
        });
      }

      ApplicationRoleReadModel.fetchAccessPointType().done(function(accessTypeData) {
        for (let i = 0; i < accessTypeData.enumRepresentations[0].data.length; i++) {
          if (data.applicationRolePolicyMapDTO.applicationRoleDTO.accessPointType === accessTypeData.enumRepresentations[0].data[i].code) {
            self.accessType(accessTypeData.enumRepresentations[0].data[i].description);
            break;
          }
        }

        self.dataloaded(true);
      });

    });

    self.accessPointTabChangeHandler = function(event) {
      self.createDataSource(event.detail.value);
    };

    self.mapEntitlements = function() {
      if (self.selectedAccessType() === "INT") {
        let temp, i;

        ko.utils.arrayForEach(self.accessPoint(), function(item) {
          for (i = 0; i < self.selectedAccessPoint().length; i++) {
            if (item.value === self.selectedAccessPoint()[i]) {
              temp = {
                id: item.value,
                name: item.text
              };

              self.accessPointTabs().push(temp);
            }
          }
        });

        if (self.selectedAccessPoint().length > 0) {
          self.selectedItem(self.accessPointTabs()[0].id);

          for (i = 0; i < self.accessPointTabs().length; i++)
            {self.createDataSource(self.accessPointTabs()[i].id);}

          self.dataSourceToBePassed(self.roleAccessPointMap()[0]);
        }
      } else if (self.selectedAccessType() === "EXT") {
        self.createDataSource();
      }
    };

    self.createDataSource = function (accessPoint) {
      ko.utils.arrayForEach(accessTransactionMap, function (data) {
        if (data.accessPoint === accessPoint) {
          currentActionCount = [];
          countActions = [];

          for (let a = 0; a < 3; a++) {
            countActions.push(0);
            currentActionCount.push(0);
          }

          const expectedDataSource = [];

          // create a list of expectedDataSource and pass it to grid
          if (data.entitlementGroups) {
            for (let i = 0; i < data.entitlementGroups.length; i++) {
              const parent = {
                attr: {
                  id: "",
                  name: ""
                },
                children: []
              };

              parent.attr.id = data.entitlementGroups[i].id;
              parent.attr.displayName = data.entitlementGroups[i].displayName;
              parent.attr.selected = ko.observableArray();

              const subGroupDTOs = data.entitlementGroups[i].subGroupDTOs,
                nestedChildren = [];

              for (let j = 0; j < subGroupDTOs.length; j++) {
                const entitlementData = data.entitlementGroups[i].subGroupDTOs[j].entitlements;

                if (entitlementData && entitlementData.length > 0) {

                  const child = {
                    attr: {
                      id: "attr",
                      name: ""
                    },
                    children: []
                  };

                  child.attr.id = subGroupDTOs[j].id;
                  child.attr.displayName = subGroupDTOs[j].displayName;
                  child.attr.selected = ko.observableArray();
                  nestedChildren.push(child);

                  const innermostChildren = self.parseEntitlement(entitlementData);

                  child.children = innermostChildren;

                  let selectedChildcount = 0;

                  ko.utils.arrayForEach(innermostChildren, function (data) {
                    if (data.attr.selected()[0] === "true") {
                      selectedChildcount++;
                    }
                  });

                  if (selectedChildcount === innermostChildren.length) {
                    child.attr.selected().push("true");
                  }
                }
              }

              parent.children = nestedChildren;

              let selectednestedChildcount = 0;

              ko.utils.arrayForEach(nestedChildren, function (data1) {
                if (data1.attr.selected()[0] === "true") {
                  selectednestedChildcount++;
                }
              });

              if (selectednestedChildcount === nestedChildren.length) {
                parent.attr.selected().push("true");
              }

              expectedDataSource.push(parent);
            }
          }

          const roleAcessPoint = {
            accessPoint: null,
            expectedDataSource: null,
            countActions: countActions,
            currentActionCount: currentActionCount
          };

          roleAcessPoint.accessPoint = accessPoint;
          roleAcessPoint.expectedDataSource = expectedDataSource;
          self.roleAccessPointMap().push(roleAcessPoint);
          self.dataSourceToBePassed(roleAcessPoint);
          self.dataSourceLoaded(true);
        }
      });
    };

    self.parseEntitlement = function(entitlementData) {
      self.entitlements = ko.observableArray();

      for (let i = 0; i < entitlementData.length; i++) {
        const name = entitlementData[ i ].entitlementName,
        id = entitlementData[i].entitlementId.split("_")[0],
         action = entitlementData[ i ].entitlementId.split( "_" )[ entitlementData[ i ].entitlementId.split( "_" ).length - 1 ];

        self.entitlementFound = ko.observable(false);

        if (self.entitlements().length !== 0) {
          for (let l = 0; l < self.entitlements().length; l++) {
            if (self.entitlements()[l].attr.id === id) {
              ko.utils.arrayForEach(self.entitlements()[l].actionTypeMap, function(item2) {
                if (item2.action === action) {
                  item2.id = entitlementData[i].entitlementId;
                  item2.action = action;
                  item2.selected = ko.observableArray();

                  if (entitlementData[i].mapped) {
                    item2.selected().push("true");
                  } else {
                    item2.selected().push("false");
                  }

                  item2.disable = self.switchReadUpdate;
                }
              });

              self.entitlementFound(true);
              break;
            }
          }
        }

        if (!self.entitlementFound()) {
          entitlementData[i].actionTypeMap = [{
            id: "",
            action: self.nls.headings.perform,
            selected: ko.observableArray(),
            disable: ko.observable("true")
          }, {
            id: "",
            action: self.nls.headings.approve,
            selected: ko.observableArray(),
            disable: ko.observable("true")
          }, {
            id: "",
            action: self.nls.headings.view,
            selected: ko.observableArray(),
            disable: ko.observable("true")
          }];

          ko.utils.arrayForEach(entitlementData[i].actionTypeMap, function(item1) {
            if (item1.action === action) {
              item1.id = entitlementData[i].entitlementId;
              item1.action = action;
              item1.selected = ko.observableArray();

              if (entitlementData[i].mapped) {
                item1.selected().push("true");
              } else {
                item1.selected().push("false");
              }

              item1.disable = self.switchReadUpdate;
            }
          });

          entitlementData[i].attr = {
            id: id,
            displayName: name,
            actionTypeMap: entitlementData[i].actionTypeMap,
            selected: ko.observableArray()
          };

          self.entitlements.push(entitlementData[i]);
        }
      }

      ko.utils.arrayForEach(self.entitlements(), function(dataset) {
        let selectedCount = 0,
          entitlementCount = 0;

        for (let k = 0; k < dataset.actionTypeMap.length; k++) {
          if (dataset.actionTypeMap[k].id !== "") {
            countActions[k]++;
            entitlementCount++;
          }

          if (dataset.actionTypeMap[k].selected()[0] === "true") {
            currentActionCount[k]++;
            selectedCount++;
          }
        }

        if (selectedCount !== 0 && entitlementCount !== 0 && selectedCount === entitlementCount) {dataset.attr.selected().push("true");}
      });

      return self.entitlements();
    };

    self.back = function() {
      rootParams.dashboard.loadComponent("application-role-base", {});
    };

    self.deleteClicked = function() {
      $("#deleteConfirmationModal").trigger("openModal");
    };

    self.hideModal = function() {
      $("#deleteConfirmationModal").hide();
    };

    self.deleteAccess = function() {
      ApplicationRoleReadModel.deleteAccess(rootParams.rootModel.params.appRoleId).done(function(data, status, jqXhr) {
        self.httpStatus(jqXhr.status);
        self.transactionStatus(data);

        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.transactionName()
        }, self);
      });
    };

    self.edit = function() {
      self.dataloaded(false);
      self.roleAccessPointMap([]);
      self.dataSourceToBePassed(null);
      self.switchReadUpdate("false");
      self.accessPointTabs([]);
      self.mapEntitlements();
      self.dataSourceLoaded(false);
      self.disabled(false);
      self.isEdit(true);
      self.isNext(false);
      self.componentId(false);

      const params = {
      dataloaded: self.dataloaded,
      roleAccessPointMap: self.roleAccessPointMap,
      dataSourceToBePassed: self.dataSourceToBePassed,
      switchReadUpdate: self.switchReadUpdate,
      accessPointTabs: self.accessPointTabs,
      mapEntitlements: self.mapEntitlements,
      dataSourceLoaded: self.dataSourceLoaded,
      disabled: self.disabled,
      isEdit: self.isEdit,
      isNext: self.isNext,
      componentId: self.componentId,
      moduleName: self.moduleName,
      selectedModuleName: self.selectedModuleName,
      appRoleName: self.appRoleName,
      userType: self.userType,
      accessType: self.accessType,
      isModuleFetched: self.isModuleFetched,
      isAccessPointFetched: self.isAccessPointFetched,
      selectedAccessType: self.selectedAccessType,
      accessPoint: self.accessPoint,
      appDescription: self.appDescription,
      selectedAccessPoint: self.selectedAccessPoint,
      selectedItem: self.selectedItem,
      appRoleId: self.appRoleId,
      selectedAccessScope: self.selectedAccessScope,
      selectedSegments: self.selectedSegments,
      version: self.version,
      isSegmentFetched : self.isSegmentFetched,
      userSegments:self.userSegments
      };

      rootParams.dashboard.loadComponent("role-transaction-update", params);
    };

    self.controls= {
      ctrl6: function() {
        self.edit();
      }
    };
  };
});
