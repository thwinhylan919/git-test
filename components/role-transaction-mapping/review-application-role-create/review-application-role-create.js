define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/authorization",
  "ojs/ojknockout-validation",
  "ojs/ojcheckboxset",
  "ojs/ojtable",
  "ojs/ojrowexpander",
  "ojs/ojflattenedtreetabledatasource",
  "ojs/ojjsontreedatasource"
], function (oj, ko, ApplicationRolesCreateReviewModel, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel.params);

    if (self.mode === "approval") {
      delete Object.assign(self, {
        ["approvalData"]: self.data
      }).data;
    }

    self.nls = resourceBundle;
    rootParams.dashboard.headerName(self.nls.common.roleTransactionMapping);
    self.roleDataLoaded = ko.observable(false);
    self.dataSource = ko.observable();
    self.selectedItem = ko.observable();
    self.accessPointTabs = ko.observableArray();
    self.isModuleFetched = ko.observable(false);
    self.dataSourceLoaded = ko.observable(false);
    self.isAccessPointFetched = ko.observable(false);
    self.dataSourceToBePassed = ko.observable();
    self.selectedScopeText = ko.observable();
    self.selectedAccessTypeDisp = ko.observable();
    rootParams.baseModel.registerElement("action-header");
    rootParams.baseModel.registerComponent("transaction-mapping", "role-transaction-mapping");

    self.columnArray = [{
      headerText: self.nls.headings.transactions,
      renderer: oj.KnockoutTemplateUtils.getRenderer("row_template", true)
    }, {
      headerText: self.nls.headings.perform,
      headerRenderer: oj.KnockoutTemplateUtils.getRenderer("checkbox_hdr_tmpl", true),
      renderer: oj.KnockoutTemplateUtils.getRenderer("checkbox_tmpl", true),
      id: self.nls.headings.perform
    }, {
      headerText: self.nls.headings.approve,
      headerRenderer: oj.KnockoutTemplateUtils.getRenderer("checkbox_hdr_tmpl", true),
      renderer: oj.KnockoutTemplateUtils.getRenderer("checkbox_tmpl", true),
      id: self.nls.headings.approve
    }, {
      headerText: self.nls.headings.view,
      id: self.nls.headings.view,
      headerRenderer: oj.KnockoutTemplateUtils.getRenderer("checkbox_hdr_tmpl", true),
      renderer: oj.KnockoutTemplateUtils.getRenderer("checkbox_tmpl", true)
    }];

    if (self.approvalData) {
      self.appRoleName = ko.observable(self.approvalData.applicationRoleDTO.applicationRoleName);
      self.appDescription = ko.observable(self.approvalData.applicationRoleDTO.applicationRoleDescription);
      self.selectedUser = ko.observable(self.approvalData.applicationRoleDTO.enterpriseRole);
      self.selectedAccessTypeDisp = ko.observable(self.approvalData.applicationRoleDTO.accessPointType === "INT" ? self.nls.common.menu.internal : self.nls.common.menu.external);
      self.selectedModuleName = ko.observableArray(self.approvalData.modules);
      self.selectedAccessType = ko.observable(self.approvalData.applicationRoleDTO.accessPointType);
      self.roleAccessPointMap = ko.observableArray();
    }

    self.accessPointTabChangeHandler = function (event) {
      self.createDataSource(event.detail.value);
    };

    let accessTransactionMap = [],
      currentActionCount = [],
      countActions = [];

    self.createDataSource = function (accessPoint) {
      if (self.approvalData && self.approvalData.accessTransactionMapDTO && self.approvalData.applicationRoleDTO && self.approvalData.modules) {
        accessTransactionMap = self.approvalData.accessTransactionMapDTO;

        ko.utils.arrayForEach(accessTransactionMap, function (data) {
          if (data.accessPoint === accessPoint) {
            const expectedDataSource = [];

            currentActionCount = [];
            countActions = [];

            for (let a = 0; a < 3; a++) {
              countActions.push(0);
              currentActionCount.push(0);
            }

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
      } else if (self.roleAccessPointMap().length > 0) {
        ko.utils.arrayForEach(self.roleAccessPointMap(), function (item) {
          if (item.accessPoint === accessPoint) {
            self.dataSourceToBePassed(item);
          }
        });

        self.dataSourceLoaded(true);
      }
    };

    if (self.selectedAccessType() === "EXT") {
      ko.utils.arrayForEach(self.scopes(), function (item) {
        if (self.selectedScopeType() === item.value) {
          self.selectedScopeText(item.text);
        }
      });
    }

    self.showTabBar = function () {
      let temp, i;

      if (self.selectedAccessType() === "INT") {
        ko.utils.arrayForEach(self.accessPoint(), function (item) {
          for (i = 0; i < self.selectedAccessPoint().length; i++) {
            if (item.value === self.selectedAccessPoint()[i]) {
              temp = {
                id: item.value,
                name: item.text
              };

              self.accessPointTabs.push(temp);
            }
          }
        });

        self.isAccessPointFetched(true);
        self.selectedItem(self.accessPointTabs()[0].id);
        self.createDataSource(self.accessPointTabs()[0].id);
      } else {
        self.createDataSource();
      }
    };

    if (self.approvalData && self.approvalData.accessTransactionMapDTO && self.approvalData.applicationRoleDTO && self.approvalData.modules) {
      self.moduleName = ko.observableArray();

      ApplicationRolesCreateReviewModel.fetchModuleName().done(function (data) {
        if (data.enumRepresentations) {
          self.moduleName().push({
            text: self.nls.headings.all,
            value: self.nls.headings.all
          });

          for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
            self.moduleName().push({
              text: data.enumRepresentations[0].data[i].description,
              value: data.enumRepresentations[0].data[i].code
            });
          }

          self.isModuleFetched(true);
        }
      });

      self.isSegmentFetched = ko.observable(false);

      if (self.approvalData.roleSegmentMap) {
        self.segmentEntityDisplay = ko.observableArray();
        self.selectedSegments = ko.observableArray();

        ko.utils.arrayForEach(self.approvalData.roleSegmentMap, function (item) {
          self.segmentEntityDisplay.push({
            value: item.segmentCode,
            label: item.segmentCode
          });

          self.selectedSegments.push(item.segmentCode);
          self.isSegmentFetched(true);
        });
      }

      self.selectedAccessPoint = ko.observableArray();
      self.selectedAccessPointArray = ko.observableArray(self.approvalData.accessTransactionMapDTO);

      for (let i = 0; i < self.selectedAccessPointArray().length; i++) {
        self.selectedAccessPoint().push(self.selectedAccessPointArray()[i].accessPoint);
      }

      self.accessPoint = ko.observableArray();

      const searchParameters = {
        accessType: self.selectedAccessType()
      };

      ApplicationRolesCreateReviewModel.fetchAccess(searchParameters).done(function (data) {
        for (let i = 0; i < data.accessPointListDTO.length; i++) {
          self.accessPoint().push({
            text: data.accessPointListDTO[i].description,
            value: data.accessPointListDTO[i].id
          });
        }

        self.showTabBar();
      });
    } else {
      self.showTabBar();
      self.selectedAccessTypeDisp = self.selectedAccessType() === "INT" ? self.nls.common.menu.internal : self.nls.common.menu.external;
      self.isModuleFetched(true);
      self.isAccessPointFetched(true);
    }

    self.parseEntitlement = function (entitlementData) {
      self.entitlements = ko.observableArray();
      self.selectedEntitlements = ko.observableArray();

      for (let i = 0; i < entitlementData.length; i++) {
        const name = entitlementData[i].entitlementName,
          id = entitlementData[i].entitlementId.split("_")[0],
          action = entitlementData[i].entitlementId.split("_")[entitlementData[i].entitlementId.split("_").length - 1];

        self.entitlementFound = ko.observable(false);

        if (self.entitlements().length !== 0) {
          for (let l = 0; l < self.entitlements().length; l++) {
            if (self.entitlements()[l].attr.id === id) {
              ko.utils.arrayForEach(self.entitlements()[l].actionTypeMap, function (item2) {
                if (item2.action === action) {
                  item2.id = entitlementData[i].entitlementId;
                  item2.action = action;
                  item2.selected = ko.observableArray();

                  if (entitlementData[i].mapped) {
                    item2.selected().push("true");
                    self.selectedEntitlements().push(item2);
                  }

                  item2.disable = ko.observable("true");
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

          ko.utils.arrayForEach(entitlementData[i].actionTypeMap, function (item1) {
            if (item1.action === action) {
              item1.id = entitlementData[i].entitlementId;
              item1.action = action;
              item1.selected = ko.observableArray();

              if (entitlementData[i].mapped) {
                item1.selected().push("true");
              }

              item1.disable = ko.observable("true");
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

      ko.utils.arrayForEach(self.entitlements(), function (dataset) {
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

        if (selectedCount !== 0 && entitlementCount !== 0 && selectedCount === entitlementCount) {
          dataset.attr.selected().push("true");
        }
      });

      return self.entitlements();
    };

    self.roleDataLoaded(true);

    self.back = function () {
      const params = {
        accessPoint: rootParams.rootModel.params.accessPoint,
        selectedUser: rootParams.rootModel.params.selectedUser,
        disabled: rootParams.rootModel.params.disabled,
        appRoleName: rootParams.rootModel.params.appRoleName,
        roleAccessPointMap: rootParams.rootModel.params.roleAccessPointMap,
        selectedAccessType: rootParams.rootModel.params.selectedAccessType,
        accessPointTabs: self.accessPointTabs,
        selectedModuleName: rootParams.rootModel.params.selectedModuleName,
        dataSourceLoaded: self.dataSourceLoaded,
        dataSourceToBePassed: self.dataSourceToBePassed,
        appDescription: rootParams.rootModel.params.appDescription,
        moduleName: rootParams.rootModel.params.moduleName,
        selectedItem: rootParams.rootModel.params.selectedItem,
        userType: rootParams.rootModel.params.userType,
        accessType: rootParams.rootModel.params.accessType,
        isModuleFetched: rootParams.rootModel.params.isModuleFetched,
        isNext: rootParams.rootModel.params.isNext,
        isAccessPointFetched: self.isAccessPointFetched,
        selectedAccessPoint : rootParams.rootModel.params.selectedAccessPoint,
        appRoleId: rootParams.rootModel.params.appRoleId,
        createObservables: rootParams.rootModel.params.createObservables,
        selectedStepValue: rootParams.rootModel.params.selectedStepValue,
        accessPointType: rootParams.rootModel.params.accessPointType,
        stepArray: rootParams.rootModel.params.stepArray,
        validationTracker: rootParams.rootModel.params.validationTracker,
        roleSegmentMap: rootParams.rootModel.params.roleSegmentMap,
        selectedStepLabel: rootParams.rootModel.params.selectedStepLabel,
        scopes: rootParams.rootModel.params.scopes,
        selectedScopeType: rootParams.rootModel.params.selectedScopeType,
        verifyAndEdit: rootParams.rootModel.params.verifyAndEdit
      };

      rootParams.dashboard.loadComponent("map-transaction", params);
    };
  };
});