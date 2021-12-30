define([
    "knockout",
    "jquery",
    "ojL10n!resources/nls/view-dashboard-design",
    "./model",
    "ojs/ojarraydataprovider",
    "ojs/ojnavigationlist"
], function (ko, $, locale, model, ArrayDataProvider) {
    "use strict";

    const vm = function (params) {
        const self = this;

        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = locale;
        params.baseModel.isDashboardBuilderContext(true);

        if (params.dashboard.appData.segment === "RETAIL") {
            params.dashboard.headerName(self.resourceBundle.pageHeader2);
        } else {
            params.dashboard.headerName(self.resourceBundle.pageHeader);
        }

        const roleSwitcherOptions = ko.observableArray([{
                name: self.resourceBundle.labels.desktopDesign,
                icon: "dashboard-design/UX/desktop-icon.png",
                id: "desktop"
            },
            {
                name: self.resourceBundle.labels.tabDesign,
                icon: "dashboard-design/UX/tab-icon.png",
                id: "tab"
            },
            {
                name: self.resourceBundle.labels.mobileDesign,
                icon: "dashboard-design/UX/mobile-icon.png",
                id: "mobile"
            }
        ]);

        self.roleSwitcherDataProvider = new ArrayDataProvider(roleSwitcherOptions, {
            keyAttributes: "id"
        });

        self.appData = {};
        ko.utils.extend(self.appData, params.dashboard.appData);
        params.baseModel.registerElement("page-section");
        params.baseModel.registerElement("confirm-screen");
        params.baseModel.registerComponent("dashboard-create", "dashboard-template");
        params.baseModel.registerElement("modal-window");
        self.dashboardDesign = ko.observable();
        self.showDesktopView = ko.observable(false);
        self.showTabView = ko.observable(false);
        self.showMobileView = ko.observable(false);
        self.createOwnUserDashboard = false;
        self.userOwnDashboard = ko.observable(false);

        function registerDashboardComponents(layoutType) {
            self.dashboardDesign().layout.layout[layoutType].forEach(function (component) {
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

            self.showDesktopView(true);
        }

        if (self.params.data && self.params.data.dashboardId) {
            model.readDashboard(self.params.data.dashboardId).then(function (data) {
                if (data.dashboardDTO.factory) {
                    if (params.baseModel.isEmpty(data.dashboardDTO.layout.layout.large)) {
                        data.dashboardDTO.layout.layout.large = data.dashboardDTO.layout.layout.defaultLayout.slice();
                    }

                    if (params.baseModel.isEmpty(data.dashboardDTO.layout.layout.medium)) {
                        data.dashboardDTO.layout.layout.medium = data.dashboardDTO.layout.layout.defaultLayout.slice();
                    }

                    if (params.baseModel.isEmpty(data.dashboardDTO.layout.layout.small)) {
                        data.dashboardDTO.layout.layout.small = data.dashboardDTO.layout.layout.defaultLayout.slice();
                    }
                } else {
                    if (!data.dashboardDTO.layout.layout.large.length) {
                        roleSwitcherOptions.remove(function (element) {
                            return element.id === "desktop";
                        });
                    }

                    if (!data.dashboardDTO.layout.layout.medium.length) {
                        roleSwitcherOptions.remove(function (element) {
                            return element.id === "tab";
                        });
                    }

                    if (!data.dashboardDTO.layout.layout.small.length) {
                        roleSwitcherOptions.remove(function (element) {
                            return element.id === "mobile";
                        });
                    }
                }

                self.dashboardDesign(data.dashboardDTO);
                registerDashboardComponents("large");
                registerDashboardComponents("medium");
                registerDashboardComponents("small");
            });
        } else {
            model.getUserInformation().then(function (response) {
                if (response.dashboardResponse.resolutionLevel === "CUSTOM") {
                    model.readUserDashboard(response.dashboardResponse.dashboardDTOs[0].dashboardId).then(function (data) {
                        self.dashboardDesign(data.dashboardDTO);
                        registerDashboardComponents("large");
                        registerDashboardComponents("medium");
                        registerDashboardComponents("small");
                        self.userOwnDashboard(true);
                        self.createOwnUserDashboard = true;
                    });
                } else {
                    model.readDefaultDashboard(response.dashboardResponse.dashboardDTOs[0].dashboardClass, response.dashboardResponse.dashboardDTOs[0].dashboardClassValue).then(function (data) {

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

                        self.dashboardDesign(data.dashboardDTO);

                        registerDashboardComponents("large");
                        registerDashboardComponents("medium");
                        registerDashboardComponents("small");
                        self.createOwnUserDashboard = false;
                    });
                }
            });
        }

        self.createMyOwnDashboard = function () {
            params.dashboard.loadComponent("dashboard-create", {
                mode: "create",
                ownDashboard: true
            });
        };

        self.computeStyle = function (style, currentView) {
            if (style) {
                const regex = new RegExp("oj-" + currentView + "-(\\d+)"),
                    match = style.match(regex);

                if (match) {
                    return "oj-" + currentView + "-" + match[1];
                }

                return "oj-" + currentView + "-12";

            }

            return "oj-" + currentView + "-12";
        };

        self.deleteDashboard = function () {
            model.deleteDesignDashboard(self.dashboardDesign().dashboardId).done(function (data, status, jqXhr) {
                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr
                }, self);
            });
        };

        self.reloadScreen = function () {
            window.location.search = "";
        };

        self.deleteMyOwnDashboard = function () {
            model.deleteUserDesignDashboard(self.dashboardDesign().dashboardId).done(function (data, status, jqXhr) {
                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.resourceBundle.pageHeader,
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

        self.confirmDelete = function () {
            $("#deleteDialog").trigger("openModal");
        };

        self.closeDeleteDialog = function () {
            $("#deleteDialog").hide();
        };

        self.confirmDelete2 = function () {
            $("#deleteDialog2").trigger("openModal");
        };

        self.closeDeleteDialog2 = function () {
            $("#deleteDialog2").hide();
        };

        let currentView = "large";

        self.startRendering = ko.observable(true);
        self.viewType = ko.observable("desktop");

        self.viewType.subscribe(function (newValue) {
            self.showDesktopView(false);
            self.showTabView(false);
            self.showMobileView(false);

            if (newValue === "desktop") {
                self.showDesktopView(true);
                currentView = "large";
            } else if (newValue === "tab") {
                self.showTabView(true);
                currentView = "medium";
            } else if (newValue === "mobile") {
                self.showMobileView(true);
                currentView = "small";
            }
        });

        self.createUserDashboard = function () {
            params.dashboard.loadComponent("dashboard-create", {
                mode: "create",
                data: self.dashboardDesign(),
                ownDashboard: true
            });
        };

        self.editMyOwnDashboard = function () {
            params.dashboard.loadComponent("dashboard-create", {
                mode: "edit",
                data: self.dashboardDesign(),
                currentView: currentView,
                ownDashboard: true
            });
        };

        self.editDashboard = function () {
            if (self.appData.segment !== "ADMIN") {
                if (self.createOwnUserDashboard) {
                    self.editMyOwnDashboard();
                } else {
                    self.createUserDashboard();
                }
            } else {
                params.dashboard.loadComponent("dashboard-create", {
                    mode: "edit",
                    data: self.dashboardDesign(),
                    roleSwitcherOptions: roleSwitcherOptions,
                    currentView: currentView,
                    ownDashboard: false
                });
            }
        };

        const focusableElementsString = "input:not([disabled]), a[href], area[href], select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex=\"0\"], [contenteditable]";

        $(document).on("keydown", "#viewDashboard", function (e) {
            if (e.keyCode === 9) {
                setTimeout(function () {
                    let modal;

                    if (self.showDesktopView()) {
                        modal = document.getElementById("desktop-review-container");
                    } else if (self.showTabView()) {
                        modal = document.getElementById("tab-review-container");
                    } else if (self.showMobileView()) {
                        modal = document.getElementById("mobile-review-container");
                    }

                    let focusableElements = modal.querySelectorAll(focusableElementsString);

                    focusableElements = Array.prototype.slice.call(focusableElements);

                    const firstTabStop = focusableElements[0],
                        lastTabStop = focusableElements[focusableElements.length - 1];

                    if (document.activeElement === firstTabStop) {
                        document.getElementById("editCurrentDashboard").focus();
                    } else if (document.activeElement === lastTabStop) {
                        document.getElementById("dashboardSwitchView").focus();
                    }
                }, 200);
            }
        });
    };

    return vm;
});