define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/demand-deposit-analysis",

    "ojs/ojchart",
    "ojs/ojtabs"
], function(ko, $, AnalysisModel, locale) {
    "use strict";

    return function() {
        let i;
        const self = this;

        self.locale = locale;
        self.checkedOption = ko.observable("conventional");

        let conventionalAccounts = [],
            islamicAccounts = [];

        self.baseCcy = ko.observable();
        self.multipleModules = ko.observable(false);
        self.singleModule = ko.observable(false);
        self.dataFetched = ko.observable(false);
        self.conventionalAnalysis = ko.observable();
        self.totalNetBalance = ko.observable(0);
        self.islamicTotalNetBalance = ko.observable(0);
        self.accountHavingNegativeBalance = ko.observable(false);

        self.noAccountsData = {
            image: "analysis/demand-deposits.svg",
            noAccountText: self.locale.analysis.noData,
            bottomText: self.locale.analysis.bottomText
        };

        self.accounts = ko.observable({
            conventionalAccounts: [],
            islamicAccounts: []
        });

        self.title = ko.observable({
            conventionalAccounts: [],
            islamicAccounts: []
        });

        self.displayFunction = function() {
            if (self.accounts().conventionalAccounts.length > 0 && self.accounts().islamicAccounts.length) {
                self.multipleModules(true);
                self.conventionalAnalysis(true);
            } else {
                if (self.accountsData.modulesList[0] === "CON") {
                    self.conventionalAnalysis(true);
                } else if (self.accountsData.modulesList[0] === "ISL") {
                    self.conventionalAnalysis(false);
                }

                self.singleModule(true);
            }
        };

        function setData() {
            if (self.accountsData && self.accountsData.accounts) {
                conventionalAccounts = self.accountsData.accounts.filter(function(item) {
                    return item.module === "CON";
                });

                islamicAccounts = self.accountsData.accounts.filter(function(item) {
                    return item.module === "ISL";
                });
            }

            if (conventionalAccounts.length > 0) {
                self.conventionalAnalysis(true);
            } else if (islamicAccounts.length > 0) {
                self.conventionalAnalysis(false);
            } else {
                self.conventionalAnalysis(true);
            }

            if (self.accountsData && self.accountsData.accounts) {
                let accountType;

                for (i = 0; i < self.accountsData.accounts.length; i++) {
                    if (self.accountsData.accounts[i].status === "ACTIVE") {
                        if (self.accountsData.accounts[i].module === "CON") {
                            accountType = "conventionalAccounts";
                            self.totalNetBalance(self.totalNetBalance() + self.accountsData.accounts[i].equivalentCurrentBalance.amount);
                        } else {
                            accountType = "islamicAccounts";
                            self.islamicTotalNetBalance(self.islamicTotalNetBalance() + self.accountsData.accounts[i].equivalentCurrentBalance.amount);
                        }

                        self.accounts()[accountType].push(i);

                        if (self.accountsData.accounts[i].equivalentCurrentBalance.amount >= 0) {
                            self.title()[accountType].push({
                                name: self.accountsData.accounts[i].id.displayValue,
                                items: [self.accountsData.accounts[i].equivalentCurrentBalance.amount],
                                displayInLegend: "off"
                            });
                        } else {
                            self.accountHavingNegativeBalance(true);
                        }

                        if (!self.baseCcy()) {
                            self.baseCcy(self.accountsData.accounts[i].equivalentCurrentBalance.currency);
                        }
                    }
                }

                if ($(window).width() < 768) {
                    $("#pieChart").css("height", "210px");
                } else {
                    let height = 230 - (Math.floor(self.accountsData.accounts.length / 20) * 5);

                    height += "px";
                    $("#pieChart").css("height", height);
                }

                const colorArray = [
                        "#ffec3b",
                        "#ff8f43",
                        "#f24a1d",
                        "#7ccec4",
                        "#21a0a0",
                        "#4b71bc",
                        "#4b5196",
                        "#d5ee56",
                        "#e59abf",
                        "#9d65c9"
                    ],
                    conLength = Math.min(colorArray.length, self.title().conventionalAccounts.length),
                    islLength = Math.min(colorArray.length, self.title().islamicAccounts.length);

                for (i = 0; i < conLength; i++) {
                    self.title().conventionalAccounts[i].color = colorArray[i];
                }

                for (i = 0; i < islLength; i++) {
                    self.title().islamicAccounts[i].color = colorArray[i];
                }

                self.innerRadius = ko.observable(0.85);
                self.pieSeriesValue = ko.observable(self.title());
                self.dataFetched(true);
            }

            self.cardData = {
                title: self.accounts().conventionalAccounts.length,
                description: self.locale.analysis.title
            };

            self.islamicCardData = {
                title: self.accounts().islamicAccounts.length,
                description: self.locale.analysis.title
            };

            self.options = [{
                    id: "conventional",
                    count: self.accounts().conventionalAccounts.length,
                    label: self.locale.accountType.conventional
                },
                {
                    id: "islamic",
                    count: self.accounts().islamicAccounts.length,
                    label: self.locale.accountType.islamic
                }
            ];
        }

        function setBankConfig(data) {
            self.accountsData.modulesList = data.bankConfigurationDTO.moduleList;
            self.displayFunction();
        }

        const executor = $.Deferred();

        AnalysisModel.fetchDemandDepositAccounts().done(function(data) {
            self.accountsData = data;
            executor.resolve();
        });

        executor.done(function() {
            setData();

            AnalysisModel.fetchBankConfig().done(function(data) {
                setBankConfig(data);
            });
        });

        self.checkedOption.subscribe(function(newValue) {
            if (newValue === "conventional") {
                self.conventionalAnalysis(true);
            } else if (newValue === "islamic") {
                self.conventionalAnalysis(false);
            }
        });
    };
});