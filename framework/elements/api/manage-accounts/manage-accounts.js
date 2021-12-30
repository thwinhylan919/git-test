define([
    "knockout",
    "jquery",
    "ojL10n!resources/nls/manage-accounts",
    "load!./manage-accounts-links.json",
    "./parsers",
    "ojs/ojrouter",
    "framework/js/plugins/navigation",
    "ojs/ojknockout-validation"
], function(ko, $, locale, ManageAccountsJSON, Parsers, Router, Navigation) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.parameters = rootParams.rootModel.params;
        self.currentModules = rootParams.baseModel.filterAuthorisedComponents(ManageAccountsJSON[self.parameters.applicationType], "component", function(item) { return item.class === "flow"; });
        self.previousState = rootParams.rootModel.previousState;
        self.locale = locale;
        self.selectedTabData = null;
        self.isReady = ko.observable(false);
        self.isFlow = ko.observable(false);
        self.menuOptions = ko.observableArray();
        self.validationTracker = ko.observable();
        self.accountNumberSelected = ko.observable();
        self.additionalDetails = ko.observable();
        rootParams.baseModel.registerElement("nav-bar");
        rootParams.baseModel.registerElement("modal-window");
        rootParams.baseModel.registerElement("account-input");

        const routerConfiguration = {},
            flowTransactions = self.currentModules.filter(function(item) { return item.class === "flow"; }).map(function(item) { return item.component; });

        self.childRouter = rootParams.dashboard.rootRouter.getChildRouter("manage-account");

        if (!self.childRouter) {
            Object.keys(ManageAccountsJSON).forEach(function(key) {
                ManageAccountsJSON[key].forEach(function(item) {
                    routerConfiguration[key + "~" + item.component] = {
                        label: item.component,
                        value: item
                    };
                });
            });

            self.childRouter = rootParams.dashboard.rootRouter.createChildRouter("manage-account").configure(routerConfiguration);
            Router.sync();
        }

        const beforeSelectHandler = function(event) {
            if (event.detail.originalEvent) {
                event.preventDefault();

                const componentName = event.detail.item.getAttribute("id");

                if (!self.currentModules.filter(function(transaction) {
                        return transaction.component === componentName;
                    }).length) {
                    rootParams.baseModel.showMessages(null, [locale.txnNotAvailable], "ERROR");

                    return;
                }

                rootParams.baseModel.closeNotificationMessages();
                rootParams.dashboard.helpComponent.componentName(componentName);

                Navigation.beforeNavigation(self.childRouter.getState(self.parameters.applicationType + "~" + componentName).value, rootParams.dashboard.userData, rootParams.baseModel.large()).then(function() {
                    self.childRouter.go(self.parameters.applicationType + "~" + componentName);
                });
            }
        };

        self.menuSelection = ko.computed(function() {
            const currentState = self.childRouter.currentState();

            if (currentState && currentState.id) {
                self.isFlow(flowTransactions.includes(currentState.value.component));

                return currentState.value.component;
            }

            return null;
        });

        self.uiOptions = {
            menuFloat: "left",
            fullWidth: false,
            defaultOption: self.menuSelection,
            onBeforeSelect: beforeSelectHandler
        };

        self.changeView = function(componentName, data) {
            self.parameters = data;

            Navigation.beforeNavigation(self.childRouter.getState(self.parameters.applicationType + "~" + componentName).value, rootParams.dashboard.userData, rootParams.baseModel.large()).then(function() {
                self.childRouter.go(self.parameters.applicationType + "~" + componentName);
            });
        };

        function initMenuOptions() {
            if (Parsers.transactionParser[self.parameters.applicationType]) {
                self.currentModules = Parsers.transactionParser[self.parameters.applicationType](self.currentModules, self.parameters);
            }

            self.currentModules.forEach(function(item) {
                self.menuOptions.push({
                    id: item.component,
                    label: self.locale.tabs[self.parameters.applicationType][item.component]
                });

                if (item.class !== "flow") {
                    rootParams.baseModel[item.class === "transaction" ? "registerTransaction" : "registerComponent"](item.component, item.module);
                }
            });

            rootParams.dashboard.headerName(locale.tabs[self.parameters.applicationType][self.menuSelection()]);
            self.isReady(true);

            Navigation.beforeNavigation(self.childRouter.getState(self.parameters.applicationType + "~" + self.parameters.defaultTab).value, rootParams.dashboard.userData, rootParams.baseModel.large()).then(function() {
                self.childRouter.go(self.parameters.applicationType + "~" + self.parameters.defaultTab, { historyUpdate: "replace" });
            });
        }

        self.selectAccount = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }

            ko.utils.extend(self.parameters, self.additionalDetails());
            self.parameters.moduleURL = null;
            initMenuOptions();
            $("#manageAccountsAccountNumberDropdown").trigger("closeModal");
        };

        self.afterRender = function() {
            if (self.parameters.moduleURL) {
                $("#manageAccountsAccountNumberDropdown").trigger("openModal");
            } else {
                initMenuOptions();
            }
        };

        self.modalCloseHandler = function() {
            if (!self.isReady()) {
                rootParams.dashboard.switchModule();
            }
        };

        self.accountParser = function(accounts) {
            if (Parsers.accountParser[self.parameters.applicationType]) {
                return Parsers.accountParser[self.parameters.applicationType](accounts, self.parameters.defaultTab || self.menuOptions()[0].id);
            }

            return accounts;
        };

        self.dispose = function() {
            self.menuSelection.dispose();
        };
    };
});