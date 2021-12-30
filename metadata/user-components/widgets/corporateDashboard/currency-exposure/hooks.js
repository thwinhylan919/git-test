define([
    "./model",
    "knockout",
    "ojs/ojcore"
], function (Model, ko, oj) {
    "use strict";

    return function () {
        let self,
         params;

                function currencygetCall(moduleType, payload, config) {
            return Model.currencyget(moduleType, payload, config);
        }

                function accountsdepositgetCall(status, taskCode, module, expand, noDepositNumber, payload, config) {
            return Model.accountsdepositget(status, taskCode, module, expand, noDepositNumber, payload, config);
        }

                function accountsdemandDepositgetCall(status, taskCode, module, expand, excludeBaseCurrency, lmEnabled, accountCurrency, productType, accountType, payload, config) {
            return Model.accountsdemandDepositget(status, taskCode, module, expand, excludeBaseCurrency, lmEnabled, accountCurrency, productType, accountType, payload, config);
        }

                function billsgetCall(billReferenceNo, drawee, drawer, status, billAmtFrom, billAmtTo, billDateFrom, billDateTo, partyId, billType, payload, config) {
            return Model.billsget(billReferenceNo, drawee, drawer, status, billAmtFrom, billAmtTo, billDateFrom, billDateTo, partyId, billType, payload, config);
        }

                function supplyChainFinanceinvoicesgetCall(queryParams, sortBy, count, currency, fromAmount, toAmount, fromDate, toDate, payload, config) {
            return Model.supplyChainFinanceinvoicesget(queryParams, sortBy, count, currency, fromAmount, toAmount, fromDate, toDate, payload, config);
        }

                function currency2ValueChangeHook(newValue) {
            self.chartLoaded(false);
            self.currencySelected(newValue);
            self.setData(self.currencySelected());
            self.setChartData(self.currencySelected());
        }

                function onClickCSAccountsAccounts6() {
            params.dashboard.switchModule("demand-deposits");
        }

                function onClickTDAccountsAccounts24() {
            params.dashboard.switchModule("term-deposits");
        }

                function onClickInitiateDeal91() {
            params.dashboard.loadComponent("forex-deal-create", { currency: self.currencySelected });
        }

                function onClickInitiateDeal1() {
            params.dashboard.loadComponent("forex-deal-create", { currency: self.currencySelected });
        }

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;
            rootParams.baseModel.registerComponent("forex-deal-create", "forex-deal");
            rootParams.baseModel.registerComponent("term-deposits", "MODULE");
            rootParams.baseModel.registerComponent("demand-deposits", "MODULE");

            const currentDate = params.baseModel.getDate();

            currentDate.setDate(currentDate.getDate());
            self.branchDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(currentDate));
            self.barSeriesValue = ko.observableArray([]);
            self.barGroupsValue = ko.observableArray([]);
            self.currencyListOptions = ko.observable();
            self.currencySelected = ko.observable("");
            self.CSAccounts = ko.observable(0);
            self.termDepositAccounts = ko.observable(0);
            self.currencyListloaded = ko.observable(false);
            self.chartLoaded = ko.observable(false);
            self.totalAmountAccounts = ko.observable(0);
            self.totalAmountTD = ko.observable(0);
            self.partyId = ko.observable(rootParams.dashboard.userData.userProfile.partyId.value);
            self.barSeries = [];
            self.barGroups = [];
            self.queryParamsBuyer = ko.observable({ criteria: [] });
            self.queryParamsSupplier = ko.observable({ criteria: [] });

            self.queryParamsBuyer().criteria.push({
                operand: "program.role",
                operator: "ENUM",
                value: ["B"]
            }, {
                operand: "paymentStatus",
                operator: "IN",
                value: [
                    "OVERDUE",
                    "PART_PAID",
                    "UNPAID"
                ]
            }, {
                operand: "invoiceStatus",
                operator: "IN",
                value: [
                    "ACCEPTED",
                    "RAISED",
                    "FINANCED",
                    "PARTIAL_FINANCED"
                ]
            });

            self.queryParamsSupplier().criteria.push({
                operand: "program.role",
                operator: "ENUM",
                value: ["S"]
            }, {
                operand: "paymentStatus",
                operator: "IN",
                value: [
                    "OVERDUE",
                    "PART_PAID",
                    "UNPAID"
                ]
            }, {
                operand: "invoiceStatus",
                operator: "IN",
                value: [
                    "ACCEPTED",
                    "RAISED",
                    "FINANCED",
                    "PARTIAL_FINANCED"
                ]
            });

            currencygetCall(null, null, { mockedUrl: "framework/json/design-dashboard/corporateDashboard/currency-exposure/currency.json" }).then(function (currencyData) {
                const currency = currencyData.currencyList.map(function (currencyData) {
                    return {
                        value: currencyData.code,
                        label: currencyData.code
                    };
                });

                self.currencyListOptions(currency);
                self.currencyListloaded(true);
            });

            self.setBillsData = function (response, currency, months) {
                const CurrentMonth = new Date(self.branchDate()).getMonth();

                for (let i = 0; i < response[0].billDTOs.length; i++) {
                    if (currency === response[0].billDTOs[i].amount.currency) {
                        const maturityDate = new Date(response[0].billDTOs[i].transactionDate), monthNum = maturityDate.getMonth(), yearNum = maturityDate.getFullYear(), curentYear = new Date(self.branchDate()).getFullYear();

                        if (yearNum < curentYear) {
                            self.barSeries[0].items[0].bills += response[0].billDTOs[i].amount.amount;
                            self.barSeries[0].items[0].y += response[0].billDTOs[i].amount.amount;
                        } else if (yearNum === curentYear && monthNum < CurrentMonth) {
                            self.barSeries[0].items[0].bills += response[0].billDTOs[i].amount.amount;
                            self.barSeries[0].items[0].y += response[0].billDTOs[i].amount.amount;
                        } else if (yearNum === curentYear && monthNum >= CurrentMonth) {
                            const itemIndex = self.barGroups.indexOf(months[monthNum]);

                            if (itemIndex !== -1) {
                                self.barSeries[0].items[itemIndex].bills += response[0].billDTOs[i].amount.amount;
                                self.barSeries[0].items[itemIndex].y += response[0].billDTOs[i].amount.amount;
                            }
                        } else if (yearNum === curentYear + 1) {
                            const itemIndex = self.barGroups.indexOf(months[monthNum]);

                            if (itemIndex !== -1) {
                                self.barSeries[0].items[itemIndex].bills += response[0].billDTOs[i].amount.amount;
                                self.barSeries[0].items[itemIndex].y += response[0].billDTOs[i].amount.amount;
                            }
                        }
                    }
                }

                for (let i = 0; i < response[1].billDTOs.length; i++) {
                    if (currency === response[1].billDTOs[i].amount.currency) {
                        const maturityDate = new Date(response[1].billDTOs[i].transactionDate), monthNum = maturityDate.getMonth(), yearNum = maturityDate.getFullYear(), curentYear = new Date(self.branchDate()).getFullYear();

                        if (yearNum < curentYear) {
                            self.barSeries[1].items[0].bills += response[1].billDTOs[i].amount.amount;
                            self.barSeries[1].items[0].y += response[1].billDTOs[i].amount.amount;
                        } else if (yearNum === curentYear && monthNum < CurrentMonth) {
                            self.barSeries[1].items[0].bills += response[1].billDTOs[i].amount.amount;
                            self.barSeries[1].items[0].y += response[1].billDTOs[i].amount.amount;
                        } else if (yearNum === curentYear && monthNum >= CurrentMonth) {
                            const itemIndex = self.barGroups.indexOf(months[monthNum]);

                            if (itemIndex !== -1) {
                                self.barSeries[1].items[itemIndex].bills += response[1].billDTOs[i].amount.amount;
                                self.barSeries[1].items[itemIndex].y += response[1].billDTOs[i].amount.amount;
                            }
                        } else if (yearNum === curentYear + 1) {
                            const itemIndex = self.barGroups.indexOf(months[monthNum]);

                            if (itemIndex !== -1) {
                                self.barSeries[1].items[itemIndex].bills += response[1].billDTOs[i].amount.amount;
                                self.barSeries[1].items[itemIndex].y += response[1].billDTOs[i].amount.amount;
                            }
                        }
                    }
                }
            };

            self.setInvoicesData = function (response, months) {
                const CurrentMonth = new Date(self.branchDate()).getMonth(), invoiceStatus = [
                        "REJECTED",
                        "CANCELLED",
                        "DISPUTED"
                    ];

                for (let i = 0; i < response[2].invoices.length; i++) {
                    if (!invoiceStatus.includes(response[2].invoices[i].invoiceStatus)) {
                        const maturityDate = new Date(response[2].invoices[i].invoiceDueDate), monthNum = maturityDate.getMonth(), yearNum = maturityDate.getFullYear(), curentYear = new Date(self.branchDate()).getFullYear();

                        if (yearNum < curentYear) {
                            self.barSeries[1].items[0].invoices += response[2].invoices[i].outstandingAmount.amount;
                            self.barSeries[1].items[0].y += response[2].invoices[i].outstandingAmount.amount;
                        } else if (yearNum === curentYear && monthNum <= CurrentMonth) {
                            self.barSeries[1].items[0].invoices += response[2].invoices[i].outstandingAmount.amount;
                            self.barSeries[1].items[0].y += response[2].invoices[i].outstandingAmount.amount;
                        } else if (yearNum === curentYear && monthNum > CurrentMonth) {
                            const itemIndex = self.barGroups.indexOf(months[monthNum]);

                            if (itemIndex !== -1) {
                                self.barSeries[1].items[itemIndex].invoices += response[2].invoices[i].outstandingAmount.amount;
                                self.barSeries[1].items[itemIndex].y += response[2].invoices[i].outstandingAmount.amount;
                            }
                        } else if (yearNum === curentYear + 1) {
                            const itemIndex = self.barGroups.indexOf(months[monthNum]);

                            if (itemIndex !== -1) {
                                self.barSeries[1].items[itemIndex].invoices += response[2].invoices[i].outstandingAmount.amount;
                                self.barSeries[1].items[itemIndex].y += response[2].invoices[i].outstandingAmount.amount;
                            }
                        }
                    }
                }

                for (let i = 0; i < response[3].invoices.length; i++) {
                    if (!invoiceStatus.includes(response[3].invoices[i].invoiceStatus)) {
                        const maturityDate = new Date(response[3].invoices[i].invoiceDueDate), monthNum = maturityDate.getMonth(), yearNum = maturityDate.getFullYear(), curentYear = new Date(self.branchDate()).getFullYear();

                        if (yearNum < curentYear) {
                            self.barSeries[0].items[0].invoices += response[3].invoices[i].outstandingAmount.amount;
                            self.barSeries[0].items[0].y += response[3].invoices[i].outstandingAmount.amount;
                        } else if (yearNum === curentYear && monthNum <= CurrentMonth) {
                            self.barSeries[0].items[0].invoices += response[3].invoices[i].outstandingAmount.amount;
                            self.barSeries[0].items[0].y += response[3].invoices[i].outstandingAmount.amount;
                        } else if (yearNum === curentYear && monthNum > CurrentMonth) {
                            const itemIndex = self.barGroups.indexOf(months[monthNum]);

                            if (itemIndex !== -1) {
                                self.barSeries[0].items[itemIndex].invoices += response[3].invoices[i].outstandingAmount.amount;
                                self.barSeries[0].items[itemIndex].y += response[3].invoices[i].outstandingAmount.amount;
                            }
                        } else if (yearNum === curentYear + 1) {
                            const itemIndex = self.barGroups.indexOf(months[monthNum]);

                            if (itemIndex !== -1) {
                                self.barSeries[0].items[itemIndex].invoices += response[3].invoices[i].outstandingAmount.amount;
                                self.barSeries[0].items[itemIndex].y += response[3].invoices[i].outstandingAmount.amount;
                            }
                        }
                    }
                }
            };

            self.setChartData = function (currency) {
                const months = [
                        self.nls.months.Jan,
                        self.nls.months.Feb,
                        self.nls.months.Mar,
                        self.nls.months.Apr,
                        self.nls.months.May,
                        self.nls.months.June,
                        self.nls.months.July,
                        self.nls.months.Aug,
                        self.nls.months.Sept,
                        self.nls.months.Oct,
                        self.nls.months.Nov,
                        self.nls.months.Dec
                    ], currentDate = new Date(self.branchDate()), CurrentMonth = currentDate.getMonth();

                self.barGroups = [];

                for (let i = CurrentMonth; i < 12; i++) {
                    self.barGroups.push(months[i]);
                }

                if (self.barGroups.length < 6) {
                    const remainingMonths = 6 - self.barGroups.length;

                    for (let i = 0; i < remainingMonths; i++) {
                        self.barGroups.push(months[i]);
                    }
                }

                const itemsReceivables = [], itemsPayables = [];

                self.barSeries = [];

                for (let j = 0; j < 6; j++) {
                    itemsReceivables.push({
                        y: 0,
                        bills: 0,
                        invoices: 0
                    });

                    itemsPayables.push({
                        y: 0,
                        bills: 0,
                        invoices: 0
                    });
                }

                self.barSeries.push({
                    name: "Receivables",
                    items: itemsReceivables
                });

                self.barSeries.push({
                    name: "Payables",
                    items: itemsPayables
                });

                Promise.all([
                    billsgetCall(null, null, null, "ACTIVE", null, null, null, null, self.partyId(), "EXPORT", null, { mockedUrl: "framework/json/design-dashboard/corporateDashboard/currency-exposure/bills/export-bills.json" }),
                    billsgetCall(null, null, null, "ACTIVE", null, null, null, null, self.partyId(), "IMPORT", null, { mockedUrl: "framework/json/design-dashboard/corporateDashboard/currency-exposure/bills/import-bills.json" }),
                    supplyChainFinanceinvoicesgetCall(JSON.stringify(self.queryParamsBuyer()), null, null, self.currencySelected(), null, null, null, null, null, { mockedUrl: "framework/json/design-dashboard/corporateDashboard/currency-exposure/invoices/buyer.json" }),
                    supplyChainFinanceinvoicesgetCall(JSON.stringify(self.queryParamsSupplier()), null, null, self.currencySelected(), null, null, null, null, null, { mockedUrl: "framework/json/design-dashboard/corporateDashboard/currency-exposure/invoices/supplier.json" })
                ]).then(function (response) {
                    self.setBillsData(response, currency, months);
                    self.setInvoicesData(response, months);
                    self.barSeriesValue(self.barSeries);
                    self.barGroupsValue(self.barGroups);
                    ko.tasks.runEarly();
                    self.chartLoaded(true);
                }).catch(function () {
                    self.barSeriesValue(self.barSeries);
                    self.barGroupsValue(self.barGroups);
                    ko.tasks.runEarly();
                    self.chartLoaded(true);
                });
            };

            self.setData = function (newValue) {
                let casaAmount = 0, casaAccountCount = 0, tdAmount = 0, tdAccountCount = 0;

                accountsdemandDepositgetCall(null, null, null, null, null, null, null, null, null, null, { mockedUrl: "framework/json/design-dashboard/corporateDashboard/currency-exposure/accounts/demand-deposit.json" }).then(function (casaAccountsData) {
                    if (casaAccountsData.accounts) {
                        for (let i = 0; i < casaAccountsData.accounts.length; i++) {
                            if (newValue === casaAccountsData.accounts[i].availableBalance.currency) {
                                casaAmount += casaAccountsData.accounts[i].availableBalance.amount;
                                casaAccountCount++;
                            }
                        }
                    }

                    accountsdepositgetCall(null, null, null, null, null, null, {
                        queryParams: {
                            module: [
                                "CON",
                                "ISL"
                            ]
                        },
                        mockedUrl: "framework/json/design-dashboard/corporateDashboard/currency-exposure/accounts/deposit.json"
                    }).then(function (tdAccountsData) {
                        if (tdAccountsData.accounts) {
                            for (let i = 0; i < tdAccountsData.accounts.length; i++) {
                                if (newValue === tdAccountsData.accounts[i].maturityAmount.currency) {
                                    tdAmount += tdAccountsData.accounts[i].maturityAmount.amount;
                                    tdAccountCount++;
                                }
                            }
                        }

                        self.totalAmountTD(tdAmount);
                        self.termDepositAccounts(params.baseModel.format(self.nls.CurrencyExposure.TDAccountsAccounts, { TDAccounts: tdAccountCount }));
                    });

                    self.totalAmountAccounts(casaAmount);
                    self.CSAccounts(params.baseModel.format(self.nls.CurrencyExposure.CSAccountsAccounts, { CSAccounts: casaAccountCount }));
                }).catch(function () {
                    self.totalAmountTD(tdAmount);
                    self.termDepositAccounts(params.baseModel.format(self.nls.CurrencyExposure.TDAccountsAccounts, { TDAccounts: tdAccountCount }));
                    self.totalAmountAccounts(casaAmount);
                    self.CSAccounts(params.baseModel.format(self.nls.CurrencyExposure.CSAccountsAccounts, { CSAccounts: casaAccountCount }));
                });
            };

            if (self.currencySelected() === "") {
                self.chartLoaded(false);
                self.currencySelected(rootParams.dashboard.appData.localCurrency);
                self.setData(self.currencySelected());
                self.setChartData(self.currencySelected());
            }

            self.getTooltip = function (data) {
                const separator = "</br>", tooltip = params.baseModel.format(self.nls.overall, {
                        overall: params.baseModel.formatCurrency(data.data.y, self.currencySelected()),
                        series: data.series
                    }) + separator + params.baseModel.format(self.nls.bills, { bills: params.baseModel.formatCurrency(data.data.bills, self.currencySelected()) }) + separator + params.baseModel.format(self.nls.invoices, { invoices: params.baseModel.formatCurrency(data.data.invoices, self.currencySelected()) });

                return { insert: tooltip };
            };

            return true;
        }

        return {
            currencygetCall: currencygetCall,
            accountsdepositgetCall: accountsdepositgetCall,
            accountsdemandDepositgetCall: accountsdemandDepositgetCall,
            billsgetCall: billsgetCall,
            supplyChainFinanceinvoicesgetCall: supplyChainFinanceinvoicesgetCall,
            currency2ValueChangeHook: currency2ValueChangeHook,
            onClickCSAccountsAccounts6: onClickCSAccountsAccounts6,
            onClickTDAccountsAccounts24: onClickTDAccountsAccounts24,
            onClickInitiateDeal91: onClickInitiateDeal91,
            onClickInitiateDeal1: onClickInitiateDeal1,
            init: init
        };
    };
});