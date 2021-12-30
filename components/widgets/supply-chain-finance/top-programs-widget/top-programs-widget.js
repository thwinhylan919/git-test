define([
    "ojL10n!resources/nls/top-programs-widget",
    "./model",
    "knockout",
    "ojs/ojcore",
    "ojs/ojvalidation-number",
    "ojs/ojcore",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojbutton",
    "ojs/ojchart"
], function (resourceBundle, Model, ko, oj) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        self.buttonRole = ko.observable();
        self.buyerOtherDetailsgetVar = ko.observable();
        self.sellerOtherDetailsgetVar = ko.observable();
        params.baseModel.registerComponent("view-program-search", "supply-chain-finance");
        self.showGraph = ko.observable(false);
        self.isSeller = ko.observable(false);
        self.buyerTopPrograms = ko.observableArray();
        self.supplierTopPrograms = ko.observableArray();
        self.topPrograms = ko.observableArray();
        self.innerRadius = ko.observable(0.9);
        self.centerLabel = ko.observable();
        self.dataLabelPositionValue = ko.observable("outsideSlice");
        self.legendRendered = ko.observable("on");
        self.legendPosition = ko.observable("bottom");
        self.legendScrolling = ko.observable("off");
        self.donutColors = ko.observableArray(["#13B6CF", "#EF0073", "#3E913E", "#FF7D0E", "#FECA00"]);
        self.numberformatter = ko.observable();
        self.totalCount = ko.observable();

        self.queryParameterSupplier = ko.observable({
            criteria: []
        });

        self.queryParameterBuyer = ko.observable({
            criteria: []
        });

        self.sortByParameter = ko.observableArray();
        self.count = ko.observable();
        self.grouping = ko.observable("Program");
        self.localCurrency = ko.observable();

        const converterFactory = oj.Validation.converterFactory("number");

        let currencyConverter;

        self.labelStyle = ko.observable({
            color: "#2c3251",
            position: "absolute",
            textAlign: "center",
            paddingTop: "15%"
        });

        self.topProgramGroup = ko.observableArray();
        self.buyerTotalBusiness = ko.observable();
        self.supplierTotalBusiness = ko.observable();

        self.showGraph(false);
        self.isSeller(false);

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

        self.queryParameterSupplier().criteria.push({
            operand: "program.role",
            operator: "ENUM",
            value: ["S"]
        }, {
            operand: "invoiceStatus",
            operator: "IN",
            value: invoiceStatusArray
        }, {
            operand: "paymentStatus",
            operator: "IN",
            value: paymentStausArray
        });

        self.queryParameterBuyer().criteria.push({
            operand: "program.role",
            operator: "ENUM",
            value: ["B"]
        }, {
            operand: "invoiceStatus",
            operator: "IN",
            value: invoiceStatusArray
        }, {
            operand: "paymentStatus",
            operator: "IN",
            value: paymentStausArray
        });

        self.sortByParameter().push({
            sortBy: "amount",
            sortOrder: "DESC"
        });

        self.count(5);

        let i, j, totalBusiness, programName;

        Promise.all([
            Model.invoiceget(self.grouping(), JSON.stringify(self.queryParameterSupplier()), JSON.stringify(self.sortByParameter()), self.count()),
            Model.invoiceget(self.grouping(), JSON.stringify(self.queryParameterBuyer()), JSON.stringify(self.sortByParameter()), self.count())
        ]).then(function (response) {

            if (response[0] && response[0].aggregatedData) {

                self.sellerOtherDetailsgetVar(response[0].aggregatedData);

                if (self.sellerOtherDetailsgetVar().resource && self.sellerOtherDetailsgetVar().groups && self.sellerOtherDetailsgetVar().groups.length > 0) {

                    totalBusiness = 0;

                    for (i = 0; i < self.sellerOtherDetailsgetVar().groups.length; i++) {

                        if (self.sellerOtherDetailsgetVar().groups[i] && self.sellerOtherDetailsgetVar().groups[i].intervals) {
                            programName = self.sellerOtherDetailsgetVar().groups[i].id.split("~");

                            for (j = 0; j < self.sellerOtherDetailsgetVar().groups[i].intervals.length; j++) {
                                totalBusiness = totalBusiness + self.sellerOtherDetailsgetVar().groups[i].intervals[j].amount.amount;
                                self.localCurrency(self.sellerOtherDetailsgetVar().groups[i].intervals[j].amount.currency);

                                self.supplierTopPrograms.push({
                                    name: programName[1],
                                    items: [{
                                        value: self.sellerOtherDetailsgetVar().groups[i].intervals[j].amount.amount,
                                        label: self.sellerOtherDetailsgetVar().groups[i].intervals[j].amount.amount
                                    }]
                                });
                            }
                        }
                    }

                    self.supplierTotalBusiness(params.baseModel.formatCurrency(totalBusiness, self.localCurrency()));

                    currencyConverter = converterFactory.createConverter({
                        style: "currency",
                        currency: self.localCurrency()
                    });

                    self.numberformatter(currencyConverter);

                    self.centerLabel(params.baseModel.format(self.nls.TopPrograms.TotalReceivables, {
                        amount: self.supplierTotalBusiness()
                    }));

                    self.buttonRole("S");
                    self.topPrograms([]);
                    self.topPrograms(self.supplierTopPrograms());
                    self.isSeller(true);
                }

            }

            if (response[1] && response[1].aggregatedData) {
                self.buyerOtherDetailsgetVar(response[1].aggregatedData);

                if (self.buyerOtherDetailsgetVar().resource && self.buyerOtherDetailsgetVar().groups && self.buyerOtherDetailsgetVar().groups.length > 0) {

                    totalBusiness = 0;

                    for (i = 0; i < self.buyerOtherDetailsgetVar().groups.length; i++) {

                        if (self.buyerOtherDetailsgetVar().groups[i] && self.buyerOtherDetailsgetVar().groups[i].intervals) {
                            programName = self.buyerOtherDetailsgetVar().groups[i].id.split("~");

                            for (j = 0; j < self.buyerOtherDetailsgetVar().groups[i].intervals.length; j++) {
                                totalBusiness = totalBusiness + self.buyerOtherDetailsgetVar().groups[i].intervals[j].amount.amount;
                                self.localCurrency(self.buyerOtherDetailsgetVar().groups[i].intervals[j].amount.currency);

                                self.buyerTopPrograms.push({
                                    name: programName[1],
                                    items: [{
                                        value: self.buyerOtherDetailsgetVar().groups[i].intervals[j].amount.amount,
                                        label: self.buyerOtherDetailsgetVar().groups[i].intervals[j].amount.amount
                                    }]
                                });
                            }
                        }
                    }

                    self.buyerTotalBusiness(params.baseModel.formatCurrency(totalBusiness, self.localCurrency()));

                    currencyConverter = converterFactory.createConverter({
                        style: "currency",
                        currency: self.localCurrency()
                    });

                    self.numberformatter(currencyConverter);

                    if (!self.isSeller()) {
                        self.centerLabel(params.baseModel.format(self.nls.TopPrograms.TotalPayables, {
                            amount: self.buyerTotalBusiness()
                        }));

                        self.buttonRole("B");
                        self.topPrograms([]);
                        self.topPrograms(self.buyerTopPrograms());
                    }
                }
            }

            if (self.buttonRole() !== "B" && self.buttonRole() !== "S") {
                self.buttonRole("B");
            }

            self.totalCount(self.topPrograms().length);

            self.showGraph(true);

            self.topProgramGroup.push("Programs");
        });

        self.onClickViewAllPrograms84 = function () {
            params.dashboard.loadComponent("view-program-search", {
                role: self.buttonRole()
            });
        };

        self.roleChanger = function (event) {
            self.showGraph(false);
            self.topPrograms([]);

            if (event.detail.value === "S") {
                self.topPrograms(self.supplierTopPrograms());

                self.centerLabel(params.baseModel.format(self.nls.TopPrograms.TotalReceivables, {
                    amount: self.supplierTotalBusiness()
                }));

                if (self.supplierTopPrograms().length > 0) {
                    currencyConverter = converterFactory.createConverter({
                        style: "currency",
                        currency: self.localCurrency()
                    });

                    self.numberformatter(currencyConverter);
                }
            } else {
                self.topPrograms(self.buyerTopPrograms());

                self.centerLabel(params.baseModel.format(self.nls.TopPrograms.TotalPayables, {
                    amount: self.buyerTotalBusiness()
                }));

                if (self.buyerTopPrograms().length > 0) {
                    currencyConverter = converterFactory.createConverter({
                        style: "currency",
                        currency: self.localCurrency()
                    });

                    self.numberformatter(currencyConverter);
                }
            }

            self.totalCount(self.topPrograms().length);

            self.showGraph(true);
        };
    };
});