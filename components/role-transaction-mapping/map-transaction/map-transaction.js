define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/authorization",
    "ojs/ojtrain",
    "ojs/ojinputtext",
    "ojs/ojcheckboxset",
    "ojs/ojradioset",
    "ojs/ojselectcombobox",
    "ojs/ojnavigationlist", "ojs/ojvalidationgroup",
    "ojs/ojknockout-validation"
], function (ko, $, MapTransactionModel, resourceBundle) {
    "use strict";

    return function (rootParams) {
        const self = this,
            inputParams = rootParams.rootModel.params;

        inputParams.createObservables(inputParams,
            []);

        ko.utils.extend(self, inputParams);
        self.nls = resourceBundle;

        /**
         * SetObservable - Define an observable if variable is undefined.
         *
         * @param  {type} value - Variable to be set.
         * @param  {string|boolean|number} rootParams - Defult value of variable.
         * @return {Function}       Observable returned.
         */
        function setObservable(value, rootParams) {
            if (!value) {
                return ko.observable(rootParams);
            }

            return value;
        }

        /**
         * SetObservableArray - Define an observableArray if variable is undefined.
         *
         * @param  {type} value - Variable to be set.
         * @return {Function}       ObservableArray returned.
         */
        function setObservableArray(value) {
            if (!value) {
                return ko.observableArray([]);
            }

            return value;
        }

        self.moduleName = ko.observableArray();
        self.selectedModuleName = setObservable(self.selectedModuleName);
        self.selectedAccessType = setObservable(self.selectedAccessType);
        self.selectedAccessPoint = setObservableArray(self.selectedAccessPoint);
        self.isAccessTypeFetched = ko.observable(false);
        self.isModuleFetched = ko.observable(false);
        self.transactionStatus = ko.observable();
        self.componentId = ko.observable(true);
        self.isAccessPointFetched = ko.observable(false);
        rootParams.baseModel.registerComponent("transaction-mapping", "role-transaction-mapping");
        rootParams.baseModel.registerComponent("application-role-create", "role-transaction-mapping");
        rootParams.baseModel.registerComponent("review-application-role-create", "role-transaction-mapping");
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.dashboard.headerName(self.nls.common.roleTransactionMapping);
        self.mappingFound = ko.observable(false);
        self.selectedItem = self.selectedItem?self.selectedItem: ko.observable();
        self.selectedAccessPointToCopy = ko.observable();
        self.destinedAccessPoints = ko.observableArray();
        self.verifyAndEdit = ko.observable(true);

        const actionIndex = [self.nls.headings.perform, self.nls.headings.approve, self.nls.headings.view];
        let countActions = [0, 0, 0];

        MapTransactionModel.fetchModuleName().done(function (data) {
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

        self.comboBoxChangeHandler = function (event) {
            if (event.detail.value.filter(function (e) {
                    return e.toUpperCase() === "ALL";
                }).length > 0) {
                self.selectedModuleName([]);

                ko.utils.arrayForEach(self.moduleName(), function (item) {
                    self.selectedModuleName().push(item.value);
                });
            }
        };

        MapTransactionModel.fetchAccessPointType().done(function (data) {
            for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.accessPointType().push({
                    text: data.enumRepresentations[0].data[i].description,
                    value: data.enumRepresentations[0].data[i].code
                });

                self.isAccessPointFetched(true);
            }
        });

        self.mapEntitlements = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }

            if (self.selectedAccessType() === "INT") {
                let temp, i;

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

                self.selectedItem(self.accessPointTabs()[0].id);
                self.createDataSource(self.accessPointTabs()[0].id);
                self.disabled(true);
            } else {
                self.createDataSource();
                self.disabled(true);
            }
        };

        self.backToCreate = function () {
            rootParams.dashboard.loadComponent("application-role-create", {
                verifyAndEdit: self.verifyAndEdit,
                appRoleName: self.appRoleName,
                appDescription: self.appDescription,
                selectedScopeType: self.selectedScopeType,
                selectedUser: self.selectedUser,
                selectedAccessType: self.selectedAccessType
            });
        };

        self.clear = function () {
            self.selectedAccessPoint([]);
            self.selectedModuleName([]);
            self.disabled(false);
            self.componentId(false);
            self.dataSourceLoaded(false);
            self.roleAccessPointMap([]);
            self.isNext(false);
            self.selectedAccessPoint([]);
            self.accessPointTabs([]);
            self.roleAccessPointMap([]);
            self.dataSourceToBePassed(null);
            self.destinedAccessPoints([]);
            countActions = [];
        };

        self.accessPointTabChangeHandler = function (event) {
            self.selectedItem(event.detail.value);

            //make an array which has selected accessPoint minus selected Item and pass it to dropdown
            const filteredTabList = self.accessPointTabs().filter(function (selectedTab) {
                if (selectedTab.id !== self.selectedItem()) {
                    return selectedTab;
                }

                return false;
            });

            self.destinedAccessPoints(filteredTabList);
            $("#tabChangeModal").trigger("openModal");
        };

        self.pushToRoleAccessPointMap = function (accessPoint, expectedDataSource, countActions, actionArray) {
            const roleAcessPoint = {
                accessPoint: null,
                expectedDataSource: null,
                countActions: null,
                currentActionCount: null
            };

            roleAcessPoint.accessPoint = accessPoint;
            roleAcessPoint.expectedDataSource = expectedDataSource;
            roleAcessPoint.countActions = countActions;
            roleAcessPoint.currentActionCount = actionArray;

            const filteredRoleAccessMap = self.roleAccessPointMap().filter(function (item) {
                if (item.accessPoint !== accessPoint) {
                    return item;
                }

                return false;
            });

            self.roleAccessPointMap(filteredRoleAccessMap);
            self.roleAccessPointMap().push(roleAcessPoint);
            self.isNext(true);
            self.dataSourceToBePassed(roleAcessPoint);
            self.dataSourceLoaded(true);
        };

        self.createDataSource = function (accessPoint) {
            self.mappingFound(false);

            if (self.roleAccessPointMap().length > 0) {
                ko.utils.arrayForEach(self.roleAccessPointMap(), function (item) {
                    if (item.accessPoint === accessPoint) {
                        self.dataSourceToBePassed(item);
                        self.mappingFound(true);
                        self.isNext(true);
                    }
                });
            }

            if (!self.mappingFound()) {
                const expectedDataSource = [],
                    searchParameters = {
                        module: self.selectedModuleName(),
                        categoryName: "",
                        entitlementName: ""
                    };

                countActions = [0, 0, 0];

                const actionArray = [0, 0, 0];

                MapTransactionModel.fetchEntitlements(searchParameters).done(function (data) {
                    // create a list of expectedDataSource and pass it to grid
                    for (let i = 0; i < data.entitlementGroupDTOs.length; i++) {
                        const parent = {
                            attr: {},
                            children: []
                        };

                        parent.attr.id = data.entitlementGroupDTOs[i].id;
                        parent.attr.displayName = data.entitlementGroupDTOs[i].displayName;
                        parent.attr.selected = ko.observableArray();

                        const subGroupDTOs = data.entitlementGroupDTOs[i].subGroupDTOs,
                            nestedChildren = [];

                        if (subGroupDTOs !== undefined) {
                            for (let j = 0; j < subGroupDTOs.length; j++) {
                                const child = {
                                    attr: {},
                                    children: []
                                };

                                child.attr.id = subGroupDTOs[j].id;
                                child.attr.displayName = subGroupDTOs[j].displayName;
                                child.attr.selected = ko.observableArray();

                                const entitlementData = data.entitlementGroupDTOs[i].subGroupDTOs[j].entitlements;

                                if (entitlementData !== undefined && entitlementData.length > 0) {
                                    const innermostChildren = self.parseEntitlement(entitlementData);

                                    child.children = innermostChildren;
                                    nestedChildren.push(child);
                                }
                            }

                            parent.children = nestedChildren;
                            expectedDataSource.push(parent);
                        }
                    }

                    self.disabled(true);
                    self.pushToRoleAccessPointMap(accessPoint, expectedDataSource, countActions, actionArray);
                });
            }
        };

        self.save = function () {
            const params = {
                selectedUser: self.selectedUser,
                appRoleName: self.appRoleName,
                appDescription: self.appDescription,
                selectedAccessType: self.selectedAccessType,
                scopes: self.scopes,
                accessPoint: self.accessPoint,
                selectedAccessPoint: self.selectedAccessPoint,
                roleAccessPointMap: self.roleAccessPointMap,
                moduleName: self.moduleName,
                isModuleFetched: self.isModuleFetched,
                selectedModuleName: self.selectedModuleName,
                createAppRolePolicy: self.createAppRolePolicy,
                selectedScopeType: self.selectedScopeType,
                createObservables: self.createObservables,
                selectedItem: self.selectedItem,
                disabled: rootParams.rootModel.params.disabled,
                isNext: self.isNext,
                appRoleId: self.appRoleId,
                selectedStepValue: self.selectedStepValue,
                accessPointType: self.accessPointType,
                stepArray: self.stepArray,
                validationTracker: self.validationTracker,
                roleSegmentMap: self.roleSegmentMap,
                selectedStepLabel: self.selectedStepLabel,
                verifyAndEdit: self.verifyAndEdit
            };

            rootParams.dashboard.loadComponent("review-application-role-create", params);
        };

        self.parseEntitlement = function (entitlementData) {
            self.entitlements = ko.observableArray();

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
                                    countActions[actionIndex.indexOf(action)] += 1;
                                    item2.id = entitlementData[i].entitlementId;
                                    item2.action = action;
                                    item2.selected = ko.observableArray();
                                    item2.disable = ko.observable("false");
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
                            countActions[actionIndex.indexOf(action)] += 1;
                            item1.id = entitlementData[i].entitlementId;
                            item1.action = action;
                            item1.selected = ko.observableArray();
                            item1.disable = ko.observable("false");
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

            return self.entitlements();
        };

        self.createAppRolePolicy = function () {
            const getNewKoModel = function () {
                const KoModel = MapTransactionModel.getNewModel();

                return ko.mapping.fromJS(KoModel);
            };

            self.rootModelInstance = getNewKoModel();
            self.rootModelInstance.applicationRoleDTO.applicationRoleName = self.appRoleName();
            self.rootModelInstance.applicationRoleDTO.applicationRoleDescription = self.appDescription();
            self.rootModelInstance.applicationRoleDTO.applicationRoleDisplayName = self.appRoleName();
            self.rootModelInstance.applicationRoleDTO.enterpriseRole = self.selectedUser();
            self.rootModelInstance.applicationRoleDTO.accessPointType = self.selectedAccessType();

            if (self.selectedAccessType() === "EXT") {
                self.rootModelInstance.applicationRoleDTO.accessPointScope = self.selectedScopeType();
            }

            self.rootModelInstance.modules = self.selectedModuleName();
            self.rootModelInstance.roleSegmentMap = self.roleSegmentMap();
            self.accessTrans = ko.observableArray([]);

            ko.utils.arrayForEach(self.roleAccessPointMap(), function (itemParent) {
                self.entitlementsArray = ko.observableArray([]);
                self.entitlementMainGroupArray = ko.observableArray([]);

                ko.utils.arrayForEach(itemParent.expectedDataSource, function (item) {
                    const entitlementMainGroup = {
                        id: item.attr.id,
                        displayName: item.attr.displayName,
                        subGroupDTOs: []
                    };

                    self.subGroupDTOs = ko.observableArray([]);

                    ko.utils.arrayForEach(item.children, function (childItem) {
                        const subGroupDTOsObject = {
                            id: childItem.attr.id,
                            displayName: childItem.attr.displayName,
                            entitlements: []
                        };

                        ko.utils.arrayForEach(childItem.children, function (grandChildItem) {
                            ko.utils.arrayForEach(grandChildItem.attr.actionTypeMap, function (action) {
                                const object = {
                                    entitlementName: grandChildItem.entitlementName,
                                    entitlementDisplayName: grandChildItem.entitlementDisplayName,
                                    entitlementId: action.id,
                                    mapped: false
                                };

                                if (action.selected()[0] === "true") {
                                    object.mapped = true;
                                }

                                if (object.entitlementId !== "") {
                                    subGroupDTOsObject.entitlements.push(object);
                                }
                            });
                        });

                        self.subGroupDTOs().push(subGroupDTOsObject);
                    });

                    entitlementMainGroup.subGroupDTOs = self.subGroupDTOs();
                    self.entitlementMainGroupArray().push(entitlementMainGroup);
                });

                const accessTransactionMapDTO = {
                    entitlementGroups: self.entitlementMainGroupArray(),
                    accessPoint: itemParent.accessPoint
                };

                self.accessTrans().push(accessTransactionMapDTO);
            });

            self.rootModelInstance.accessTransactionMapDTO = self.accessTrans();

            MapTransactionModel.createApplicationRolePolicy(ko.mapping.toJSON(self.rootModelInstance)).done(function (data, status, jqXhr) {
                self.transactionStatus(data.status);

                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.nls.header.transactionName
                }, self);
            });
        };

        self.replicateDatasource = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }

            ko.utils.arrayForEach(self.roleAccessPointMap(), function (item) {
                if (item.accessPoint === self.selectedAccessPointToCopy()) {
                    self.pushToRoleAccessPointMap(self.selectedItem(), item.expectedDataSource, item.countActions, item.currentActionCount);
                }
            });

            $("#accessPointModal").hide();
            $("#tabChangeModal").hide();
        };

        self.openModal = function () {
            $("#accessPointModal").trigger("openModal");
        };

        self.cancelDatasourceReplication = function () {
            self.createDataSource(self.selectedItem());
            $("#tabChangeModal").hide();
        };
    };
});