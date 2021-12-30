define([
    "knockout",
    "jquery",
    "ojL10n!resources/nls/dashboard-create",
    "./model",
    "ojs/ojknockout", "ojs/ojvalidationgroup",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojselectcombobox",
    "ojs/ojknockout-validation"
], function (ko, $, locale, model) {
    "use strict";

    return function (params) {
        const self = this;

        ko.utils.extend(self, params.rootModel);

        self.arguments = {
            mode: null,
            ownDashboard: null,
            data: null
        };

        ko.utils.extend(self.arguments, params.rootModel.params);

        if (!self.arguments.roleSwitcherOptions) {
            self.arguments.roleSwitcherOptions = ko.observableArray();
        }

        params.baseModel.isDashboardBuilderContext(true);

        self.resourceBundle = locale;
        self.componentList = ko.observableArray();
        self.listPromise = null;
        self.selected = ko.observable(params.rootModel.previousState ? params.rootModel.previousState.data.params.currentEdit : "large");
        self.menuSelection = ko.observable();
        self.menuOptions = ko.observableArray();
        self.validationTracker = ko.observable();
        self.moduleComponents = ko.observableArray();
        self.startPaint = ko.observable(false);
        self.designLayouts = ko.observable();
        self.componentsLoaded = ko.observable(false);
        self.refreshDropdown = ko.observable(true);
        self.moduleList = ko.observableArray();
        params.baseModel.registerComponent("design-dashboard", "dashboard-template");
        params.baseModel.registerComponent("tab-layout", "dashboard-template");
        params.baseModel.registerComponent("mobile-layout", "dashboard-template");
        params.baseModel.registerComponent("preview-dashboard-design", "dashboard-template");
        params.baseModel.registerComponent("custom-layout", "dashboard-template");
        params.baseModel.registerElement("confirm-screen");
        params.baseModel.registerElement("page-section");
        params.baseModel.registerElement("modal-window");

        self.uiOptions = {
            menuFloat: "left",
            fullWidth: false,
            defaultOption: self.menuSelection
        };

        const getTargetLinkageModel = function (name, desc, module, segment, layout) {
                const KoModel = model.getTargetLinkageModel(name, desc, module, segment, layout);

                return ko.mapping.fromJS(KoModel);
            },
            navmap = {
                large: {
                    id: "large",
                    label: self.resourceBundle.labels.layout.desktop
                },
                medium: {
                    id: "medium",
                    label: self.resourceBundle.labels.layout.tab
                },
                small: {
                    id: "small",
                    label: self.resourceBundle.labels.layout.mobile
                }
            },
            currentView = self.selected();

        let userName, dashboardId;
        const segmentMap = {
                RETAIL: "retailuser",
                CORP: "corporateuser"
            },
            listGenerated = new Promise(function (resolve) {
                self.listPromise = resolve;
            });

        self.menuSelection.subscribe(function (nv) {
            self.selected(nv);
        });

        function generateLayout(tempLayout, layoutType, layoutArray) {

            layoutArray.forEach(function (component, index) {
                const componentIndex = self.moduleComponents().findIndex(function (search) {
                    return search.componentName === component.componentName;
                });

                if (componentIndex >= 0) {
                    const tempWidget = Object.assign({}, {
                            newWidth: Object.assign({}, self.moduleComponents()[componentIndex].width)
                        },
                        Object.assign({}, self.moduleComponents()[componentIndex]), Object.assign({}, layoutArray[index]));

                    tempWidget.newWidth[layoutType] = layoutArray[index].style.substring(6);
                    tempLayout.layout.layout[layoutType].splice(index, 1, tempWidget);
                }
            });
        }

        function backButtonHandling() {
            self.dashboardDesign = ko.mapping.fromJS(params.rootModel.previousState.data.dashboard);

            if (params.rootModel.previousState && !self.arguments.ownDashboard && params.rootModel.previousState.mode === "create") {
                self.dashboardDesign = getTargetLinkageModel(params.rootModel.previousState.data.dashboard.dashboardName, params.rootModel.previousState.data.dashboard.dashboardDescription, params.rootModel.previousState.data.dashboard.enterpriseRole, params.rootModel.previousState.data.dashboard.dashboardClass, params.rootModel.previousState.data.dashboard.layout);
                self.dashboardDesign.dashboardClass([params.rootModel.previousState.data.dashboard.dashboardClass]);
                self.dashboardDesign.dashboardClassValue([params.rootModel.previousState.data.dashboard.dashboardClassValue]);
                self.dashboardDesign.layout.layout.large.removeAll();
                self.dashboardDesign.layout.layout.medium.removeAll();
                self.dashboardDesign.layout.layout.small.removeAll();

                listGenerated.then(function () {
                    self.startPaint(false);
                    ko.tasks.runEarly();

                    const tempLayout = Object.assign({}, params.rootModel.previousState.data.dashboard);

                    generateLayout(tempLayout, "large", params.rootModel.previousState.data.dashboard.layout.layout.large.slice());
                    generateLayout(tempLayout, "medium", params.rootModel.previousState.data.dashboard.layout.layout.medium.slice());
                    generateLayout(tempLayout, "small", params.rootModel.previousState.data.dashboard.layout.layout.small.slice());

                    self.dashboardDesign.layout.layout.large([].concat(tempLayout.layout.layout.large));
                    self.dashboardDesign.layout.layout.medium([].concat(tempLayout.layout.layout.medium));
                    self.dashboardDesign.layout.layout.small([].concat(tempLayout.layout.layout.small));

                    setTimeout(function () {
                        self.startPaint(true);
                    }, 200);

                });
            }
        }

        function init() {
            if (self.arguments.mode === "edit" && !self.arguments.ownDashboard) {
                self.dashboardDesign = getTargetLinkageModel(self.arguments.data.dashboardName, self.arguments.data.dashboardDescription, self.arguments.data.dashboardClassValue, self.arguments.data.dashboardClass, self.arguments.data.layout);
                self.dashboardDesign.dashboardClass([self.dashboardDesign.dashboardClass()]);
                self.dashboardDesign.dashboardClassValue([self.dashboardDesign.dashboardClassValue()]);
            } else if (self.arguments.mode === "create" && !self.arguments.ownDashboard) {
                self.dashboardDesign = getTargetLinkageModel(self.arguments.data.dashboardName, self.arguments.data.dashboardDescription, self.arguments.data.module, self.arguments.data.segment);
                self.dashboardDesign.dashboardClass([self.dashboardDesign.dashboardClass()]);
                self.dashboardDesign.dashboardClassValue([self.dashboardDesign.dashboardClassValue()]);
            }
        }

        function adminGenerateDashboard(tempLayout, layoutType, layoutArray) {

            layoutArray.forEach(function (component, index) {
                const componentIndex = self.moduleComponents().findIndex(function (search) {
                    return search.componentName === component.componentName;
                });

                if (componentIndex >= 0) {
                    const tempWidget = Object.assign({}, {
                        newWidth: Object.assign({}, self.moduleComponents()[componentIndex].width)
                    }, Object.assign({}, self.moduleComponents()[componentIndex]), Object.assign({}, layoutArray[index]));

                    tempWidget.newWidth[layoutType] = layoutArray[index].style.substring(6);
                    tempLayout.layout.layout[layoutType].splice(index, 1, tempWidget);
                }
            });
        }

        self.desktopPromise = new Promise(function (resolve) {
            self.desktopPromiseReference = resolve;
        });

        self.tabPromise = new Promise(function (resolve) {
            self.tabPromiseReference = resolve;
        });

        self.mobilePromise = new Promise(function (resolve) {
            self.mobilePromiseReference = resolve;
        });

        self.createDashboardRendering = function () {
            const payload = Object.assign({}, ko.mapping.toJS(self.dashboardDesign, {
                ignore: ["creationDate"]
            }));

            payload.layout.layout.large = self.dashboardDesign.layout.layout.large().map(function (data) {
                const temp = {
                    componentName: data.componentName,
                    module: data.module,
                    data: JSON.stringify(data.data) || "{}",
                    style: "oj-lg-" + data.newWidth.large
                };

                return temp;
            });

            payload.layout.layout.medium = self.dashboardDesign.layout.layout.medium().map(function (data) {
                const temp = {
                    componentName: data.componentName,
                    module: data.module,
                    data: JSON.stringify(data.data) || "{}",
                    style: "oj-md-" + data.newWidth.medium
                };

                return temp;
            });

            payload.layout.layout.small = self.dashboardDesign.layout.layout.small().map(function (data) {
                const temp = {
                    componentName: data.componentName,
                    module: data.module,
                    data: JSON.stringify(data.data) || "{}",
                    style: "oj-sm-" + data.newWidth.small
                };

                return temp;
            });

            payload.dashboardClass = payload.dashboardClass ? payload.dashboardClass[0] : null;
            payload.dashboardClassValue = payload.dashboardClassValue ? payload.dashboardClassValue[0] : null;

            return payload;
        };

        self.updateUserOwnDashboard = function () {
            self.dashboardDesign.layout.layout.medium([].concat(self.dashboardDesign.layout.layout.large()));
            self.dashboardDesign.layout.layout.small([].concat(self.dashboardDesign.layout.layout.large()));
        };

        self.previewDashboardDesign = function () {
            if (!params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }

            if (!self.dashboardDesign.layout.layout.large().length) {
                params.baseModel.showMessages({}, [self.resourceBundle.noEmptyDashboard], "ERROR");

                return;
            }

            let datasource;

            if (self.arguments.ownDashboard && self.arguments.mode === "create") {
                self.updateUserOwnDashboard();
                self.dashboardDesign.dashboardName(params.baseModel.incrementIdCount());
                self.dashboardDesign.dashboardDescription(params.baseModel.incrementIdCount());

                datasource = ko.toJSON(ko.mapping.toJS(self.dashboardDesign, {
                    ignore: ["dashboardDesign", "creationDate", "enterpriseRole", "dashboardClass", "dashboardClassValue"]
                }));
            } else if (self.arguments.ownDashboard && self.arguments.mode === "edit") {
                self.updateUserOwnDashboard();

                datasource = ko.toJSON(ko.mapping.toJS(self.dashboardDesign, {
                    ignore: ["dashboardDesign", "creationDate", "enterpriseRole", "dashboardClass", "dashboardClassValue"]
                }));
            } else if (!self.arguments.ownDashboard && self.arguments.mode === "edit") {
                datasource = ko.toJSON(ko.mapping.toJS(self.dashboardDesign, {
                    ignore: ["creationDate"]
                }));
            }

            self.dashboardDesign.enterpriseRole(self.selectedEnterpriseRole);

            params.dashboard.loadComponent("preview-dashboard-design", {
                data: {
                    dashboard: self.createDashboardRendering(),
                    params: self.arguments.data || {},
                    selectedSegmentData: self.selectedSegment,
                    dashboardId: dashboardId,
                    userName: userName,
                    currentView: currentView,
                    datasource: datasource
                },
                mode: self.arguments.mode
            });

        };

        self.deleteUserDashboard = function () {
            if (dashboardId) {
                $("#deleteUserDashboardDialog").trigger("openModal");
            }
        };

        self.reloadScreen = function () {
            window.location.search = "";
        };

        self.deleteUserDashboardConfirm = function () {
            model.deleteUserDashboard(dashboardId).then(function (data, status, jqXhr) {
                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.resourceBundle.header,
                    confirmScreenExtensions: {
                        confirmScreenMsgEval: function () {
                            return self.resourceBundle.confirmationMessageDeletePersonalization;
                        },
                        isSet: true,
                        template: "confirm-screen/dashboard-builder"
                    }
                }, self);
            });
        };

        self.closeUserDashboardDeleteDialog = function () {
            $("#deleteUserDashboardDialog").hide();
        };

        function registerDashboardComponents(layout) {
            layout.forEach(function (component) {
                if (component.childPanel.length) {
                    component.childPanel.forEach(function (subcomponent) {
                        params.baseModel.registerComponent(subcomponent.componentName, "widgets/" + subcomponent.module);

                        if (typeof subcomponent.data === "string") {
                            subcomponent.data = JSON.parse(subcomponent.data.replace(/'/g, "\""));
                        }
                    });
                } else {
                    params.baseModel.registerComponent(component.componentName, "widgets/" + component.module);

                    if (typeof component.data === "string") {
                        component.data = JSON.parse(component.data.replace(/'/g, "\""));
                    }
                }
            });
        }

        function getListOfApplicationRoles() {
            return new Promise(function (resolve) {
                const listOfApplicationRoles = [];

                if (self.dashboardDesign.dashboardClass()[0] === "APPLICATION_ROLE") {
                    listOfApplicationRoles.push(self.dashboardDesign.dashboardClassValue()[0]);
                    resolve(listOfApplicationRoles);
                } else if (self.dashboardDesign.dashboardClass()[0] === "SEGMENT") {
                    model.fetchApplicationRolesForSegment(self.arguments.data.dashboardClassValue || self.arguments.data.module).then(function (data) {
                        if (data.segmentDTO.roles && data.segmentDTO.roles.length) {
                            data.segmentDTO.roles.forEach(function (role) {
                                listOfApplicationRoles.push(role.appRoleId);
                            });
                        }

                        resolve(listOfApplicationRoles);
                    });
                } else {
                    model.fetchDefaultApplicationRoles(self.selectedEnterpriseRole).then(function (data) {
                        data.applicationRoleDTOs.forEach(function (element) {
                            listOfApplicationRoles.push(element.applicationRoleName);
                        });

                        resolve(listOfApplicationRoles);
                    });
                }
            });
        }

        function main() {
            require(["load!framework/json/moduleComponents.json"], function (data) {

                self.componentList(data.components.filter(function (element) {
                    if (self.selectedEnterpriseRole) {
                        return element.segment.indexOf(self.selectedEnterpriseRole) > -1 || element.segment.indexOf("common") > -1;
                    } else if (self.arguments.ownDashboard) {
                        return element.segment.indexOf(segmentMap[params.dashboard.appData.segment]) > -1 || element.segment.indexOf("common") > -1;
                    }

                    return false;
                }));

                if (params.dashboard.appData.segment === "ADMIN") {
                    self.moduleComponents.removeAll();

                    getListOfApplicationRoles().then(function (listOfApplicationRoles) {
                        return model.fetchApplicationWidgets(params.baseModel.QueryParams.add("applicationRoles/components", {
                            applicationRoles: listOfApplicationRoles
                        }));
                    }).then(function (data) {
                        self.componentList(self.componentList().filter(function (element) {
                            return data.components.indexOf(element.componentName) > -1;
                        }));

                        self.componentList().forEach(function (item) {
                            if (!item.width.small) {
                                item.width.small = 12;
                            }

                            item.id = item.componentName.replace("-", "") + item.module.replace("-", "");
                            self.moduleComponents.push(item);
                        });

                        self.componentsLoaded(true);
                        self.listPromise();
                    });
                } else {
                    const isCustomAvailable = params.dashboard.userData.dashboardResponse.dashboardDTOs ? params.dashboard.userData.dashboardResponse.dashboardDTOs.find(function (element) {
                        return element.dashboardClass === "CUSTOM";
                    }) : null;

                    if (isCustomAvailable) {
                        dashboardId = isCustomAvailable.dashboardId;
                    }

                    self.componentList(params.baseModel.filterAuthorisedComponents(self.componentList(), "componentName"));

                    self.componentList().forEach(function (item) {
                        if (!item.width.small) {
                            item.width.small = 12;
                        }

                        item.id = item.componentName.replace("-", "") + item.module.replace("-", "");
                        self.moduleComponents.push(item);
                    });

                    self.componentsLoaded(true);
                    self.listPromise();
                }

            });

            if (params.rootModel.previousState) {
                backButtonHandling();
            } else {
                init();
            }

            if (self.arguments.ownDashboard) {
                self.menuOptions.push(Object.assign({}, navmap.large));
                self.menuSelection(navmap.large.id);
                self.selected(navmap.large.id);
            }

            if (self.arguments.mode !== "edit" && self.arguments.data.designChoice && self.arguments.data.designChoice.length) {
                self.arguments.data.designChoice.forEach(function (data, index) {
                    self.menuOptions.push(Object.assign({}, navmap[data]));

                    if (index === 0) {
                        self.menuSelection(navmap[data].id);
                        self.selected(navmap[data].id);
                    }
                });
            } else if (self.arguments.mode === "edit") {
                ko.utils.arrayPushAll(self.menuOptions, self.arguments.roleSwitcherOptions().map(function (switcher) {
                    if (switcher.id === "desktop") {
                        switcher = Object.assign({}, navmap.large);
                    } else if (switcher.id === "mobile") {
                        switcher = Object.assign({}, navmap.small);
                    } else {
                        switcher = Object.assign({}, navmap.medium);
                    }

                    return switcher;
                }));

                self.menuSelection(self.menuOptions()[0].id);
                self.selected(self.menuOptions()[0].id);
            }

            if (params.dashboard.appData.segment === "RETAIL") {
                params.dashboard.headerName(locale.header2);
            } else {
                params.dashboard.headerName(locale.header);
            }

            if (self.arguments.data && !self.arguments.ownDashboard && self.arguments.mode === "create") {
                self.selectedEnterpriseRole = self.arguments.data.selectedEnterpriseRole || null;
                self.selectedSegment = self.arguments.data.selectedSegment;
                self.startPaint(true);
            }

            if (self.arguments.data && self.arguments.mode === "edit" && !self.arguments.ownDashboard) {
                dashboardId = self.arguments.data.dashboardId || null;
                self.selectedEnterpriseRole = self.arguments.data.enterpriseRole;
                userName = self.arguments.data.userName || null;

                listGenerated.then(function () {
                    const tempLayout = Object.assign({}, self.arguments.data);

                    adminGenerateDashboard(tempLayout, "large", self.arguments.data.layout.layout.large.slice());
                    adminGenerateDashboard(tempLayout, "medium", self.arguments.data.layout.layout.medium.slice());
                    adminGenerateDashboard(tempLayout, "small", self.arguments.data.layout.layout.small.slice());

                    self.dashboardDesign.layout.layout.large([].concat(tempLayout.layout.layout.large));
                    self.dashboardDesign.layout.layout.medium([].concat(tempLayout.layout.layout.medium));
                    self.dashboardDesign.layout.layout.small([].concat(tempLayout.layout.layout.small));
                    self.startPaint(true);
                });

            } else if (self.arguments.ownDashboard) {
                listGenerated.then(function () {
                    let tempLayout, tempDefault;

                    if (params.rootModel.previousState) {
                        tempLayout = Object.assign({}, params.rootModel.previousState.data.dashboard);
                        tempDefault = params.rootModel.previousState.data.dashboard.layout.layout.large.slice();
                    } else {
                        tempLayout = Object.assign({}, self.arguments.data);

                        if (self.arguments.data.layout.layout.defaultLayout && self.arguments.data.layout.layout.defaultLayout.length) {
                            tempDefault = self.arguments.data.layout.layout.defaultLayout.slice();
                        } else {
                            tempDefault = self.arguments.data.layout.layout.large.slice();
                        }
                    }

                    tempLayout.layout.layout.large = [];
                    tempLayout.layout.layout.medium = [];
                    tempLayout.layout.layout.small = [];

                    tempDefault.forEach(function (component, index) {
                        const componentIndex = self.moduleComponents().findIndex(function (search) {
                            return search.componentName === component.componentName;
                        });

                        if (componentIndex > -1) {
                            let tempWidget;

                            if (params.rootModel.previousState) {
                                tempWidget = Object.assign({}, {
                                    newWidth: Object.assign({}, self.moduleComponents()[componentIndex].width)
                                }, Object.assign({}, self.moduleComponents()[componentIndex]));

                                tempWidget.data = JSON.parse(tempDefault[index].data);
                            } else {
                                tempWidget = Object.assign({}, {
                                    newWidth: Object.assign({}, self.moduleComponents()[componentIndex].width)
                                }, Object.assign({}, self.moduleComponents()[componentIndex]), Object.assign({}, tempDefault[index]));
                            }

                            tempWidget.newWidth.large = tempDefault[index].style.match(/oj-lg-(\d+)/)[1];
                            tempLayout.layout.layout.large.push(tempWidget);
                        }

                    });

                    self.dashboardDesign = getTargetLinkageModel(self.arguments.data.dashboardName, self.arguments.data.dashboardDescription, self.arguments.data.module, self.arguments.data.segment);
                    self.dashboardDesign.layout.layout.large(tempLayout.layout.layout.large);
                    self.dashboardDesign.layout.layout.medium(tempLayout.layout.layout.medium);
                    self.dashboardDesign.layout.layout.small(tempLayout.layout.layout.small);
                    self.startPaint(true);
                });
            }
        }

        if (params.dashboard.appData.segment !== "ADMIN") {
            model.getUserInformation().then(function (userData) {
                if (userData.dashboardResponse.resolutionLevel === "CUSTOM") {
                    model.readUserDashboard(userData.dashboardResponse.dashboardDTOs[0].dashboardId).then(function (data) {
                        self.arguments.ownDashboard = true;
                        registerDashboardComponents(data.dashboardDTO.layout.layout.large);
                        registerDashboardComponents(data.dashboardDTO.layout.layout.medium);
                        registerDashboardComponents(data.dashboardDTO.layout.layout.small);
                        self.arguments.data = data.dashboardDTO;
                        self.arguments.mode = "edit";
                        main();
                    });
                } else {
                    model.readDefaultDashboard(
                        userData.dashboardResponse.dashboardDTOs[0].dashboardClass,
                        userData.dashboardResponse.dashboardDTOs[0].dashboardClassValue).then(function (data) {
                        if (data.dashboardDTO.layout.layout.defaultLayout.length) {
                            if (!data.dashboardDTO.layout.layout.large.length) {
                                data.dashboardDTO.layout.layout.large = data.dashboardDTO.layout.layout.defaultLayout.slice();
                            }

                            if (!data.dashboardDTO.layout.layout.medium.length) {
                                data.dashboardDTO.layout.layout.medium = data.dashboardDTO.layout.layout.defaultLayout.slice();
                            }

                            if (!data.dashboardDTO.layout.layout.small.length) {
                                data.dashboardDTO.layout.layout.small = data.dashboardDTO.layout.layout.defaultLayout.slice();
                            }
                        }

                        self.arguments.ownDashboard = true;
                        registerDashboardComponents(data.dashboardDTO.layout.layout.large);
                        registerDashboardComponents(data.dashboardDTO.layout.layout.medium);
                        registerDashboardComponents(data.dashboardDTO.layout.layout.small);
                        self.arguments.data = data.dashboardDTO;
                        self.arguments.mode = "create";
                        main();
                    });
                }
            });
        } else {
            main();
        }
    };
});