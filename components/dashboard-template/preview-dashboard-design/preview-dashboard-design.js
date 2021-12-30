define([

    "knockout",
    "jquery", "ojL10n!resources/nls/view-dashboard-design",
    "./model", "ojs/ojarraydataprovider", "ojs/ojnavigationlist", "ojs/ojknockout",
    "base-model"
], function(ko, $, locale, model, ArrayDataProvider) {
    "use strict";

    const vm = function(params) {
        const self = this;

        ko.utils.extend(self, params.rootModel);
        self.nls = locale;
        self.newDesign = params.rootModel.params.data.dashboard;

        params.baseModel.isDashboardBuilderContext(true);
        params.dashboard.headerName(self.nls.pageHeader);
        self.showDesktopView = ko.observable(true);
        self.showTabView = ko.observable(false);
        self.showMobileView = ko.observable(false);
        self.viewType = ko.observable("desktop");

        const roleSwitcherOptions = [];

        if (self.params.data.dashboard.layout.layout.large.length) {
            roleSwitcherOptions.push({
                name: self.nls.labels.desktopDesign,
                icon: "dashboard-design/UX/desktop-icon.png",
                id: "desktop"
            });
        }

        if (self.params.data.dashboard.layout.layout.medium.length) {
            roleSwitcherOptions.push({
                name: self.nls.labels.tabDesign,
                icon: "dashboard-design/UX/tab-icon.png",
                id: "tab"
            });
        }

        if (self.params.data.dashboard.layout.layout.small.length) {
            roleSwitcherOptions.push({
                name: self.nls.labels.mobileDesign,
                icon: "dashboard-design/UX/mobile-icon.png",
                id: "mobile"
            });
        }

        self.roleSwitcherDataProvider = new ArrayDataProvider(roleSwitcherOptions, {
            keyAttributes: "id"
        });

        $(document).on("click", "#stp1,#stp3,#stp4", function() {
            params.rootModel.params.data.params.currentEdit = $(this).attr("id");
            params.dashboard.hideDetails();
        });

        self.viewType.subscribe(function(newValue) {
            self.showDesktopView(false);
            self.showTabView(false);
            self.showMobileView(false);

            if (newValue === "desktop") {
                self.showDesktopView(true);
            } else if (newValue === "tab") {
                self.showTabView(true);
            } else if (newValue === "mobile") {
                self.showMobileView(true);
            }
        });

        self.computeStyle = function(style, currentView) {
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

        self.reloadScreen = function() {
            window.location.search = "";
        };

        self.saveDashboardDesign = function() {
            const payload = params.rootModel.params.data.dashboard;

            if (self.params.mode !== "edit") {
                let ignoreList;

                if (params.dashboard.appData.segment === "ADMIN") {
                    ignoreList = ["dashboardDesign", "creationDate"];
                } else {
                    ignoreList = ["dashboardDesign", "creationDate", "enterpriseRole", "dashboardClass", "dashboardClassValue"];
                }

                if (params.dashboard.appData.segment === "ADMIN") {
                    model.saveDashboard(ko.toJSON(ko.mapping.toJS(payload))).done(function(data, status, jqXhr) {
                        params.dashboard.loadComponent("confirm-screen", {
                            jqXHR: jqXhr,
                            transactionName: self.nls.pageHeader
                        });
                    });
                } else {
                    model.saveUserDashboard(ko.toJSON(ko.mapping.toJS(payload, {
                        ignore: ignoreList
                    }))).done(function(data, status, jqXhr) {
                        params.dashboard.loadComponent("confirm-screen", {
                            jqXHR: jqXhr,
                            transactionName: self.nls.pageHeader,
                            confirmScreenExtensions: {
                                confirmScreenMsgEval: function() {
                                    return self.nls.personalisedConfirmMsg;
                                },
                                isSet: true,
                                template: "confirm-screen/dashboard-builder"
                            }
                        }, self);
                    });
                }
            } else if (self.params.mode && self.params.mode === "edit") {

                let temp;

                if (params.dashboard.appData.segment !== "ADMIN") {
                    temp = ko.toJSON(ko.mapping.toJS(payload, {
                        ignore: ["dashboardClass", "dashboardClassValue", "dashboardDesign", "enterpriseRole"]
                    }));
                } else {
                    temp = ko.toJSON(ko.mapping.toJS(payload, {
                        ignore: ["dashboardDesign", "author", "authorType", "factory"]
                    }));
                }

                if (params.dashboard.appData.segment === "ADMIN") {
                    model.updateDashboard(temp, params.rootModel.params.data.dashboardId).done(function(data, status, jqXhr) {
                        params.dashboard.loadComponent("confirm-screen", {
                            jqXHR: jqXhr,
                            transactionName: self.nls.pageHeader
                        });
                    });
                } else {
                    model.updateUserDashboard(temp, params.rootModel.params.data.dashboardId).done(function(data, status, jqXhr) {
                        params.dashboard.loadComponent("confirm-screen", {
                            jqXHR: jqXhr,
                            transactionName: self.nls.pageHeader,
                            confirmScreenExtensions: {
                                confirmScreenMsgEval: function() {
                                    return self.nls.personalisedConfirmMsg;
                                },
                                isSet: true,
                                template: "confirm-screen/dashboard-builder"
                            }
                        }, self);
                    });
                }
            }
        };

        self.reviewTransactionName = {};
        self.reviewTransactionName.header = self.nls.generic.common.review;
        self.reviewTransactionName.reviewHeader = self.nls.reviewDashboard;

        const focusableElementsString = "input:not([disabled]), a[href], area[href], select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex=\"0\"], [contenteditable]";

        $(document).on("keydown", "#preViewDashboardDesign", function(e) {
            if (e.keyCode === 9) {
                setTimeout(function() {
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
                        $(".frame-contents").parent().next().find("a").focus();
                    } else if (document.activeElement === lastTabStop) {
                        document.getElementById("dashboardSwitchView").focus();
                    }
                }, 200);
            }
        });
    };

    return vm;
});