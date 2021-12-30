define([
    "ojL10n!resources/nls/overdue-invoices-widget",
    "./model",
    "knockout",
    "ojs/ojcore",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojbutton",
    "ojs/ojtable",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource"
], function (resourceBundle, Model, ko, oj) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        self.invoicesgetVar = ko.observable();
        self.invoicesgetrole = ko.observable("S");

        self.accountType = ko.observable("receivables");
        self.invoiceList = ko.observableArray();
        self.overdueList = ko.observableArray();
        self.listLoaded = ko.observable(false);
        params.baseModel.registerComponent("view-invoice", "supply-chain-finance");
        self.receivablesList = [];
        self.payablesList = [];

        self.tableColumns = [{
            field: "invoiceNumber",
            headerText: self.nls.InvoiceNumber,
            headerClassName: "header-background",
            sortable: "disabled"
        },
        {
            field: "outstandingAmount",
            headerText: self.nls.AmountOverdue,
            headerClassName: "header-background",
            sortable: "disabled"
        },
        {
            field: "noOfDaysOverdue",
            headerText: self.nls.Noofdaysoverdue,
            headerClassName: "header-background",
            sortable: "disabled"
        }
        ];

        self.populateTableInput = function (list) {
            self.invoiceList().length = 0;

            list.forEach(function (data) {

                self.invoiceList().push(data);

            });

            let dateToCompare = "";

            self.invoiceList().forEach(function (invoice) {
                dateToCompare = new Date(invoice.invoiceDueDate);
                invoice.noOfDaysOverdue = parseInt((params.baseModel.getDate().getTime() - dateToCompare.getTime()) / (1000 * 60 * 60 * 24));
                invoice.headerClass = false;
            });

            self.invoiceList().sort(function (left, right) {
                return left.noOfDaysOverdue === right.noOfDaysOverdue ? 0 : left.noOfDaysOverdue > right.noOfDaysOverdue ? -1 : 1;
            });

            self.overdueList(self.invoiceList().slice(0, 5));

            if (params.baseModel.small()) {
                self.overdueList.unshift({
                    invoiceNumber: "abc123dft23",
                    headerClass: true
                });
            }

            self.listLoaded(true);
        };

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

        const query = {
            criteria: [
                {
                    operand: "program.role",
                    operator: "ENUM",
                    value: ["S"]
                },
                {
                    operand: "invoiceStatus",
                    operator: "IN",
                    value: invoiceStatusArray
                },
                {
                    operand: "paymentStatus",
                    operator: "IN",
                    value: paymentStausArray
                }
            ]
        },

            date = params.baseModel.getDate(),

            queryForBuyer = {
                criteria: [
                    {
                        operand: "program.role",
                        operator: "ENUM",
                        value: ["B"]
                    },
                    {
                        operand: "invoiceStatus",
                        operator: "IN",
                        value: invoiceStatusArray
                    },
                    {
                        operand: "paymentStatus",
                        operator: "IN",
                        value: paymentStausArray
                    }
                ]
            };

        self.toDate = oj.IntlConverterUtils.dateToLocalIso(date);

        Model.invoicesget(JSON.stringify(query), self.toDate).then(function (response) {
            self.receivablesList = response.invoices;

            Model.invoicesget(JSON.stringify(queryForBuyer), self.toDate).then(function (response) {
                self.payablesList = response.invoices;

                if (self.receivablesList.length === 0) {
                    self.accountType("payables");
                    self.populateTableInput(self.payablesList);
                } else {
                    self.populateTableInput(self.receivablesList);
                }
            });

        });

        self.dataSource26 = new oj.ArrayTableDataSource(self.overdueList, { idAttribute: "invoiceNumber" });

        self.dataSource16 = new oj.ArrayTableDataSource(self.overdueList, {
            idAttribute: "invoiceNumber"
        });

        function switchButtonset56ValueChangeHook() {
            self.listLoaded(false);
            ko.tasks.runEarly();

            if (self.accountType() === "receivables") {
                self.invoicesgetrole("S");
                self.populateTableInput(self.receivablesList);
                self.listLoaded(true);
            } else {
                self.invoicesgetrole("B");
                self.populateTableInput(self.payablesList);
                self.listLoaded(true);
            }

        }

        const switchButtonset56Subscriber = self.accountType.subscribe(switchButtonset56ValueChangeHook);

        self.onClickViewAllInvoices84 = function () {
            params.dashboard.loadComponent("view-invoice", {
                role: self.accountType() === "receivables" ? "S" : "B",
                fromOverdue: true
            });
        };

        self.dispose = function () {
            switchButtonset56Subscriber.dispose();
        };
    };
});
