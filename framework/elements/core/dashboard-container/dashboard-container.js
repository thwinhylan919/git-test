define([
        "knockout",
        "jquery",
        "./model",
        "framework/js/configurations/config",
        "ojL10n!resources/nls/dashboard"
    ],
    function(ko, $, DashboardModel, Configurations, locale) {
        "use strict";

        return function(rootParams) {
            const self = this;
            let widgetList;

            self.layout = ko.observableArray();
            self.render = ko.observable();
            self.locale = locale;

            let layout = [];

            const authorisedComponent = rootParams.baseModel.getAuthorisedComponentList();

            function registerComponent(widgets, index) {
                const manifestAvailable = widgetList.find(function(widget) {
                    return widgets[index].componentName === widget.componentName;
                });

                if (!manifestAvailable) {
                    widgets[index].ignore = true;
                } else if (authorisedComponent.has(widgets[index].componentName) || !Configurations.system.componentAccessControlEnabled) {
                    rootParams.baseModel.registerComponent(widgets[index].componentName, "widgets/" + widgets[index].module);

                    if (widgets[index].data && typeof widgets[index].data === "string") {
                        widgets[index].data = JSON.parse(widgets[index].data.replace(/'/g, "\""));
                    }
                } else {
                    widgets[index].ignore = true;
                }
            }

            function registerDashBoardComponent() {
                if (layout.length) {
                    for (let j = 0; j < layout.length; j++) {
                        if (layout[j].componentName) {
                            registerComponent(layout, j);
                        }

                        if (layout[j].childPanel) {
                            for (let k = 0; k < layout[j].childPanel.length; k++) {
                                registerComponent(layout[j].childPanel, k);
                            }
                        }
                    }
                }
            }

            let mutex = true;

            function copytolayout(noOfItems) {
                const current = self.layout().length;

                for (let i = 0; i < noOfItems; i++) {
                    if (layout[current + i]) {
                        self.layout.push(layout[current + i]);
                    } else {
                        rootParams.baseModel.removeEvent("lazyLoadWidgets");
                    }
                }

                mutex = true;
            }

            function lazyLoadWidgets() {
                if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 25) {
                    if (mutex) {
                        mutex = false;
                        copytolayout(2);
                    }
                }
            }

            function setLayout(module) {
                const deviceSize = rootParams.baseModel.getDeviceSize() === "xl" ? "large" : rootParams.baseModel.getDeviceSize();

                if (module.layout[deviceSize] && module.layout[deviceSize].length) {
                    layout = module.layout[deviceSize];
                } else {
                    layout = module.layout.defaultLayout;
                }

                registerDashBoardComponent();

                layout = layout.filter(function(widget) {
                    if (widget.childPanel.length) {
                        widget.childPanel = widget.childPanel.filter(function(childWidget) {
                            return !childWidget.ignore;
                        });

                        return true;
                    }

                    return !widget.ignore;
                });

                self.layout.removeAll();

                if (rootParams.baseModel.getDeviceSize() === "small") {
                    copytolayout(5);
                } else {
                    ko.utils.arrayPushAll(self.layout, layout);
                }
            }

            function getModuleData(dashboards, module) {
                if (module) {
                    return dashboards.filter(function(element) {
                        return element.moduleName === module;
                    })[0];
                }

                return dashboards[0];
            }

            function setModulesData(module) {
                setLayout(module.layout);
                rootParams.dashboard.headerName(locale.headers[module.titleName]);
                rootParams.dashboard.headerCaption(locale.headers[module.titleCaption]);
            }

            function loadDashboard() {
                rootParams.rootModel.userInfoPromise.then(function(data) {
                    self.render(true);

                    const metadata = getModuleData(data.dashboards, rootParams.dashboardName);
                    let dashboardClass = "MODULE";

                    if (data.userData.userProfile && metadata) {
                        if (metadata.dashboardClass === data.userData.dashboardResponse.resolutionLevel) {
                            dashboardClass = data.userData.dashboardResponse.resolutionLevel;
                        } else {
                            dashboardClass = metadata.dashboardClass;
                        }
                    }

                    DashboardModel.fetchModules(dashboardClass, rootParams.dashboardName || metadata.moduleName).then(function(data) {
                        setModulesData(data.dashboardDTO);
                    });

                    rootParams.baseModel.addEvent("lazyLoadWidgets", {
                        element: window,
                        eventName: "scroll",
                        eventHandler: lazyLoadWidgets
                    });
                });

            }

            self.backTop = function() {
                $("body,html").animate({
                    scrollTop: 0
                }, 1000);
            };

            rootParams.baseModel.addEvent("back-to-top-visibility", {
                element: window,
                eventName: "scroll",
                eventHandler: function() {
                    if ($(this).scrollTop() > 100) {
                        $(".back-top").fadeIn();
                    } else {
                        $(".back-top").fadeOut();
                    }
                }
            });

            require(["load!framework/json/moduleComponents.json"], function(data) {
                widgetList = data.components;
                loadDashboard();
            });
        };
    });