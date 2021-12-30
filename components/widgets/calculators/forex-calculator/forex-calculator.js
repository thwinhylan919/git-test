define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/forex-calculator",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojselectcombobox",
    "ojs/ojknockout",
    "ojs/ojvalidationgroup"
], function (ko, forexCalculatorModel, resourceBundle) {
    "use strict";

    return function (rootParams) {
        const self = this;

        rootParams.baseModel.registerElement([
            "page-section",
            "amount-input"
        ]);

        self.nls = resourceBundle;
        self.currencyForeign = ko.observable();
        self.currencyLocal = ko.observableArray();
        self.localAmount = ko.observable();
        self.exchangeRate = ko.observable();
        self.buyCurrency = ko.observable();
        self.sellCurrency = ko.observable();
        self.optionsLoadedCUR = ko.observable(false);
        self.optionsLoadedCURLocal = ko.observable(false);
        self.showRate = ko.observable(false);
        self.dataCURTraverse = ko.observableArray();
        self.dataCURTraverseLocal = ko.observableArray();
        self.showCurRate = ko.observable(0);
        self.conditionTag = ko.observable(false);
        self.validationTracker = ko.observable();

        if (rootParams.dashboard.isDashboard() === true) {
            self.foreignAmount = ko.observable(1);
        } else {
            self.foreignAmount = ko.observable();

            if (!rootParams.baseModel.isDashboardBuilderContext()) {
                rootParams.dashboard.headerName(self.nls.forexCalculator.forex_calculator);
            }
        }

        forexCalculatorModel.fetchCurrency().done(function (data) {
            self.dataCURTraverse(data.exchangeRateCurrency);
            self.optionsLoadedCUR(true);
        });

        self.changeForeign = function (event) {
            if (event.detail.value) {
                self.optionsLoadedCURLocal(false);
                self.foreignAmount(1);

                self.dataCURTraverse().forEach(function (item) {
                    if (item.ccy1 === event.detail.value) {
                        self.dataCURTraverseLocal(item.ccy2);
                    }
                });

                ko.tasks.runEarly();
                self.optionsLoadedCURLocal(true);
            }
        };

        self.calculatedAmount = ko.pureComputed(function () {
            return rootParams.baseModel.formatCurrency(self.foreignAmount() * self.showCurRate(), self.currencyLocal());
        });

        self.changeLocal = function (event) {
            if (event.detail.value) {
                self.showRate(false);
                self.conditionTag(false);
            }
        };

        self.localToForeign = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("forexcheck"))) {
                return;
            }

            const payload = {
                sellCurrency: {
                    currency: self.currencyForeign(),
                    amount: null
                },
                buyCurrency: {
                    currency: self.currencyLocal(),
                    amount: self.localAmount()
                }
            };

            forexCalculatorModel.fetchExAmount(ko.toJSON(payload)).done(function (data) {
                self.foreignAmount(data.sellingCurrency.amount);
                self.showRate(false);
                self.showRate(true);
                self.buyCurrency(self.currencyLocal());
                self.sellCurrency(self.currencyForeign());
                self.exchangeRate(data.midRateAmountReciprocal);
            });
        };

        self.foreignToLocal = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("forexcheck"))) {
                return;
            }

            if (typeof self.currencyLocal() === "object") {
                self.currencyLocal(self.currencyLocal()[0]);
            }

            const payload = {
                sellCurrency: {
                    currency: self.currencyLocal(),
                    amount: null
                },
                buyCurrency: {
                    currency: self.currencyForeign(),
                    amount: self.foreignAmount()
                }
            };

            forexCalculatorModel.fetchExAmount(ko.toJSON(payload)).done(function (data) {
                if (data.sellingCurrency) {
                    self.localAmount(data.sellingCurrency.amount);
                    self.showRate(false);
                    self.showRate(true);
                    self.buyCurrency(self.currencyForeign());
                    self.sellCurrency(self.currencyLocal());
                    self.exchangeRate(data.midRateAmount);
                    self.showCurRate(data.midRateAmount);
                    self.conditionTag(true);
                }
            });
        };

        self.forexCalculatorType = ko.observable(true);

        if (rootParams.baseModel.isDashboardBuilderContext()) {
            self.forexCalculatorType(true);
        } else if (rootParams.dashboard.isDashboard()) {
            self.forexCalculatorType(true);
        } else if (!rootParams.dashboard.isDashboard()) {
            self.forexCalculatorType(false);
        }
    };
});