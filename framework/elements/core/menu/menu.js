define([
    "ojs/ojcore",
    "knockout",
    "ojL10n!resources/nls/menu",
    "platform",
    "framework/js/constants/constants",
    "ojs/ojnavigationlist",
    "ojs/ojselectcombobox",
    "ojs/ojjquery-hammer",
    "ojs/ojjsontreedatasource"
], function (oj, ko, resourceBundle, Platform, Constants) {
    "use strict";

    return function (params) {
        const self = this;

        self.languageOptions = params.languageOptions;
        self.changeMenuState = params.changeMenuState;
        params.baseModel.registerElement("breadcrumb", "core");
        params.baseModel.registerComponent("profile", "base-components");
        params.baseModel.registerElement("about", "core");
        params.baseModel.registerComponent("mailbox-base", "mailbox");
        params.baseModel.registerComponent("alert-list", "mailbox");
        params.baseModel.registerComponent("notification-list", "mailbox");
        params.baseModel.registerElement("entity-switch", "core");
        self.showSecuritySettings = ko.observable(false);

        self.selectedItem = ko.observable("").extend({
            notify: "always"
        });

        self.menuDrillMode = getComputedStyle(document.querySelector(":root")).getPropertyValue("--menu-interaction") || "sliding";

        self.listItem = ko.observableArray();
        self.nls = resourceBundle;

        self.optionChange = function (event) {
            if (event.detail.item) {
                params.baseModel.closeNotificationMessages();
                params.dashboard.headerCaption("");
                params.menuOptionSelect(ko.dataFor(event.detail.item), self.changeMenuState("toggle"));
            }
        };

        function resetMenu() {
            const menuNavigationList = document.querySelector(".menu-container oj-navigation-list");

            oj.Context.getContext(menuNavigationList).getBusyContext().whenReady().then(function () {
                menuNavigationList.refresh();
            });
        }

        params.rootModel.userInfoPromise.then(function () {
            if (params.dashboard.userData.userProfile) {
                Platform.getInstance().then(function (platform) {
                    platform("displaySecurity", params.dashboard.userData.userProfile.userName, self.showSecuritySettings);
                });
            }
        });

        self.selectedItem.subscribe(function (value) {
            if (value) {
                self.selectedItem(null);
            }
        });

        params.baseModel.addEvent("open-menu", {
            element: document,
            eventName: "keyup",
            eventHandler: function (event) {
                if (event.keyCode === 77 && event.altKey) {
                    event.preventDefault();
                    self.changeMenuState("toggle");
                }
            }
        });

        params.baseModel.addEvent("menuReload", {
            element: window,
            eventName: "menuChanged",
            eventHandler: function () {
                const jsonContext = Constants.jsonContext ? Constants.jsonContext : "framework/json";

                require(["load!" + jsonContext + "/menu/" + params.computeContext(params.dashboard.appData.segment) + ".json"], function (data) {
                    self.listItem(params.filterMenu(data));
                    resetMenu();
                });
            }
        });

        params.baseModel.dispatchCustomEvent(window, "menuChanged");

        self.itemOnly = function (context) {
            return context.leaf === undefined || context.leaf;
        };
    };
});