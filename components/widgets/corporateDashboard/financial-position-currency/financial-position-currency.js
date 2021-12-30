define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/financial-position-currency",
    "ojs/ojinputtext",
    "ojs/ojchart"
], function(ko, Model, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.nls = resourceBundle;

        rootParams.baseModel.registerElement([
            "action-header",
            "action-widget"
        ]);

        self.accountsData = ko.observable();
        self.creditCardsData = ko.observable();
        self.isAccountsDataLoaded = ko.observable(false);
        self.isCreditCardsDataLoaded = ko.observable(false);
        self.liability = ko.observableArray();
        self.assets = ko.observableArray();
        self.barSeriesValue = ko.observableArray();
        self.barGroupsValue = ko.observableArray();
        self.resultObj = ko.observableArray();
        self.showChart = ko.observable(false);
        self.selectedPartyID = ko.observableArray();
        self.segregatedData = ko.observableArray();
        self.conventionalAccountsAvailable = ko.observable(false);
        self.islamicAccountsAvailable = ko.observable(false);
        self.selectedValue = ko.observable();

        self.legendObject = rootParams.baseModel.large() ? {
            position: "end",
            maxSize: "50%"
        } : {
            position: "bottom"
        };

        self.typeOfAccounts = [];

        self.stackValue = ko.observable("on");
        self.stackValueChart = ko.observable("on");

        self.legendSections = [{
            title: self.nls.financialPositionDetails.labels.liabilityLabel.type,
            items: [{
                    color: "#3caf85",
                    text: self.nls.financialPositionDetails.labels.assetsLabel,
                    id: self.nls.financialPositionDetails.labels.assetsLabel
                },
                {
                    color: "#e40004",
                    text: self.nls.financialPositionDetails.labels.liabilityLabel,
                    id: self.nls.financialPositionDetails.labels.liabilityLabel
                }
            ]
        }];

        self.getSum = function(array) {
            let sum = 0;

            if (array && array.length > 0) {
                for (let j = 0; j < array.length; j++) {
                    if (array[j].type === "LON") {
                        sum = sum + array[j].outstandingAmount.amount;
                    } else if (array[j].type === "CSA") {
                        sum = sum + array[j].currentBalance.amount;
                    } else if (array[j].type === "TRD") {
                        sum = sum + array[j].availableBalance.amount;
                    } else if (array[j].type === "CCA") {
                        if (array[j].cardType === "PRIMARY") {
                            sum = sum + array[j].due.equivalentBilledAmount.amount;
                        }
                    }
                }
            }

            return sum;
        };

        self.selectedAccountTypeChangedHandler = function(event) {

            if (self.isAccountsDataLoaded()) {

                self.showChart(false);
                self.assetItems = [];
                self.liabilityItems = [];
                self.currencyList = [];
                self.liability([]);
                self.assets([]);
                self.resultObj([]);
                self.currency = [];

                ko.utils.arrayForEach(self.accountsData().accounts, function(item) {

                    if (event.detail.value === item.module) {

                        if (item.type === "CSA") {
                            if (item.currentBalance.amount > 0) {
                                self.assets()[item.currencyCode] = self.assets()[item.currencyCode] || [];
                                self.currencyList.push(item.currencyCode);
                                self.assets()[item.currencyCode].push(item);
                            } else {
                                self.liability()[item.currencyCode] = self.liability()[item.currencyCode] || [];
                                self.currencyList.push(item.currencyCode);
                                self.liability()[item.currencyCode].push(item);
                            }
                        } else if (item.type === "TRD") {
                            if (item.availableBalance.amount > 0) {
                                self.assets()[item.currencyCode] = self.assets()[item.currencyCode] || [];
                                self.currencyList.push(item.currencyCode);
                                self.assets()[item.currencyCode].push(item);
                            } else {
                                self.liability()[item.currencyCode] = self.liability()[item.currencyCode] || [];
                                self.currencyList.push(item.currencyCode);
                                self.liability()[item.currencyCode].push(item);
                            }
                        } else if (item.type === "LON") {
                            self.liability()[item.currencyCode] = self.liability()[item.currencyCode] || [];
                            self.currencyList.push(item.currencyCode);
                            self.liability()[item.currencyCode].push(item);
                        }
                    }
                });

                if (self.creditCardsData()) {
                    ko.utils.arrayForEach(self.creditCardsData().creditcards, function(item) {
                        item.type = "CCA";
                        self.liability()[item.cardCurrency] = self.liability()[item.cardCurrency] || [];
                        self.currencyList.push(item.cardCurrency);
                        self.liability()[item.cardCurrency].push(item);
                    });
                }

                if (self.currencyList.length > 0) {
                    self.currency = ko.utils.arrayGetDistinctValues(self.currencyList).sort();

                    ko.utils.arrayForEach(self.currency, function(item) {
                        self.resultObj.push({
                            currency: item,
                            assets: self.getSum(self.assets()[item]),
                            liabilities: -self.getSum(self.liability()[item])
                        });
                    });

                    ko.utils.arrayForEach(self.resultObj(), function(item) {
                        self.assetItems.push(item.assets);
                        self.liabilityItems.push(item.liabilities);
                    });

                    const barSeries = [{
                            name: self.nls.financialPositionDetails.labels.assetsLabel,
                            categories: [self.nls.financialPositionDetails.labels.assetsLabel],
                            color: "#3caf85",
                            displayInLegend: "off",
                            items: self.assetItems
                        },
                        {
                            name: self.nls.financialPositionDetails.labels.liabilityLabel,
                            categories: [self.nls.financialPositionDetails.labels.liabilityLabel],
                            color: "#e40004",
                            displayInLegend: "off",
                            items: self.liabilityItems
                        }
                    ];

                    self.barSeriesValue(barSeries);

                    const barGroups = self.currency;

                    self.barGroupsValue(barGroups);
                    ko.tasks.runEarly();
                    self.showChart(true);
                }
            }
        };

        Promise.all([Model.fetchAccountsDetails(), rootParams.dashboard.appData.segment === "RETAIL" ? Model.fetchCreditCardsDetails() : Promise.resolve(null)]).then(function(response) {
            self.accountsData(response[0]);
            self.creditCardsData(response[1]);

            ko.utils.arrayForEach(self.accountsData().accounts, function(item) {
                if (item.module === "CON") {
                    self.conventionalAccountsAvailable(true);
                } else {
                    self.islamicAccountsAvailable(true);
                }
            });

            if (self.conventionalAccountsAvailable()) {
                self.typeOfAccounts.push({
                    id: "CON",
                    label: self.nls.financialPositionDetails.labels.conventionalAccount
                });
            }

            if (self.islamicAccountsAvailable()) {
                self.typeOfAccounts.push({
                    id: "ISL",
                    label: self.nls.financialPositionDetails.labels.islamicAccount
                });
            }

            self.isAccountsDataLoaded(true);
        });

        self.tooltip = {
            renderer: function(dataContext) {
                const pieChartNode = document.createElement("div");

                pieChartNode.innerHTML =
                    "<div>" +
                    "<div data=\"series\">" + rootParams.baseModel.format(self.nls.financialPositionDetails.labels.tooltip.series, {
                        series: dataContext.series
                    }) + "</div>" +
                    "<div data=\"group\">" + rootParams.baseModel.format(self.nls.financialPositionDetails.labels.tooltip.group, {
                        group: dataContext.group
                    }) + "</div>" +
                    "<div data=\"data\">" + rootParams.baseModel.format(self.nls.financialPositionDetails.labels.tooltip.value, {
                        value: rootParams.baseModel.formatCurrency(dataContext.y || 0, dataContext.group)
                    }) + "</div>" +
                    "</div>";

                return {
                    insert: pieChartNode
                };
            }
        };
    };
});