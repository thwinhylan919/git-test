define([
    "ojL10n!resources/nls/request-finance-invoice-list",
    "jquery",
    "knockout",
    "./model",
    "ojs/ojcore",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojcheckboxset",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojbutton",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource"
], function (resourceBundle, $, ko, Model, oj) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);
        self.modelInstance = params.rootModel.modelInstance;

        params.baseModel.registerElement("amount-input");
        self.selectAll = ko.observable([]);
        self.selectAllList = ko.observable([]);
        self.showInvoices = ko.observable(false);
        self.invoiceList = params.rootModel.invoiceList;
        self.maxPercent = ko.observable(0);
        self.maxPercent(self.invoiceList().length > 0 ? self.invoiceList()[0].maxFinancePercentage : 0);
        self.currencyCountMap = params.rootModel.currencyCountMap;
        self.currencyConversionMap = params.rootModel.currencyConversionMap;
        params.baseModel.registerComponent("request-finance-review", "supply-chain-finance");
        params.baseModel.registerComponent("preview-invoice-details", "supply-chain-finance");
        params.baseModel.registerElement("modal-window");

        self.queryParameter = ko.observable({
            criteria: []
        });

        self.columnsArray = [{
                headerRenderer: oj.KnockoutTemplateUtils.getRenderer("checkbox_hdr_tmpl", true),
                field: "selectBox"
            },
            {
                headerText: self.nls.InvoiceList.InvoiceNumber,
                sortable: false
            },
            {
                headerText: self.nls.invoiceAmount,
                sortable: false,
                headerClassName: "right"
            },
            {
                headerText: self.nls.totalInvoiceAmount,
                sortable: false,
                headerClassName: "right"
            },
            {
                headerText: self.nls.maximumFinanceAmount,
                sortable: false,
                headerClassName: "right"
            },
            {
                headerText: self.nls.outstandingAmount,
                sortable: false,
                headerClassName: "right"
            },
            {
                headerText: self.nls.netFinanceAmount,
                sortable: false,
                headerClassName: "right"
            }
        ];

        const mapForCurrency = new Map;

        if (self.currencyConversionMap && self.currencyConversionMap() && self.currencyConversionMap().length > 0) {
            self.currencyConversionMap().forEach(function (rate) {
                mapForCurrency.set(rate.currency, rate.value);
            });
        }

        self.calculateTotal = function (event, data, amount, amountInvCurrency) {
            if (event === null) {
                self.modelInstance.navData.totalInvoicesSelected(self.modelInstance.navData.totalInvoicesSelected() + 1);
                self.modelInstance.navData.totalAmountSelected(self.modelInstance.navData.totalAmountSelected() + amount);
                self.modelInstance.navData.totalAmountSelectedInvCurrency(self.modelInstance.navData.totalAmountSelectedInvCurrency() + amountInvCurrency);
                self.modelInstance.payLoad.totalAmount.amount(self.modelInstance.navData.totalAmountSelected());
                self.currencyCountMap().push(data.outstandingAmount.currency);
                self.modelInstance.navData.invoiceCurrency(self.currencyCountMap()[0]);
            } else if (event.target.value.length === 0) {
                self.modelInstance.navData.totalInvoicesSelected(self.modelInstance.navData.totalInvoicesSelected() - 1);
                self.modelInstance.navData.totalAmountSelected(self.modelInstance.navData.totalAmountSelected() - amount);
                self.modelInstance.navData.totalAmountSelectedInvCurrency(self.modelInstance.navData.totalAmountSelectedInvCurrency() - amountInvCurrency);
                self.modelInstance.payLoad.totalAmount.amount(self.modelInstance.navData.totalAmountSelected());

                if (self.currencyCountMap().length > 0) {
                    self.currencyCountMap().pop();
                }
            } else {
                self.modelInstance.navData.totalInvoicesSelected(self.modelInstance.navData.totalInvoicesSelected() + 1);
                self.modelInstance.navData.totalAmountSelected(self.modelInstance.navData.totalAmountSelected() + amount);
                self.modelInstance.payLoad.totalAmount.amount(self.modelInstance.navData.totalAmountSelected());
                self.modelInstance.navData.totalAmountSelectedInvCurrency(self.modelInstance.navData.totalAmountSelectedInvCurrency() + amountInvCurrency);
                self.currencyCountMap().push(data.outstandingAmount.currency);
                self.modelInstance.navData.invoiceCurrency(self.currencyCountMap()[0]);
            }
        };

        self.calculateAmount = function (event, data) {
            let amount = Math.min(data.outstandingAmount.amount, data.acceptanceAmount.amount * data.maxFinancePercentage / 100);
            const amountInvCurrency = amount;

            if (data.outstandingAmount.currency !== self.modelInstance.payLoad.totalAmount.currency()) {
                let currencyRateFound = false;

                if (mapForCurrency.get(data.outstandingAmount.currency.concat(self.modelInstance.payLoad.totalAmount.currency()))) {
                    const rate = mapForCurrency.get(data.outstandingAmount.currency.concat(self.modelInstance.payLoad.totalAmount.currency()));

                    self.modelInstance.navData.midRate(rate);
                    amount = amount * rate;
                    self.calculateTotal(event, data, amount, amountInvCurrency);
                    currencyRateFound = true;
                }

                if (!currencyRateFound) {
                    Model.currencyRateget(data.outstandingAmount.currency, self.modelInstance.payLoad.totalAmount.currency()).then(function (response) {
                        if (response.exchangeRateDetails && response.exchangeRateDetails.length > 0 && response.exchangeRateDetails[0].midRate) {
                            if (!mapForCurrency.get(data.outstandingAmount.currency.concat(self.modelInstance.payLoad.totalAmount.currency()))) {
                                self.currencyConversionMap.push({
                                    currency: data.outstandingAmount.currency.concat(self.modelInstance.payLoad.totalAmount.currency()),
                                    value: response.exchangeRateDetails[0].midRate
                                });

                                mapForCurrency.set(data.outstandingAmount.currency.concat(self.modelInstance.payLoad.totalAmount.currency()), response.exchangeRateDetails[0].midRate);
                            }

                            self.modelInstance.navData.midRate(response.exchangeRateDetails[0].midRate);
                            amount = amount * response.exchangeRateDetails[0].midRate;
                            self.calculateTotal(event, data, amount, amountInvCurrency);
                        } else {
                            self.invoiceList()[data.seqNumber].cannotAdd = true;
                            self.invoiceList()[data.seqNumber].selectBox([]);
                            amount = 0.0;

                            params.baseModel.showMessages(null, [params.baseModel.format(self.nls.currencyRateMessage, {
                                currency1: data.outstandingAmount.currency,
                                currency2: self.modelInstance.payLoad.totalAmount.currency()
                            })], "ERROR");
                        }
                    }).catch(function () {
                        self.invoiceList()[data.seqNumber].cannotAdd = true;
                        self.invoiceList()[data.seqNumber].selectBox([]);
                        amount = 0.0;
                    });
                }
            } else {
                self.modelInstance.navData.midRate(1.00);
                self.calculateTotal(event, data, amount, amountInvCurrency);
            }
        };

        self.acceptComments = function (event, data) {

            if (self.invoiceList()[data.seqNumber].cannotAdd === false) {
                self.modelInstance.payLoad.totalAmount.amount(null);

                if (self.currencyCountMap().length !== 0 && self.currencyCountMap()[0] !== data.outstandingAmount.currency) {
                    $("#currencyInfoText").trigger("openModal");
                    self.invoiceList()[data.seqNumber].cannotAdd = true;
                    self.invoiceList()[data.seqNumber].selectBox([]);
                } else {
                    self.calculateAmount(event, data);
                }
            } else {
                self.invoiceList()[data.seqNumber].cannotAdd = false;
            }

        };

        self.closeModal = function () {
            $("#currencyInfoText").trigger("closeModal");
        };

        self.onClickInvoiceNumber13 = function (data) {

            params.dashboard.openRightPanel("preview-invoice-details", {
                invoiceNo: data.invoiceNumber,
                role: self.modelInstance.payLoad.role(),
                invoiceDetails: data,
                programName: data.program.programName,
                partyDetails: params.rootModel.mepartygetVar()
            }, self.nls.overlayTitle);

        };

        self.onSubmit = function () {
            let i = 0;

            if ((self.modelInstance.payLoad.totalAmount.amount() !== null && (isNaN(self.modelInstance.payLoad.totalAmount.amount()) || self.modelInstance.payLoad.totalAmount.amount() <= 0)) || self.modelInstance.payLoad.totalAmount.amount() === null) {
                self.modelInstance.payLoad.totalAmount.amount(self.modelInstance.navData.totalAmountSelected());
            }

            params.rootModel.modelInstance.navData.invoiceData = self.invoiceList;
            params.rootModel.modelInstance.navData.currencyCountMap = self.currencyCountMap;
            params.rootModel.modelInstance.navData.currencyConversionMap = self.currencyConversionMap;
            params.rootModel.modelInstance.payLoad.invoices.removeAll();

            for (i = 0; i < self.invoiceList().length; i++) {
                if (self.invoiceList()[i].selectBox()[0] === "selected") {
                    self.finalResponse = ko.observable(JSON.parse(JSON.stringify(self.invoiceList()[i])));
                    delete self.finalResponse().selectBox;
                    delete self.finalResponse().seqNumber;
                    delete self.finalResponse().cannotAdd;
                    params.rootModel.modelInstance.payLoad.invoices.push(self.finalResponse());
                }
            }

            if (params.rootModel.modelInstance.payLoad.invoices().length > 0) {
                params.dashboard.loadComponent("request-finance-review", {
                    data: params.rootModel.modelInstance,
                    fromReview: params.rootModel.fromReview
                });
            } else {
                params.baseModel.showMessages(null, [self.nls.invoiceErrorMessage], "ERROR");
            }

        };

        if (self.modelInstance.navData.searchModified()) {

            const jsonDataInvoiceStatus = self.nls.InvoiceStatus,
                jsonDataPaymentStatus = self.nls.PaymentStatus,

                invoiceStatusArray = [],
                paymentStausArray = [];

            Object.keys(jsonDataInvoiceStatus).forEach(function (key) {
                invoiceStatusArray.push(key);
            });

            Object.keys(jsonDataPaymentStatus).forEach(function (key) {
                paymentStausArray.push(key);
            });

            self.queryParameter().criteria.push({
                operand: "program.role",
                operator: "ENUM",
                value: [self.modelInstance.payLoad.role()]
            }, {
                operand: "associatedParty.associatedPartyKey.id",
                operator: "EQUALS",
                value: [self.modelInstance.payLoad.counterpartyId()]
            }, {
                operand: "program.programKey.programCode",
                operator: "EQUALS",
                value: [self.modelInstance.payLoad.programCode()]
            }, {
                operand: "invoiceStatus",
                operator: "IN",
                value: invoiceStatusArray
            }, {
                operand: "paymentStatus",
                operator: "IN",
                value: paymentStausArray
            });

            Model.invoiceSearchget(JSON.stringify(self.queryParameter())).then(function (data) {
                let counter = 0,
                    seqNumber = 0;

                self.invoiceList([]);

                if (data.invoices) {
                    for (counter = 0; counter < data.invoices.length; counter++) {
                        self.responseParameters = ko.observable(data.invoices[counter]);
                        self.responseParameters().selectBox = ko.observable([]);
                        self.responseParameters().seqNumber = seqNumber;
                        self.responseParameters().cannotAdd = false;
                        self.invoiceList.push(self.responseParameters());
                        seqNumber = seqNumber + 1;
                    }
                }

                self.maxPercent(self.invoiceList().length > 0 ? self.invoiceList()[0].maxFinancePercentage : 0);

                self.showInvoices(true);
            });

            self.modelInstance.navData.searchModified(false);
            self.modelInstance.navData.totalInvoicesSelected(0);
            self.modelInstance.navData.totalAmountSelected(0);
            self.modelInstance.navData.totalAmountSelectedInvCurrency(0);
            self.modelInstance.payLoad.totalAmount.amount(0);
            self.currencyCountMap([]);
            self.currencyConversionMap([]);
        } else {
            const totalAmount = self.modelInstance.payLoad.totalAmount.amount();

            if (self.invoiceList().length > 0) {
                self.modelInstance.navData.totalInvoicesSelected(0);
                self.modelInstance.navData.totalAmountSelected(0);
                self.modelInstance.navData.totalAmountSelectedInvCurrency(0);
                self.modelInstance.payLoad.totalAmount.amount(0);
                self.currencyCountMap([]);

                for (let i = 0; i < self.invoiceList().length; i++) {
                    if (self.invoiceList()[i].selectBox().length > 0) {
                        self.calculateAmount(null, self.invoiceList()[i]);
                    }
                }
            }

            self.modelInstance.payLoad.totalAmount.amount(totalAmount);

            self.showInvoices(true);
        }

        self.SelectAll50ValueChangeHook = function (newValue) {
            let i = 0;

            if (newValue[0] === "selectAll") {
                for (i = 0; i < self.invoiceList().length; i++) {
                    self.invoiceList()[i].selectBox(["selected"]);
                }
            } else {
                for (i = 0; i < self.invoiceList().length; i++) {
                    self.invoiceList()[i].selectBox([]);
                }
            }
        };

        self.returnStepOne = function () {
            params.rootModel.dataLoaded(false);
            params.rootModel.selectedComponent("request-finance-basic-details");

            ko.tasks.runEarly();
            params.rootModel.dataLoaded(true);
        };

        self.dataSource58 = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.invoiceList, {
            idAttribute: "invoiceId"
        }));

        const SelectAll50Subscriber = self.selectAll.subscribe(self.SelectAll50ValueChangeHook);

        self.dispose = function () {
            SelectAll50Subscriber.dispose();
        };
    };
});