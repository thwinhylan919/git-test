define([
    "ojs/ojcore",
    "knockout",
    "ojL10n!extensions/resources/nls/flip-account",
    "./model",
    "load!./flip-account-links.json",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojselectcombobox",
    "ojs/ojbutton",
    "ojs/ojmenu",
    "ojs/ojoption"
], function(oj, ko, ResourceBundle, Model, LinksJSON) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.resource = ResourceBundle;
        self.options = LinksJSON;
        rootParams.baseModel.registerComponent("account-transactions", "accounts");
        self.statusSelected = ko.observable("ACTIVE");
        self.menuOptionsArray = ko.observableArray([]);
        self.totalAccount = ko.observable(0);
        self.type = rootParams.type;
        self.turnCard = rootParams.turnCard;
        self.refreshData = ko.observable(true);

        const accountsListFiltered = ko.observableArray(),
            filteredData = ko.computed(function() {
                if (rootParams.type() && rootParams.filteredAccount[rootParams.type()]) {
                    self.refreshData(false);

                    return ko.utils.arrayFilter(rootParams.filteredAccount[rootParams.type()](), function(account) {
                        account.accountId = account.id.value;

                        if (rootParams.baseModel.small()) {
                            return true;
                        } else if (self.statusSelected() === "ACTIVE") {
                            return account.status === "ACTIVE";
                        }

                        return account.status !== "ACTIVE";
                    });

                }

                return [];
            }, self);

        self.dataSource = new oj.ArrayTableDataSource(accountsListFiltered, {
            idAttribute: "accountId"
        });

        const typeSubcription = rootParams.type.subscribe(function() {
            self.statusSelected("ACTIVE");
        });

        filteredData.subscribe(function(value) {
            accountsListFiltered.removeAll();
            ko.tasks.runEarly();
            ko.utils.arrayPushAll(accountsListFiltered, value);
            self.refreshData(true);
            self.totalAccount(accountsListFiltered().length);
        });

        self.accountMap = {
            CSA: "accounts/demandDeposit?status=CLOSED&status=DORMANT",
            TRD: "accounts/deposit?module=CON&module=ISL&status=CLOSED&status=DORMANT",
            LON: "accounts/loan?status=CLOSED&status=DORMANT",
            RD: "accounts/deposit?module=RD&status=CLOSED&status=DORMANT"
        };

        const fetchInactiveAccounts = function(type) {
            const module = self.accountMap[type];

            if (module) {
                Model.getInactiveAccounts(module).done(function(data) {
                    if (!rootParams.baseModel.isEmpty(data.accounts)) {
                        data.accounts.forEach(function(element) {
                            element.type = rootParams.type();
                        });

                        ko.utils.arrayPushAll(rootParams.filteredAccount[rootParams.type()], data.accounts);
                    }

                    self.accountMap[type] = null;
                    rootParams.type.valueHasMutated();
                });
            }
        };

        self.statusSelected.subscribe(function(value) {
            if (value === "INACTIVE" && rootParams.type()) {
                fetchInactiveAccounts(rootParams.type());
            }
        });

        self.accountsTypes = [{
                value: "ACTIVE",
                label: self.resource.activeAccounts
            },
            {
                value: "INACTIVE",
                label: self.resource.inactiveAccounts
            }
        ];

        self.openMenu = function(launcherId) {
            document.getElementById(launcherId + "-container").open();
        };

        self.menuItemSelect = function(event, data) {
            if (self.statusSelected() === "ACTIVE" || self.type === "CCA") {
                data.defaultTab = event.target.value;
                data.applicationType = self.options[rootParams.type()].module;
                rootParams.dashboard.loadComponent("manage-accounts", data);
            } else {
                rootParams.baseModel.registerComponent(event.target.value, self.options[rootParams.type()].module);
                rootParams.dashboard.loadComponent(event.target.value, data);
            }
        };

        self.linkClick = function(data) {
            rootParams.baseModel.registerComponent(data.id, data.module);

            if (data.applicationType) {
                data.defaultTab = data.id;
                rootParams.dashboard.loadComponent("manage-accounts", data);
            } else {
                rootParams.dashboard.loadComponent(data.id);
            }
        };

        self.evaluateMenu = function(data) {
            if (data.type === "CCA") {
                if (data.cardOwnershipType === "PRIMARY" && data.cardStatus === "ACT") {
                    return self.options[data.type].menuActivePrimary;
                } else if (data.cardOwnershipType === "ADDON" && data.cardStatus === "ACT") {
                    return self.options[data.type].menuActiveAddon;
                } else if (data.cardOwnershipType === "PRIMARY" && data.cardStatus === "IAT") {
                    return self.options[data.type].menuInactivePrimary;
                } else if (data.cardOwnershipType === "ADDON" && data.cardStatus === "IAT") {
                    return self.options[data.type].menuInactiveAddon;
                } else if (data.cardOwnershipType === "PRIMARY" && data.cardStatus === "HTL") {
                    return self.options[data.type].menuHotlistedPrimary;
                } else if (data.cardOwnershipType === "ADDON" && data.cardStatus === "HTL") {
                    return self.options[data.type].menuHotlistedAddon;
                } else if (data.cardOwnershipType === "PRIMARY" && data.cardStatus === "CLD") {
                    return self.options[data.type].menuCancelledPrimary;
                } else if (data.cardOwnershipType === "ADDON" && data.cardStatus === "CLD") {
                    return self.options[data.type].menuCancelledAddon;
                }
            } else if (data.status === "ACTIVE") { return self.options[data.type].menuOptions; } else { return self.options[data.type].menuClosedOptions; }
        };

        if (rootParams.baseModel.small()) {
            rootParams.type.valueHasMutated();
        }

        self.dispose = function() {
            filteredData.dispose();
            typeSubcription.dispose();
        };
    };
});