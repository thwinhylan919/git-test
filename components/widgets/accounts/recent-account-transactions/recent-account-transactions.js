define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/recent-account-activity",
    "ojs/ojbutton",
    "ojs/ojfilmstrip",
    "ojs/ojmenu",
    "ojs/ojselectcombobox"
], function(ko, $, AccountActivity, ResourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.detailsFetched = ko.observable(false);
        self.resource = ResourceBundle;
        self.selectedAccountType = ko.observable();
        self.selectedAccType = ko.observable();
        self.accountNumber = ko.observable();
        self.items = ko.observableArray();
        self.allItems = [];
        self.selectedFilmStripAccount = ko.observable();
        self.accountList = ko.observableArray();

        self.accountTypeList = ko.observableArray([
            "CSA",
            "TRD",
            "LON"
        ]);

        self.refreshAccounts = ko.observable(false);
        self.type = ko.observable();
        self.additionalDetails = ko.observable();

        let transactionCount = 3, accountType;
        const typeMap = {
                CSA: "demandDeposit?status=ACTIVE&status=DORMANT",
                TRD: "deposit?module=CON&module=ISL",
                LON: "loan"
            },
            moduleTypeMap = {
                CSA: "demand-deposits",
                TRD: "term-deposits",
                LON: "loans"
            },
            componentMap = {
                CSA: "demand-deposit-transactions",
                TRD: "term-deposit-transactions",
                LON: "loan-transactions"
            },
            urlMap = {
                CSA: "demandDeposit",
                TRD: "deposit",
                LON: "loan"
            };
        let accountingEntryBasisType;

        rootParams.baseModel.registerElement("account-input");
        rootParams.baseModel.registerElement("date-box");

        if (!rootParams.baseModel.large()) {
            transactionCount = 2;
        }

        rootParams.baseModel.registerComponent("demand-deposit-transactions", "demand-deposits");
        rootParams.baseModel.registerComponent("term-deposit-transactions", "term-deposits");
        rootParams.baseModel.registerComponent("loan-transactions", "loans");

        self.searchParameters = {
            searchBy: ko.observableArray(["CPR"]),
            transactionType: ko.observable("A")
        };

        function setPageData(data) {
            const tempData = $.map(data, function(v) {
                const newObj = {};

                if (accountingEntryBasisType === "V") {
                    newObj.date = v.valueDate ? v.valueDate : "";
                } else if (accountingEntryBasisType === "T") {
                    newObj.date = v.postingDate ? v.postingDate : "";
                }

                newObj.description = v.description ? v.description : "";
                newObj.tempAmount = v.amountInAccountCurrency.amount ? v.amountInAccountCurrency.amount : "";
                newObj.tempCurrency = v.amountInAccountCurrency.currency ? v.amountInAccountCurrency.currency : "";

                newObj.amount = v.amountInAccountCurrency.amount ? v.transactionType === "C" ? rootParams.baseModel.format(self.resource.creditType, {
                    amt: rootParams.baseModel.formatCurrency(v.amountInAccountCurrency.amount, v.amountInAccountCurrency.currency)
                }) : rootParams.baseModel.format(self.resource.debitType, {
                    amt: rootParams.baseModel.formatCurrency(v.amountInAccountCurrency.amount, v.amountInAccountCurrency.currency)
                }) : "";

                newObj.amountClass = v.amountInAccountCurrency.amount ? v.transactionType === "C" ? "" : "debit" : "";
                newObj.id = v.accountId.value;
                newObj.displayValue = v.accountId.displayValue;
                newObj.transactionType = v.transactionType;

                return newObj;
            });

            return tempData;
        }

        function fetchData(account, fetchIndex) {
            self.items.removeAll();

            AccountActivity.fetchTransactionDetails(ko.utils.unwrapObservable(account), accountType, transactionCount).then(function(data) {
                accountingEntryBasisType = data.accountingEntryBasisType;

                if (!rootParams.baseModel.small()) {
                    ko.utils.arrayPushAll(self.items, setPageData(data.items));
                } else if (self.allItems.length) {
                    ko.utils.arrayPushAll(self.allItems[fetchIndex].transactions, setPageData(data.items));
                    self.allItems[fetchIndex].loaded(true);
                }
            });

            self.detailsFetched(true);
        }

        self.accountType = function(accData) {
            self.refreshAccounts(false);
            self.detailsFetched(false);
            ko.tasks.runEarly();

            AccountActivity.fetchAccounts().then(function(data) {
                if (data.accounts) {
                    self.accountList.removeAll();
                    self.allItems.length = 0;

                    for (let index = 0; index < data.accounts.length; index++) {
                        if (data.accounts[index].type === accData) {
                            self.accountList.push(data.accounts[index]);

                            if (rootParams.baseModel.small()) {
                                self.allItems.push({
                                    account: data.accounts[index],
                                    transactions: ko.observableArray(),
                                    loaded: ko.observable(false)
                                });
                            }
                        }
                    }

                    if (self.allItems.length > 0) {
                        fetchData(self.allItems[0].account.id.value, 0);
                    }

                    ko.tasks.runEarly();
                    self.refreshAccounts(true);
                }
            });
        };

        if (!rootParams.baseModel.small()) {
            self.accountNumber.subscribe(function(newValue) {
                if (self.accountNumber()) {
                    fetchData(newValue);
                }
            });
        }

        self.selectedAccountTypeChangedHandler = function(event) {
            self.type("");
            self.accountNumber("");
            ko.tasks.runEarly();
            accountType =urlMap[event.detail.value];
            self.type(typeMap[event.detail.value]);
            self.selectedAccountType(self.resource[event.detail.value]);
            self.selectedAccType(event.detail.value);
            self.accountType(event.detail.value);
        };

        self.selectedFilmStripAccount.subscribe(function() {
            fetchData(self.allItems[self.selectedFilmStripAccount().index].account.id.value, self.selectedFilmStripAccount().index);
        });

        self.showDashboardView = function() {
            if (self.additionalDetails()) {
                rootParams.dashboard.loadComponent("manage-accounts", ko.utils.extend(self.additionalDetails(), {
                    applicationType: moduleTypeMap[self.selectedAccType()],
                    defaultTab: componentMap[self.selectedAccType()],
                    type: self.selectedAccType()
                }));
            }
        };

        self.showMobileView = function(data) {
            rootParams.dashboard.loadComponent("manage-accounts", ko.utils.extend(data.account, {
                applicationType: moduleTypeMap[self.selectedAccType()],
                defaultTab: componentMap[self.selectedAccType()],
                type: self.selectedAccType()
            }));
        };
    };
});