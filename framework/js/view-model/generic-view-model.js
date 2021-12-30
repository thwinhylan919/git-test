define([
        "ojs/ojcore",
        "knockout",
        "jquery",
        "./model",
        "framework/js/constants/constants",
        "baseModel",
        "baseLogger",
        "extensions/override/extensions",
        "framework/js/base-models/ko/formatters",
        "base-models/css",
        "framework/js/configurations/config",
        "ojL10n!resources/nls/generic"
    ],
    function (oj, ko, $, defaultModel, Constants, BaseModel, BaseLogger, ExtensionOverride, Formatters, CSS, Configuration, Locale) {
        "use strict";

        const baseModel = BaseModel.getInstance();

        // eslint-disable-next-line no-console
        window.console.log = console.log = BaseLogger.info;

        let module = baseModel.QueryParams.get("module") === "default" ? "" : baseModel.QueryParams.get("module"),
            applicationModel, filteredAppRoleBasedDashboardPriority;

        const context = baseModel.QueryParams.get("context"),
            applicationRoleBasedDashboardPriority = ["authadmin", "adminchecker", "adminmaker", "corporateadminchecker", "corporateadminmaker", "viewer", "checker", "maker", "customer"],
            currentRole = ko.observable(),
            segmentRoleMap = {
                CORPADMIN: ["corporateadminchecker", "corporateadminmaker"],
                CORP: ["viewer", "checker", "maker"],
                ADMIN: ["authadmin", "adminchecker", "adminmaker"]
            },
            applicationArguments = JSON.parse(decodeURIComponent(baseModel.QueryParams.get("OBDX_ARGS") || "") || baseModel.QueryParams.get("OBDX_ARGS", baseModel.QueryParams.get("redirect_url") ? decodeURIComponent(baseModel.QueryParams.get("redirect_url")) : null) || "{}"),

            formatter = new Formatters();

        $.extend(baseModel, formatter);

        const applicationType = baseModel.QueryParams.get("applicationType");

        ExtensionOverride.init();

        const vm = {
                getBaseModel: function () {
                    return baseModel;
                },
                getOJET: function () {
                    return oj;
                },
                getFormatter: function () {
                    return formatter;
                },
                queryMap: baseModel.QueryParams.get(),
                menuNavigationAvailable: true
            },
            isDashboardSet = ko.observable(CSS.isCSSCustomPropAvailable());

        if (!baseModel.isEmpty(baseModel.QueryParams.get("menuNavigationAvailable"))) {
            vm.menuNavigationAvailable = baseModel.QueryParams.get("menuNavigationAvailable") === "true";
        }

        if (!baseModel.isEmpty(baseModel.QueryParams.get("determinantValue"))) {
            // eslint-disable-next-line no-use-before-define
            setCurrentEntity(baseModel.QueryParams.get("determinantValue"));
        }

        window.history.replaceState(null, null, window.location.pathname);

        if (!baseModel.cordovaDevice() && Configuration.system.sslEnabled && window.location.protocol !== "https:") {
            throw "Please use secure HTTPS connection";
        }

        function getDashboards(dashboard) {
            if (!dashboard || !dashboard.list || !dashboard.list.length) {
                baseModel.showMessages(null, [Locale.noDashboardError], "ERROR");

                return [];
            }

            if (dashboard.resolutionLevel === "APPLICATION_ROLE") {
                return dashboard.list.sort(function (d1, d2) {
                    if (d1.dashboardClass === d2.dashboardClass && d1.dashboardClass === dashboard.resolutionLevel) {
                        return filteredAppRoleBasedDashboardPriority.indexOf(d1.dashboardClassValue) - filteredAppRoleBasedDashboardPriority.indexOf(d2.dashboardClassValue);
                    }

                    return d1.dashboardClass === "APPLICATION_ROLE" ? -1 : d2.dashboardClass === "APPLICATION_ROLE" ? 1 : 0;
                });
            }

            return dashboard.list;
        }

        function computeContext(segment) {
            if (segment === "CORPADMIN") {
                return "corp-admin";
            } else if (segment === "RETAIL") {
                return "retail";
            } else if (segment === "CORP") {
                return "corporate";
            } else if (segment === "ADMIN") {
                return "admin";
            }

            return "index";
        }

        function getRoleBasedSegment(role) {
            if (!role) {
                return null;
            } else if (segmentRoleMap.CORPADMIN.indexOf(role) > -1) {
                return "CORPADMIN";
            } else if (segmentRoleMap.ADMIN.indexOf(role) > -1) {
                return "ADMIN";
            } else if (segmentRoleMap.CORP.indexOf(role) > -1) {
                return "CORP";
            }

            return "RETAIL";
        }

        function computeSegment(roles) {
            const lowerRolesString =
                roles.map(function (item) {
                    return item.toLowerCase();
                }),
                extUserType = ExtensionOverride.evaluateSegment(roles);

            filteredAppRoleBasedDashboardPriority = applicationRoleBasedDashboardPriority.filter(function (role) {
                return lowerRolesString.indexOf(role) !== -1;
            });

            if (context) {
                return "ANON";
            } else if (extUserType) {
                return extUserType;
            } else if (lowerRolesString.indexOf("corporateadminchecker") > -1 || lowerRolesString.indexOf("corporateadminmaker") > -1) {
                return "CORPADMIN";
            } else if (lowerRolesString.indexOf("retailuser") > -1) {
                return "RETAIL";
            } else if (lowerRolesString.indexOf("corporateuser") > -1) {
                return "CORP";
            } else if (lowerRolesString.indexOf("administrator") > -1) {
                return "ADMIN";
            }

            return "ANON";
        }

        function changeSegment(segment, roles) {
            const moduleBasedSegment = getRoleBasedSegment(module);

            ko.tasks.runEarly();
            segment = !Constants.userSegment && moduleBasedSegment ? moduleBasedSegment : segment;
            Constants.userSegment = ExtensionOverride.evaluateSegment(roles, segment) || segment || computeSegment(roles) || Constants.userSegment;

            if ($("body").hasClass("page-is-changing")) {
                $("body").addClass(Constants.userSegment);
            } else {
                $("body").attr("class", Constants.userSegment);
            }

            Constants.jsonContext = ExtensionOverride.evaluateContext(Constants.userSegment, roles);
        }

        function setConstants(config) {
            changeSegment(config.segment);
            Constants.timezoneOffset = config.timezoneOffset || Constants.timezoneOffset;
            Constants.bankConfig = config.bankConfig;
            Constants.localization = config.localization;
        }

        function setCurrentEntity(entity) {
            Constants.currentEntity = Constants.currentEntity || entity || Configuration.system.defaultEntity;
        }

        function getLocalJSON() {
            return applicationModel.perform(setCurrentEntity).then(function (appData) {
                appData.config.segment = computeSegment(appData.userData.userProfile ? appData.userData.userProfile.roles : []);
                setConstants(appData.config);
                baseModel.setAuthorisedComponentList(appData.authorizedUIComponents);

                if (appData.userData.userProfile) {
                    if (vm.menuNavigationAvailable) {
                        vm.menuNavigationAvailable = appData.userData.firstLoginFlowDone && appData.userData.menuSupported;
                    }
                }

                if (!appData.currentModule.homeComponent) {
                    if (vm.queryMap && vm.queryMap.homeComponent && vm.queryMap.homeModule) {
                        appData.currentModule = {
                            homeComponent: vm.queryMap.homeComponent,
                            moduleName: vm.queryMap.homeModule
                        };
                    } else {
                        appData.currentModule = {
                            dashboard: module
                        };
                    }
                }

                return {
                    currentModule: appData.currentModule,
                    userData: appData.userData,
                    dashboards: getDashboards(appData.dashboard),
                    appData: {
                        segment: Constants.userSegment,
                        localCurrency: appData.config.bankConfig ? appData.config.bankConfig.localCurrency : null
                    }
                };
            });
        }

        function changeUser(userData) {
            vm.isUserDataSet(false);
            isDashboardSet(false);
            $(window).off();
            ko.tasks.runEarly();

            vm.userInfoPromise = new Promise(function (resolve) {
                if (userData.userProfile) {
                    getLocalJSON(null, userData, resolve);
                } else {
                    getLocalJSON(null, {
                        userProfile: null
                    }, resolve);
                }

                currentRole(null);
                isDashboardSet(true);
            });
        }

        function resetLayout(entity, resetModule) {
            $("body").addClass("page-is-changing");
            isDashboardSet(false);
            vm.isUserDataSet(false);
            ko.tasks.runEarly();
            Constants.currentEntity = entity;
            baseModel.clearAuthorisedComponentList();
            baseModel.removeAllEvent();
            applicationModel.reset();

            if (resetModule) {
                module = null;
            }

            vm.userInfoPromise = getLocalJSON();

            vm.userInfoPromise.then(function () {
                vm.fetchCurrentBrand = applicationModel.fetchCurrentBrand();

                CSS.loadCSS(vm.fetchCurrentBrand).then(function () {
                    isDashboardSet(true);
                });

            });
        }

        function getApplicationModel() {
            return applicationType ? new Promise(function (resolve) {
                require(["framework/js/view-model/" + applicationType + "-model"], function (model) {
                    resolve(model);
                });
            }) : Promise.resolve(defaultModel);
        }

        getApplicationModel().then(function (model) {
            applicationModel = model;
            applicationModel.init();
            baseModel.registerElement("dashboard", "core");
            baseModel.registerElement("message-box", "core");
            baseModel.registerElement("modal-window");

            const userInfoPromise = getLocalJSON();

            userInfoPromise.then(function () {
                vm.fetchCurrentBrand = applicationModel.fetchCurrentBrand();

                CSS.loadCSS(vm.fetchCurrentBrand).then(function () {
                    isDashboardSet(true);
                });

            });

            ko.utils.extend(vm, {
                userInfoPromise: userInfoPromise,
                isUserDataSet: ko.observable(false),
                applicationArguments: applicationArguments,
                changeUser: changeUser,
                computeContext: computeContext,
                resetLayout: resetLayout,
                changeSegment: changeSegment,
                isDashboardSet: isDashboardSet,
                getRoleBasedSegment: getRoleBasedSegment,
                currentRole: currentRole,
                fetchCurrentBrand: null
            });

            ko.applyBindings(Object.seal(vm));
        });
    });