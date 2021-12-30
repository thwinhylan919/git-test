define([
    "knockout",
    "ojL10n!resources/nls/loan-accounts-overview",
    "./model",
    "ojs/ojinputtext",
    "ojs/ojchart",
    "ojs/ojlegend"
], function(ko, resourceBundle, Model) {
    "use strict";

    return function(rootParams) {
        const self = this;

        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerElement("action-widget");
        self.nls = resourceBundle;
        self.loanSeriesValue = ko.observableArray();
        self.totalOutstanding = ko.observable(0);
        self.totalBorrowings = ko.observable(0);
        self.currency = ko.observable();
        self.legendloaded = ko.observable(false);
        self.barGapRatio = ko.observable(0.6);
        self.maxBarWidth = ko.observable(10);
        self.dataLoaded = ko.observable(false);
        self.conventionalAccountsAvailable = ko.observable(false);
        self.islamicAccountsAvailable = ko.observable(false);
        self.accountData = ko.observable();

        self.legendObject = rootParams.baseModel.large() ? {
            position: "end",
            maxSize: "50%"
        } : {
            position: "bottom"
        };

        self.typeOfAccounts = [];

        Model.fetchAccounts().then(function(data) {
            self.accountData(data);

            ko.utils.arrayForEach(data.accounts, function(item) {
                if (item.module === "CON") {
                    self.conventionalAccountsAvailable(true);
                } else {
                    self.islamicAccountsAvailable(true);
                }
            });

            if (self.conventionalAccountsAvailable()) {
                self.typeOfAccounts.push({
                    id: "CON",
                    label: self.nls.accountDetails.labels.conventionalAccount
                });
            }

            if (self.islamicAccountsAvailable()) {
                self.typeOfAccounts.push({
                    id: "ISL",
                    label: self.nls.accountDetails.labels.islamicAccount
                });
            }

            self.dataLoaded(true);

        });

        self.selectedAccountTypeChangedHandler = function(event) {
            if (!rootParams.baseModel.isEmpty(self.accountData().summary)) {

                self.currency(self.accountData().summary.items[0].totalOutstandingBalance.currency);

                if (event.detail.value === "CON") {
                    self.totalOutstanding(self.accountData().summary.items[0].totalActiveOutstandingBalance.amount);
                    self.totalBorrowings(self.accountData().summary.items[0].totalActiveBorrowings.amount);
                } else {
                    self.totalOutstanding(self.accountData().summary.items[0].totalISLActiveOutstandingBalance.amount);
                    self.totalBorrowings(self.accountData().summary.items[0].totalISLActiveBorrowings.amount);
                }

                self.loanSeriesValue([{
                    items: [{
                        value: self.totalBorrowings(),
                        className: "totalMaturityAmount"
                    }, {
                        value: self.totalOutstanding(),
                        className: "totalInvestment"
                    }]
                }]);

                self.legendSections = ko.observableArray([{
                    items: [{
                            text: rootParams.baseModel.format(self.nls.accountDetails.labels.totalBorrowing, {
                                amount: rootParams.baseModel.formatCurrency(self.totalBorrowings(), self.currency())
                            }),
                            className: "totalInvestment"
                        },
                        {
                            text: rootParams.baseModel.format(self.nls.accountDetails.labels.currentOutstanding, {
                                amount: rootParams.baseModel.formatCurrency(self.totalOutstanding(), self.currency())
                            }),
                            className: "totalMaturityAmount"
                        }
                    ]
                }]);

                self.legendloaded(true);

                self.defaultStyle = ko.pureComputed(function() {
                    return {
                        barGapRatio: self.barGapRatio(),
                        maxBarWidth: self.maxBarWidth()
                    };
                });
            }
        };
    };
});