define(["knockout",
        "webAnalytics",
        "base-models/utils/obdx-data-aggregation",
        "framework/js/configurations/config",
        "baseLogger"
    ],
    function(ko, WebAnalytics, obdxAnalytics, Configurations, BaseLogger) {
        "use strict";

        let axeInstance = null;
        const __getAxeInstance = function() {
                if (axeInstance) {
                    return Promise.resolve(axeInstance);
                }

                return new Promise(function(resolve, reject) {
                    require([Configurations.development.axeUrl], function() {
                            axeInstance = window.axe;
                            resolve(axeInstance);
                        },
                        function(error) {
                            reject(error);
                        });

                });
            },

            __displayAccessibilityIssues = function(violations) {
                // eslint-disable-next-line no-console
                BaseLogger.warn(violations);
                // eslint-disable-next-line no-console
                console.groupCollapsed("Accessibility Report");

                let displayWarning = false;

                violations.forEach(function(violation) {
                    // eslint-disable-next-line no-console
                    console.groupCollapsed(violation.description);

                    // eslint-disable-next-line no-console
                    if (console.table) {
                        // eslint-disable-next-line no-console
                        console.table(violation.nodes.map(function(element) {
                            if (element.impact === "critical" || element.impact === "serious") {
                                displayWarning = true;
                            }

                            return {
                                Summary: element.failureSummary,
                                Element: element.html,
                                Impact: element.impact.toUpperCase()
                                    // Can be one of "MINOR", "MODERATE", "SERIOUS", or "CRTITCAL"
                            };

                        }));
                    }

                    // eslint-disable-next-line no-console
                    console.groupEnd();
                });

                // eslint-disable-next-line no-console
                console.groupEnd();

                return displayWarning;
            },
            __checkAccessibilities = function() {
                if (!Configurations.development.checkAccessibility) {
                    return Promise.resolve();
                }

                return new Promise(function(resolve) {
                    __getAxeInstance().then(function(axe) {
                        axe.run(document, {
                            rules: {
                                "aria-allowed-attr": {
                                    enabled: false
                                },
                                "aria-required-children": {
                                    enabled: false
                                },
                                "aria-valid-attr-value": {
                                    enabled: false
                                },
                                "aria-roles": {
                                    enabled: false
                                },
                                radiogroup: {
                                    enabled: false
                                },
                                checkboxgroup: {
                                    enabled: false
                                }
                            }
                        }).then(function(data) {
                            if (__displayAccessibilityIssues(data.violations)) {
                                BaseLogger.warn("accessibility_issues_found_see_the_console_for_details");
                            }

                            resolve();
                        });
                    });
                });
            },
            __do3PAnalytics = function(userData) {
                if (!Configurations.analytics.thirdPartyAnalytics.enabled) {
                    return Promise.resolve();
                }

                return new Promise(function(resolve) {
                    WebAnalytics.getInstance().then(function(webAnalytics) {
                        webAnalytics("trackPageView", {
                            userId: userData.userProfile ? userData.userProfile.userName : ""
                        });

                        resolve();
                    });

                });
            },
            __doOBDXAnalytics = function(routerData) {
                if (!Configurations.analytics.obdxAnalytics.enabled) {
                    return Promise.resolve();
                }

                return new Promise(function(resolve) {
                    if (routerData.component) {
                        ko.components.defaultLoader.getConfig(ko.utils.unwrapObservable(routerData.component), function(componentConfig) {
                            obdxAnalytics.addEvent({
                                event: "COMPONENT",
                                attributes: {
                                    module: componentConfig.module,
                                    component: ko.utils.unwrapObservable(routerData.component)
                                }
                            });

                            resolve();
                        });
                    } else {
                        obdxAnalytics.addEvent({
                            event: "MODULE",
                            attributes: {
                                module: routerData.dashboard || "home"
                            }
                        });

                        resolve();
                    }
                });
            };

        return {
            beforeNavigation: function(routerData, userData, doAccessibility) {
                __doOBDXAnalytics(routerData);
                __do3PAnalytics(userData);

                return doAccessibility ? __checkAccessibilities() : Promise.resolve();
            },
            // eslint-disable-next-line no-empty-function
            afterNavigation: function() {
                window.dispatchEvent(new CustomEvent("pageChanged"));
                window.dispatchEvent(new CustomEvent("showTopHeader"));
            }
        };
    });