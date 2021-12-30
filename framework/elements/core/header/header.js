define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "framework/js/configurations/config",
    "ojL10n!resources/nls/header",
    "platform",
    "framework/js/constants/constants",
    "base-models/utils/obdx-data-aggregation",
    "ojs/ojpopup",
    "ojs/ojselectcombobox",
    "ojs/ojmenu",
    "ojs/ojmessages"
], function (oj, ko, $, HeaderModel, Configurations, resourceBundle, Platform, Constants, obdxAnalytics) {
    "use strict";

    return function (params) {
        const self = this;

        self.changeMenuState = params.changeMenuState;
        self.mailbox = params.mailbox;
        self.resourceBundle = resourceBundle;
        self.isExternalPayment = self.isExternalPayment ? self.isExternalPayment : null;
        self.searchKeyword = ko.observableArray();
        self.searchTags = ko.observableArray();
        self.isSearchVisible = ko.observable(false);
        self.loadMiniMailBox = ko.observable(false);
        self.totalMailboxCount = ko.observable(0);

        self.messagePosition = {
            my: {
                vertical: "top",
                horizontal: "end"
            },
            at: {
                vertical: "bottom",
                horizontal: "end"
            },
            of: ".notification-clear-all"
        };

        params.baseModel.registerComponent("search", "common");
        params.baseModel.registerComponent("mini-mailbox", "mailbox");
        params.baseModel.registerComponent("side-menu", "security");
        params.baseModel.registerComponent("profile", "base-components");
        params.baseModel.registerComponent("locator", "atm-branch-locator");
        params.baseModel.registerElement("entity-switch", "core");
        params.baseModel.registerElement(["floating-panel", "help"]);
        params.baseModel.registerComponent("login-form", "widgets/pre-login");

        let menu, menuPosition, placeholder,
            isAdded;

        self.openMailBox = function () {
            const isOpen = $("#popup1").ojPopup("isOpen");

            if (isOpen) {
                $("#popup1").ojPopup("close", "#mailbox-holder");
            } else {
                self.loadMiniMailBox(false);
                ko.tasks.runEarly();
                $("#popup1_wrapper_layer").show();

                $("#popup1").ojPopup("open", "#mailbox-holder", {
                    my: {
                        horizontal: "right",
                        vertical: "top"
                    },
                    at: {
                        horizontal: "end",
                        vertical: "bottom"
                    }
                });

                self.loadMiniMailBox(true);
            }
        };

        self.showInformation = function () {
            if (params.dashboard.isHelpAvailable()) {
                $("#informationPopupHeader")[0].dispatchEvent(new CustomEvent("openFloatingPanel"));
            }
        };

        self.launchProfileMenu = function () {
            document.querySelector("#profileLauncherPopup").open("#profileLauncher");
        };

        self.showSearchBar = function () {
            self.searchKeyword(null);
            self.isSearchVisible(true);
            ko.tasks.runEarly();

            const searchBoxNode = document.querySelector("oj-combobox-one.alternate-primary");

            oj.Context.getContext(searchBoxNode).getBusyContext().whenReady().then(function () {
                searchBoxNode.focus();
            });
        };

        self.openDashboard = function () {
            if (params.rootModel.menuNavigationAvailable) {
                params.dashboard.switchModule(params.rootModel.currentRole());
            }
        };

        function getMailCount(event) {
            if (event && event.detail) {
                return self.totalMailboxCount(event.detail);
            }

            return HeaderModel.getMailCount().then(function (data) {
                return self.totalMailboxCount(data.summary.items[0].unReadCount + data.summary.items[1].unReadCount + data.summary.items[2].unReadCount);
            });
        }

        /**
         * Call this event handler by emitting a custom event (if data is to be passed), or a normal event like:
         * @example rootParams.baseModel.dispatchCustomEvent(document.getElementById("mailbox-holder"), "notificationUpdated", 12);
         */
        document.getElementById("mailbox-holder").addEventListener("notificationUpdated", getMailCount);

        self.profilePopupAction = function (action) {
            if (document.querySelector("#profileLauncherPopup")) {
                document.querySelector("#profileLauncherPopup").close();
            }

            switch (action) {
                case "profile":
                    if (params.dashboard.appData.segment !== "ADMIN") {
                        params.dashboard.loadComponent("side-menu");
                    } else {
                        params.dashboard.loadComponent("profile");
                    }

                    break;
                case "logout":
                    self.logout();
                    break;
            }
        };

        self.searchKeyword.subscribe(function (newValue) {
            if (newValue) {
                let selectedValue;

                try {
                    selectedValue = JSON.parse(newValue);

                    if (typeof selectedValue !== "object") {
                        return;
                    }
                } catch (e) {
                    return;
                }

                params.menuOptionSelect(selectedValue);
                self.isSearchVisible(false);
            }
        });

        self.login = function () {
            if (Configurations.authentication.type === "OBDXAuthenticator") {
                params.dashboard.loadComponent("login-form");
            } else {
                params.baseModel.switchPage({}, true);
            }
        };

        params.baseModel.addEvent("login", {
            element: window,
            eventName: "login",
            eventHandler: self.login
        });

        function flattenMenuArray(array, parent) {
            let result = [];

            array.forEach(function (element) {
                if (Array.isArray(element.submenus)) {
                    result = result.concat(flattenMenuArray(element.submenus, element.name));
                } else {
                    element.parent = parent;
                    result.push(element);
                }
            });

            return result;
        }

        self.logout = function (event) {
            window.onbeforeunload = null;

            obdxAnalytics.addEvent({
                event: "LOGOUT"
            });

            obdxAnalytics.pushAggregatedData()
                .then(function () {
                    return HeaderModel.logOut();
                }).then(function () {
                    return Platform.getInstance();
                }).then(function (platform) {
                    params.rootModel.queryMap = null;
                    platform("logOut", Configurations.authentication.type, event && event.detail && event.detail.callback ? event.detail.callback : params.rootModel.resetLayout);
                });
        };

        params.baseModel.addEvent("logout", {
            element: window,
            eventName: "logout",
            eventHandler: self.logout
        });

        params.rootModel.userInfoPromise.then(function (data) {
            if (data.userData.userProfile && params.rootModel.menuNavigationAvailable) {
                getMailCount();
            }
        });

        const setoffset = function () {
            menu = document.querySelector(".fixed-header");

            if (placeholder && isAdded) {
                menu.parentNode.removeChild(placeholder);
                menu.classList.remove("sticky");
            }

            menuPosition = null;
            placeholder = document.createElement("div");
            isAdded = false;
        };

        params.baseModel.addEvent("searchReload", {
            element: window,
            eventName: "menuChanged",
            eventHandler: function () {
                const jsonContext = Constants.jsonContext ? Constants.jsonContext : "framework/json";

                require(["load!" + jsonContext + "/menu/" + params.computeContext(params.dashboard.appData.segment) + ".json", "ojL10n!resources/nls/menu"], function (MenuJSON, MenuLocale) {
                    const menus = params.filterMenu(MenuJSON),
                        output = flattenMenuArray(menus).map(function (element) {
                            return {
                                value: JSON.stringify(element),
                                label: element.parent ? params.baseModel.format("{type} - {selection}", {
                                    type: MenuLocale.menu.groups[element.parent],
                                    selection: MenuLocale.menu.groups[element.name]
                                }) : MenuLocale.menu.groups[element.name]
                            };
                        });

                    self.searchTags(output);
                });
            }
        });

        params.baseModel.dispatchCustomEvent(window, "menuChanged");

        params.baseModel.addEvent("stickyHeader", {
            element: window,
            eventName: "scroll",
            eventHandler: function () {

                if (!menu) {
                    setoffset();
                }

                menuPosition = menu.getBoundingClientRect();
                placeholder.style.width = menuPosition.width + "px";
                placeholder.style.height = menuPosition.height + "px";

                const y = $(this).scrollTop();

                if (y >= 60) {
                    $(".header-container").addClass("shadow");
                } else {
                    $(".header-container").removeClass("shadow");
                }

                if (window.pageYOffset >= menuPosition.top && !isAdded) {
                    menu.classList.add("sticky");
                    menu.parentNode.insertBefore(placeholder, menu);
                    isAdded = true;
                } else if (window.pageYOffset <= menuPosition.top && isAdded) {
                    menu.classList.remove("sticky");
                    menu.parentNode.removeChild(placeholder);
                    isAdded = false;
                }
            }
        });

        params.baseModel.addEvent("showTopHeader", {
            element: window,
            eventName: "showTopHeader",
            eventHandler: function () {
                if (menu && isAdded) {
                    menu.classList.remove("sticky");
                    menu.parentNode.removeChild(placeholder);
                    isAdded = false;
                }
            }
        });

        self.resetModalComponent = function () {
            params.dashboard.modalComponent("");
        };

        const resizeHandler = ko.computed(function () {
            if (params.baseModel.large() ^ params.baseModel.medium() ^ params.baseModel.small()) {
                setoffset();
            }
        });

        self.dispose = function () {
            resizeHandler.dispose();
        };

        self.menuHeight = $(window).height() + "px";

        self.isHelpDeskSession = function () {
            return !!HeaderModel.baseServiceProps("helpDeskSessionKey");
        };

        self.logOutHelpDeskSession = function () {
            const payload = {
                sessionKey: HeaderModel.baseServiceProps("helpDeskSessionKey")
            };

            HeaderModel.baseServiceProps("helpDeskSessionKey", "");

            HeaderModel.helpDeskSessionOut(JSON.stringify(payload)).then(function () {
                params.rootModel.resetLayout();
            });
        };
    };
});