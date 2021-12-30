define([
        "knockout",
        "jquery",
        "ojs/ojcore",
        "./model",
        "platform",
        "framework/js/configurations/config",
        "ojL10n!resources/nls/dashboard",
        "ojs/ojrouter",
        "framework/js/plugins/navigation",
        "ojs/ojoffcanvas"
    ],
    function (ko, $, oj, DashboardModel, Platform, Configurations, locale, Router, Navigation) {
        "use strict";

        Router.defaults.baseUrl = window.location.pathname;
        Router.defaults.urlAdapter = new Router.urlParamAdapter();
        Router.defaults.rootInstanceName = "page";

        const router = Router.rootInstance,
            routerData = {},
            componentsWithStates = {
                "manage-accounts": function (params) {
                    return params.defaultTab;
                }
            };

        routerData.home = {
            dashboard: null,
            isDashboard: true
        };

        function changeLoaderState(state) {
            if (["start", "stop"].indexOf(state) === -1) {
                return;
            }

            if (state === "start" && !$("body").hasClass("page-is-changing")) {
                $("body").addClass("page-is-changing");
            } else if (state === "stop" && $("body").hasClass("page-is-changing")) {
                $("body").removeClass("page-is-changing");
            }
        }

        function computeState(state, params) {
            if (componentsWithStates[state]) {
                return "~" + componentsWithStates[state](params);
            }

            return "";
        }

        Platform.getInstance().then(function (plateform) {
            const link = document.createElement("link");

            link.type = "image/x-icon";
            link.rel = "shortcut icon";
            link.href = plateform("getImageBaseURL") + "/favicon.ico";
            document.getElementsByTagName("head")[0].appendChild(link);
        });

        return function (rootParams) {
            const self = this,
                genericViewModel = rootParams.rootModel;

            self.userData = {};
            self.locale = locale;
            self.router = router;

            let currentModule, initialViewPort = rootParams.baseModel.getDeviceSize();
            const appData = {};

            self.isDashboard = ko.observable(true);
            self.isHelpAvailable = ko.observable(false);
            self.modalComponent = ko.observable();
            self.oracleLiveComponent = ko.observable();
            self.fabRequired = ko.observable(true);
            self.backAllowed = ko.observable(false);
            self.componentReset = ko.observable(false);

            self.headerName = ko.observable();
            self.headerCaption = ko.observable();
            self.fatcaCheckRequired = ko.observable(false);

            self.rightPanelData = {
                isOpen: ko.observable(),
                componentName: null,
                data: null,
                closeHandler: null,
                header: null
            };

            const pageTitle = ko.pureComputed(function () {
                return rootParams.baseModel.format("{txn_name} - {bankName}", {
                    txn_name: self.headerName() || self.locale.bankName,
                    bankName: self.locale.bankName
                });
            });

            router.configure(function (stateId) {
                let state;

                if (stateId) {
                    const data = routerData[stateId];

                    if (data) {
                        state = {
                            value: data,
                            title: pageTitle,
                            canEnter: data.canEnter
                        };
                    }
                }

                return state;
            });

            self.helpComponent = {
                componentName: ko.observable(),
                params: ko.observable()
            };

            (function (registerElement) {
                registerElement([
                    "responsive-img",
                    "page-section",
                    "row",
                    "flow",
                    "virtual-keyboard",
                    "manage-accounts",
                    "confirm-screen",
                    "nav-bar",
                    "modal-window",
                    "expandable-preview"
                ]);

                registerElement("menu", "core");
                registerElement("offline-notification", "core");
                registerElement("error", "core");
                registerElement("header", "core");
                registerElement("footer", "core");
                registerElement("docked-menu", "core");
                registerElement("banner", "core");
                registerElement("dashboard-container", "core");
                registerElement("confirm-dialog", "core");

            })(rootParams.baseModel.registerElement);

            rootParams.baseModel.registerComponent("oracle-live", "login");
            rootParams.baseModel.registerComponent("change-password", "change-password");
            rootParams.baseModel.registerComponent("compliance-base", "compliance");

            function clearResetEvents() {
                $(document).off();
                $(window).off();
                rootParams.baseModel.processAllEvents("addEventListener");

                $(document).on("focus", ".oj-inputtext-input", function () {
                    $(this).attr("autocomplete", "off");
                });
            }

            function resetVM() {
                rootParams.baseModel.isDashboardBuilderContext(false);
                self.helpComponent.componentName(null);
                ko.tasks.runEarly();
                self.headerName(null);
                self.headerCaption(null);
                changeLoaderState("start");
                window.scrollTo(0, 0);
            }

            function dbAuthenticator() {
                if (Configurations.authentication.type === "OBDXAuthenticator") {
                    if (!self.userData.userProfile) {
                        if (window.location.pathname.match(Configurations.authentication.pages.securePage)) {
                            currentModule.homeComponent = "login-form";
                            currentModule.moduleName = "widgets/pre-login";
                        }
                    }
                }
            }

            function componentChange(componentName, params) {
                params = params || {};
                resetVM();

                const newState = componentName + computeState(componentName, params);

                routerData[newState] = {
                    component: ko.observable(componentName),
                    params: params
                };

                routerData[router.stateId()].previousState = params;

                Promise.all([rootParams.baseModel.closeNotificationMessages("error"), Navigation.beforeNavigation(routerData[newState], self.userData, rootParams.baseModel.large())]).then(function () {
                    router.go(newState).finally(function () {
                        self.componentReset(true);
                    });
                });

                self.helpComponent.componentName(componentName);
                self.fabRequired(true);
                self.isDashboard(false);
                self.backAllowed(true);
            }

            self.loadComponent = function (componentName, params) {
                clearResetEvents();
                rootParams.baseModel.onTFAScreen(false);
                self.componentReset(false);
                componentChange(componentName, params);
            };

            self.switchModule = function (module) {
                if (typeof module === "boolean" && module) {
                    return self.modalComponent("confirm-dialog");
                } else if (!module) {
                    module = currentModule.dashboard || "home";
                }

                if (router.stateId() === module) {
                    return;
                }

                rootParams.baseModel.onTFAScreen(false);
                clearResetEvents();

                if (!routerData[module]) {
                    routerData[module] = {
                        dashboard: module,
                        isDashboard: true
                    };
                }

                Promise.all([rootParams.baseModel.closeNotificationMessages(), Navigation.beforeNavigation(routerData[module], self.userData, rootParams.baseModel.large())]).then(function () {
                    resetVM();
                    self.fabRequired(true);
                    self.isDashboard(true);

                    router.go(module);
                });
            };

            self.hideDetails = function () {
                rootParams.baseModel.closeNotificationMessages();
                self.helpComponent.componentName(null);
                ko.tasks.runEarly();
                history.back();
            };

            self.targetLoaded = function () {
                changeLoaderState("stop");
            };

            function changeRightPanelState(state) {
                if (["close", "open"].indexOf(state) === -1) {
                    return;
                }

                return oj.OffcanvasUtils[state]({
                    selector: "#endDrawer",
                    content: ".main-container",
                    displayMode: "overlay",
                    edge: "end",
                    modality: "modal",
                    autoDismiss: "none"
                });
            }

            function openRightPanel(componentName, data, header, closeHandler) {
                self.rightPanelData.componentName = componentName;
                self.rightPanelData.data = data;
                self.rightPanelData.header = header;

                self.rightPanelData.closeHandler = function () {
                    if (closeHandler) {
                        closeHandler();
                    }

                    changeRightPanelState("close").then(function () {
                        self.rightPanelData.isOpen(false);
                    });
                };

                self.rightPanelData.isOpen(true);
                changeRightPanelState("open");
            }

            const onDockedMenuSelect = function () {
                    return self.changeMenuState("close");
                },

                resizeHandler = ko.computed(function () {
                    if (initialViewPort !== rootParams.baseModel.getDeviceSize()) {
                        initialViewPort = rootParams.baseModel.getDeviceSize();
                        self.changeMenuState("close");
                    }

                    return rootParams.baseModel.large() ^ rootParams.baseModel.medium() ^ rootParams.baseModel.small();
                }, self);

            self.getDashboardContext = function () {
                return Object.seal({
                    isDashboard: self.isDashboard,
                    isHelpAvailable: self.isHelpAvailable,
                    headerName: self.headerName,
                    headerCaption: self.headerCaption,
                    helpComponent: self.helpComponent,
                    loadComponent: self.loadComponent,
                    switchModule: self.switchModule,
                    hideDetails: self.hideDetails,
                    userData: self.userData,
                    modalComponent: self.modalComponent,
                    resetModalComponent: self.resetModalComponent,
                    appData: appData,
                    openRightPanel: openRightPanel,
                    getTaxonomyDefinition: DashboardModel.getTaxonomyDefinition,
                    onDockedMenuSelect: onDockedMenuSelect,
                    fabRequired: self.fabRequired,
                    backAllowed: self.backAllowed,
                    rootRouter: router
                });
            };

            self.menuOptionSelect = function (data, menuStateTogglePromise) {
                changeLoaderState("start");

                (menuStateTogglePromise || Promise.resolve()).then(function () {
                    if (data.name === "DASHBOARD") {
                        return self.switchModule();
                    }

                    if (data.type && data.type === "MODULE") {
                        return self.switchModule(data.name);
                    } else if (data.type && data.type === "PAGE") {
                        rootParams.baseModel.switchPage(data.location.args, data.location.isSecure);

                        return false;
                    } else if (data.type && data.type === "FUNCTION") {
                        rootParams.baseModel[data.functionName](data.params);
                        changeLoaderState("stop");
                    } else if (data.type && data.type === "MODAL") {
                        rootParams.baseModel.registerComponent(data.name, data.module);
                        self.modalComponent(data.name);
                    } else if (data.applicationType) {
                        self.loadComponent("manage-accounts", {
                            applicationType: data.applicationType,
                            defaultTab: data.name,
                            moduleURL: data.moduleURL,
                            jsonData: data
                        });
                    } else if (data.class === "flow") {
                        self.loadComponent("flow", {
                            flowName: data.name,
                            flowStageRootModel: data.stageRootModel
                        });
                    } else {
                        if (data.class === "transaction") {
                            rootParams.baseModel.registerTransaction(data.name, data.module);
                        } else {
                            rootParams.baseModel.registerComponent(data.name, data.module);
                        }

                        self.loadComponent(data.name, {
                            type: data.type,
                            jsonData: data
                        });
                    }
                });
            };

            self.changeMenuState = function (state) {
                if (!genericViewModel.menuNavigationAvailable) {
                    return;
                }

                if (["close", "open", "toggle"].indexOf(state) === -1) {
                    return;
                }

                return oj.OffcanvasUtils[state]({
                    selector: "#innerDrawer",
                    content: ".main-container",
                    displayMode: "push",
                    edge: "start",
                    modality: "none"
                }).then(function () {
                    // Detect IE 11, window.document.documentMode evaluates to true only for IE.
                    if (state !== "close" && window.document.documentMode) {
                        $("#innerDrawer").css("transform", "none");
                    }
                });
            };

            $("#innerDrawer").on("ojclose",
                function () {
                    $("span.hamburger-icon").removeClass("hide");
                });

            $("#innerDrawer").on("ojopen",
                function () {
                    $("span.hamburger-icon").addClass("hide");
                });

            let partyData;

            Router.transitionedToState.add(function (result) {
                if (result.hasChanged && !result.router.parent) {
                    Navigation.afterNavigation();

                    if (result.newState.value.isDashboard) {
                        self.isDashboard(true);
                    }

                    if (result.newState.id === "confirm-screen") {
                        routerData[result.newState.id].canEnter = routerData[result.oldState.id].canEnter = function () {
                            if (result.router.direction === "back") {
                                return false;
                            }
                        };
                    }
                }
            });

            Router.sync().finally(function () {
                genericViewModel.userInfoPromise.then(function (data) {
                    currentModule = data.currentModule;
                    $.extend(appData, data.appData);
                    $.extend(self.userData, data.userData);
                    rootParams.baseModel.dispatchCustomEvent(window, "menuChanged");
                    dbAuthenticator();

                    let initialState = null;

                    if (self.userData.userProfile) {
                        genericViewModel.isUserDataSet(true);

                        Platform.getInstance().then(function (platform) {
                            platform("postLogin", self.userData.userProfile);
                        });
                    }

                    if (!currentModule.homeComponent) {
                        self.isDashboard(true);

                        currentModule.dashboard = initialState = "home";
                    } else {
                        rootParams.baseModel.registerComponent(currentModule.homeComponent, currentModule.moduleName);

                        routerData[currentModule.homeComponent] = {
                            component: currentModule.homeComponent,
                            params: genericViewModel.queryMap && genericViewModel.queryMap.params ? JSON.parse(genericViewModel.queryMap.params) : null,
                            previousState: null
                        };

                        if (genericViewModel.queryMap && genericViewModel.queryMap.homeComponent === currentModule.homeComponent) {
                            genericViewModel.queryMap.homeComponent = null;
                            genericViewModel.queryMap.homeModule = null;
                            genericViewModel.queryMap.params = null;
                        }

                        initialState = currentModule.homeComponent;

                        self.isDashboard(false);

                    }

                    Navigation.beforeNavigation(routerData[initialState], self.userData, rootParams.baseModel.large()).then(function () {
                        router.go(initialState).then(function () {
                            self.componentReset(true);
                        });
                    });

                    if (genericViewModel.menuNavigationAvailable) {
                        if (self.userData.userProfile && self.userData.userProfile.partyId && self.userData.userProfile.partyId.value) {
                            DashboardModel.fetchPartyDetails().then(function (data) {
                                if (data.party.fatcaCheckRequired) {
                                    partyData = data.party;
                                    self.fatcaCheckRequired(true);
                                }
                            });
                        }
                    }

                    rootParams.baseModel.enqueueTask(function () {
                        self.oracleLiveComponent("oracle-live");
                    });
                });
            });

            self.filterMenu = function (menuOptions) {
                return menuOptions.filter(function (element) {
                    if (!Configurations.system.componentAccessControlEnabled || element.default) {
                        return true;
                    }

                    if (element.submenus) {
                        element.submenus = self.filterMenu(element.submenus);
                    } else if (element.type && element.type === "MODULE") {
                        return rootParams.baseModel.getAuthorisedComponentList("DASHBOARD").has(element.name);
                    } else {
                        return rootParams.baseModel.getAuthorisedComponentList().has(element.name);
                    }

                    if (element.submenus && element.submenus.length) {
                        return true;
                    }

                    return false;
                });
            };

            self.showFatcaForm = function () {
                self.loadComponent("compliance-base", partyData);
            };

            self.resetModalComponent = function () {
                self.modalComponent(null);
            };

            self.sessionExpiredHandler = function () {
                genericViewModel.resetLayout();
            };

            self.dispose = function () {
                resizeHandler.dispose();
            };
        };
    });