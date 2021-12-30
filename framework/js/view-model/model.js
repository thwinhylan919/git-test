define(["baseService", "baseLogger"], function(BaseService, BaseLogger) {
    "use strict";

    const instance = function() {
        return {
            userData: {},
            currentModule: {},
            menuNavigationAvailable: true,
            config: {},
            authorizedUIComponents: null,
            dashboard: {
                resolutionLevel: null,
                list: null
            }
        };
    };

    let resolveData, baseService;

    function fetchCurrentBrand() {
        return baseService.fetch({
            url: "brands/current",
            showMessage: false
        });
    }

    function fetchAccessibleComponentList() {
        return baseService.fetch({
            url: "me/components",
            showMessage: false
        }).then(function(data) {
            resolveData.authorizedUIComponents = data;
        });
    }

    function fetchBankConfig() {
        return new Promise(function(resolve) {
            baseService.fetch({
                url: "bankConfiguration",
                showMessage: false
            }).then(function(data) {
                resolveData.config.bankConfig = data.bankConfigurationDTO;

                require(["load!lzn/" + data.bankConfigurationDTO.region.toLowerCase() + "/manifest.json"], function(manifest) {
                    resolveData.config.localization = {
                        name: data.bankConfigurationDTO.region.toLowerCase(),
                        data: manifest
                    };

                    resolve();
                }, function() {
                    BaseLogger.info("Localization is not available");
                    resolve();
                });

            }).catch(function() {
                resolve();
            });
        });
    }

    function generateDashboards(array) {
        return array.map(function(element) {
            element.moduleName = element.dashboardClassValue;

            return element;
        });
    }

    function setDashboard(firstLoginFlowDone, dashboardMapped) {
        if (firstLoginFlowDone === false || (dashboardMapped && dashboardMapped.dashboardDTOs && dashboardMapped.dashboardDTOs.length)) {
            resolveData.dashboard.resolutionLevel = dashboardMapped.resolutionLevel;

            return resolveData.dashboard.list = generateDashboards(dashboardMapped.dashboardDTOs);
        }

        return baseService.fetch({
            url: "dashboards/default"
        }).then(function(data) {
            resolveData.dashboard.list = generateDashboards(data.dashboardDTOs);
        });
    }

    function getLocalJSON(resolve) {
        Promise.all([fetchAccessibleComponentList(),
            fetchBankConfig(),
            setDashboard(resolveData.userData.firstLoginFlowDone, resolveData.userData.dashboardResponse)
        ]).then(function() {
            resolve(resolveData);
        });
    }

    function onError(jqXHR, resolve) {
        resolveData.userData = {
            userProfile: jqXHR.status === 400 ? {} : null
        };

        getLocalJSON(resolve);
    }

    function systemConfiguration(resolve) {
        baseService.fetch({
            url: "configurations/base/dayoneconfig/properties/SYSTEM_CONFIGURATION"
        }).then(function(data) {
            if (data.configResponseList[0].propertyValue === "false") {
                resolveData.currentModule = {
                    homeComponent: "system-configuration-home",
                    moduleName: "system-configuration"
                };
            }

            getLocalJSON(resolve);
        });
    }

    function onSuccess(data, resolve) {
        resolveData.userData = data;
        resolveData.menuNavigationAvailable = data.firstLoginFlowDone && data.menuSupported;
        resolveData.config.timezoneOffset = data.userProfile.timeZoneDTO.offset;

        if (!data.firstLoginFlowDone) {
            resolveData.currentModule = {
                homeComponent: "configuration-base",
                moduleName: "user-login-configuration"
            };
        }

        if (data.userProfile.roles.indexOf("AuthAdmin") !== -1) {
            systemConfiguration(resolve);
        } else {
            getLocalJSON(resolve);
        }
    }

    function setUserInformation(setCurrentEntity, resolve) {
        baseService.fetch({
            url: "me",
            showMessage: false,
            showInModalWindow: true,
            throttle: false
        }).then(function(data) {
            setCurrentEntity(data.userProfile.homeEntity);
            onSuccess(data, resolve);
        }, function(jqXHR) {
            setCurrentEntity(null);
            onError(jqXHR, resolve);
        });
    }

    return {
        init: function() {
            baseService = BaseService.getInstance();
        },
        perform: function(setCurrentEntity) {
            resolveData = new instance();

            return new Promise(function(resolve) {
                return setUserInformation(setCurrentEntity, resolve);
            });
        },
        fetchCurrentBrand: function() {
            return fetchCurrentBrand();
        },
        reset: function() {
            baseService.invalidateSession();
        }
    };

});