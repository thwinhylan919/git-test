define([
    "ojL10n!resources/nls/finance-maturing-widget",
    "knockout",
    "./model",
    "ojs/ojcore",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojchart",
    "ojs/ojselectcombobox",
    "ojs/ojvalidation-number"

], function (resourceBundle, ko, Model, oj) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        self.financeList = [];
        self.currency = ko.observable(params.dashboard.appData.localCurrency);
        self.currencies = ko.observableArray();
        self.currencyLoaded = ko.observable(false);
        self.showGraph = ko.observable(false);
        self.showEmptyImage = ko.observable(false);
        self.lineGroups = ko.observableArray([self.nls.duration1, self.nls.duration2, self.nls.duration3, self.nls.duration4, self.nls.duration5]);
        self.lineSeries = ko.observableArray();
        self.numberformatter = ko.observable();

        self.queryParameter = ko.observable({
            criteria: []
        });

        params.baseModel.registerComponent("view-finances", "supply-chain-finance");

        const converterFactory = oj.Validation.converterFactory("number");
        let currencyConverter;

        const jsonDataFinanceStatus = self.nls.FinanceStatus,
            financeStatusArray = [];

        Object.keys(jsonDataFinanceStatus).forEach(function (key) {
            financeStatusArray.push(key);
        });

        self.setProgramQueryParameters = function () {
            self.queryParameter().criteria = [];

            self.queryParameter().criteria.push({
                operand: "status",
                operator: "IN",
                value: financeStatusArray
            });

            self.queryParameter().criteria.push({
                operand: "currency",
                operator: "EQUALS",
                value: [self.currency()]
            });
        };

        self.drawGraph = function (list) {
            self.showEmptyImage(false);
            ko.tasks.runEarly();

            if (list.length > 0) {
                let overdue = 0,
                    dueIn30days = 0,
                    dueIn60days = 0,
                    dueIn90days = 0,
                    moreThan90days = 0,
                    currentDate = null,
                    dateToCompare = null;

                const dueIn30date = new Date(params.baseModel.getDate().setDate(params.baseModel.getDate().getDate() + 30)),
                    dueIn60date = new Date(params.baseModel.getDate().setDate(params.baseModel.getDate().getDate() + 60)),
                    dueIn90date = new Date(params.baseModel.getDate().setDate(params.baseModel.getDate().getDate() + 90));

                list.forEach(function (entry) {
                    currentDate = params.baseModel.getDate();
                    dateToCompare = new Date(entry.dueDate);

                    if (currentDate > dateToCompare) {
                        overdue = overdue + parseFloat(entry.totalAmount.amount);
                    } else if (currentDate <= dateToCompare && dateToCompare < dueIn30date) {
                        dueIn30days = dueIn30days + parseFloat(entry.totalAmount.amount);
                    } else if (currentDate < dateToCompare && dateToCompare <= dueIn60date) {
                        dueIn60days = dueIn60days + parseFloat(entry.totalAmount.amount);
                    } else if (currentDate < dateToCompare && dateToCompare <= dueIn90date) {
                        dueIn90days = dueIn90days + parseFloat(entry.totalAmount.amount);
                    } else {
                        moreThan90days = moreThan90days + parseFloat(entry.totalAmount.amount);
                    }
                });

                self.lineSeries([{
                    name: params.baseModel.format(self.nls.seriesLabel, {
                        currency: self.currency()
                    }),
                    color: "#3E913E",
                    markerShape: "circle",
                    markerColor: "#3E913E",
                    items: [{
                        y: overdue,
                        label: overdue
                    }, {
                        y: dueIn30days,
                        label: dueIn30days
                    }, {
                        y: dueIn60days,
                        label: dueIn60days
                    }, {
                        y: dueIn90days,
                        label: dueIn90days
                    }, {
                        y: moreThan90days,
                        label: moreThan90days
                    }]
                }]);

                currencyConverter = converterFactory.createConverter({
                    style: "currency",
                    currency: self.currency(),
                    currencyDisplay: "symbol",
                    currencyFormat: "short",
                    minimumFractionDigits: "0"
                });

                self.numberformatter(currencyConverter);
            } else {
                self.showEmptyImage(true);
            }
        };

        Model.currenciesget().then(function (response) {
            self.currencies(response.currencyList);
            self.currencyLoaded(true);
        });

        self.setProgramQueryParameters();

        Model.financesGet(JSON.stringify(self.queryParameter())).then(function (response) {
            if (response.finances) {
                response.finances.forEach(function (data) {
                    self.financeList.push(data);
                });
            }

            self.drawGraph(self.financeList);
            self.showGraph(true);

        });

        self.onClickViewAllFinances = function () {
            params.dashboard.loadComponent("view-finances");
        };

        const CurrencySelectionValueSubscriber = self.currency.subscribe(function () {
            self.showGraph(false);
            ko.tasks.runEarly();

            self.setProgramQueryParameters();

            Model.financesGet(JSON.stringify(self.queryParameter())).then(function (response) {
                self.financeList = [];

                if (response.finances) {
                    response.finances.forEach(function (data) {
                        self.financeList.push(data);
                    });
                }

                self.drawGraph(self.financeList);
                self.showGraph(true);
            });
        });

        self.dispose = function () {
            CurrencySelectionValueSubscriber.dispose();
        };
    };
});