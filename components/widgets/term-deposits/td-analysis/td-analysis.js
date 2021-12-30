define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/td-analysis",
    "ojs/ojbutton"
], function(ko, $, AnalysisModel, ResourceBundle) {
    "use strict";

    return function() {
        const self = this;

        self.resource = ResourceBundle;
        self.checkedOption = ko.observable("conventional");
        self.multipleModules = ko.observable(false);
        self.conventionalAnalysis = ko.observable(true);
        self.dataFetched = ko.observable(false);
        self.totalCurrentBal = ko.observable(0);
        self.totalInvestment = ko.observable(0);
        self.totalMaturityAmount = ko.observable(0);
        self.baseCcy = ko.observable();
        self.noAccounts = ko.observable(true);

        self.noAccountsData = {
            image: "analysis/term-deposits.svg",
            noAccountText: self.resource.TDanalysis.noData,
            bottomText: self.resource.TDanalysis.bottomText
        };

        self.options = [{
                id: "conventional",
                count: 0,
                label: self.resource.accountType.conventional
            },
            {
                id: "islamic",
                count: 0,
                label: self.resource.accountType.islamic
            }
        ];

        let summary;
        const animate = function(max, context) {
            const obj = context;
            let existing = 5;
            const draw = function() {
                    if (obj) {
                        obj.setAttribute("width", existing);
                    }
                },
                step = function() {
                    draw();
                    existing = existing + 5;

                    if (max >= existing) {
                        requestAnimationFrame(step);
                    }
                };

            step();
        };

        self.draw = function() {
            const componentWidth = $(".td-analysis-container>div").width(),
                ratio1 = componentWidth * (self.totalInvestment() / self.totalMaturityAmount()),
                ratio2 = componentWidth * (self.totalCurrentBal() / self.totalMaturityAmount());

            if (self.options[1].count > 0 || self.options[0].count > 0) {
                if (document.getElementById("rect1")) {
                    document.getElementById("rect1").setAttribute("height", 12);
                    document.getElementById("rect1").setAttribute("width", ratio1);
                    document.getElementById("rect1").setAttribute("fill", "#21a0a0");
                }

                if (document.getElementById("rect2")) {
                    document.getElementById("rect2").setAttribute("height", 12);
                    document.getElementById("rect2").setAttribute("width", ratio2);
                    document.getElementById("rect2").setAttribute("fill", "#4b71bc");
                }

                if (self.conventionalAnalysis() && document.getElementById("rect3")) {
                    document.getElementById("rect3").setAttribute("height", 12);
                    document.getElementById("rect3").setAttribute("width", componentWidth);
                    document.getElementById("rect3").setAttribute("fill", "#4b5196");
                }

                animate(ratio1, $("#rect1")[0]);
                animate(ratio2, $("#rect2")[0]);

                if (self.conventionalAnalysis()) {
                    animate(componentWidth, $("#rect3")[0]);
                }
            }
        };

        const resetData = function(value) {
            self.totalCurrentBal(0);
            self.totalInvestment(0);
            self.totalMaturityAmount(0);
            self.baseCcy("");

            if (value === "conventional") {
                self.conventionalAnalysis(true);

                summary.forEach(function(item) {
                    self.totalCurrentBal(self.totalCurrentBal() + item.totalActiveAvailableBalance.amount);
                    self.totalInvestment(self.totalInvestment() + item.totalActiveInvestmentAmount.amount);
                    self.totalMaturityAmount(self.totalMaturityAmount() + item.totalActiveMaturityAmount.amount);
                    self.baseCcy(item.totalActiveMaturityAmount.currency);
                });

            } else if (value === "islamic") {
                self.conventionalAnalysis(false);

                summary.forEach(function(item) {
                    self.totalCurrentBal(self.totalCurrentBal() + item.totalISLActiveAvailableBalance.amount);
                    self.totalInvestment(self.totalInvestment() + item.totalISLActiveInvestmentAmount.amount);
                    self.totalMaturityAmount(self.totalMaturityAmount() + item.totalISLActiveMaturityAmount.amount);
                    self.baseCcy(item.totalISLActiveMaturityAmount.currency);
                });

            }

            self.draw();
        };

        self.drawGraph = function() {
            self.draw();
        };

        function setData(accountInfoData, bankConfigData) {

            if (accountInfoData.summary && accountInfoData.summary.items && accountInfoData.summary.items.length > 0) {
                summary = accountInfoData.summary.items;

                for (let i = 0; i < accountInfoData.accounts.length; i++) {
                    if (accountInfoData.accounts[i].module === "CON" && accountInfoData.accounts[i].status === "ACTIVE") {
                        self.options[0].count += 1;
                    } else if (accountInfoData.accounts[i].module === "ISL" && accountInfoData.accounts[i].status === "ACTIVE") {
                        self.options[1].count += 1;
                    }

                    self.noAccounts(false);
                }

                resetData(self.conventionalAnalysis() ? "conventional" : "islamic");

                if (self.options[1].count > 0 && self.options[0].count === 0) {
                    self.conventionalAnalysis(false);
                }

                if (bankConfigData.bankConfigurationDTO.moduleList.length > 1 && self.options[0].count > 0 && self.options[1].count) {
                    self.multipleModules(true);
                }

                self.dataFetched(true);
                ko.tasks.runEarly();
                resetData(self.conventionalAnalysis() ? "conventional" : "islamic");
            }
        }

        $.when(AnalysisModel.fetchAccountInfo(), AnalysisModel.fetchBankConfig()).done(function(accountInfoData, bankConfigData) {
            setData(accountInfoData, bankConfigData);
        });

        self.checkedOption.subscribe(function(value) {
            resetData(value);
        });
    };
});