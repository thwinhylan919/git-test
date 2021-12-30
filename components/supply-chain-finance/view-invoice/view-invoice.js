define([
    "ojL10n!resources/nls/view-invoice",
    "./model",
    "knockout",
    "ojs/ojcore",
    "ojs/ojformlayout",
    "ojs/ojpagingdataproviderview",
    "ojs/ojarraydataprovider",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojswitch",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker",
    "ojs/ojbutton",
    "ojs/ojlabel"
], function (resourceBundle, Model, ko, oj) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);
        self.invoiceSearchgetinvoiceStatus = ko.observable();
        self.invoiceSearchgetinvoiceAmountFrom = ko.observable("");
        self.invoiceSearchgetinvoiceAmountTo = ko.observable("");
        self.invoiceSearchgetpaymentStatus = ko.observable();
        self.invoiceSearchgetprogramCode = ko.observable();
        self.programsgetVar = ko.observable();
        self.programsgetprogramName = ko.observable();
        self.programsgetprogramCode = ko.observable();
        self.programsgetrole = ko.observable();
        self.mepartygetVar = ko.observable();
        self.invoiceStatusgetVar = ko.observableArray();
        self.paymentStatusgetVar = ko.observableArray();
        self.counterPartiesgetprogramCode = ko.observable();
        params.baseModel.registerElement("amount-input");
        self.invoiceRefNo = ko.observable();
        self.dataSource14 = ko.observable();

        if (params.rootModel.params.role === undefined) {
            self.role = ko.observable("B");

        } else {
            self.role = ko.observable(params.rootModel.params.role);
        }

        self.columnsArray = ko.observableArray([{
                headerText: self.nls.InvoiceList.CounterpartyName,
                field: "supplierName"
            },
            {
                headerText: self.nls.InvoiceList.ProgramName,
                field: "programName"
            },
            {
                headerText: self.nls.InvoiceList.InvoiceNo,
                field: "invoiceNumber"
            },
            {
                headerText: self.nls.InvoiceList.InvoiceAmount,
                headerClassName: "right",
                sortable: false
            },
            {
                headerText: self.nls.InvoiceList.DueDate,
                field: "invoiceDueDate"
            },
            {
                headerText: self.nls.InvoiceList.InvoiceStatus,
                field: "invoiceStatusDescription"
            },
            {
                headerText: self.nls.InvoiceList.AmountPayble,
                headerClassName: "right",
                sortable: false
            },
            {
                headerText: self.nls.InvoiceList.PaymentStatus,
                field: "paymentStatusDescription"
            }
        ]);

        self.invoiceStatusValue = ko.observable();
        self.invoiceStatus = ko.observableArray();
        self.showMoreOptionsClicked = ko.observable(false);
        self.showInvoicestatus = ko.observable(false);
        self.fromDate = ko.observable();
        self.toDate = ko.observable();
        self.fromAmount = ko.observable();
        self.toAmount = ko.observable();
        self.currency = ko.observable("");
        self.counterpartiesLoaded = ko.observable(false);
        self.programTypesLoaded = ko.observable(true);
        self.invoiceListData = ko.observableArray();
        self.showMoreOptions = ko.observable();
        self.paymentStatus = ko.observableArray();
        self.partyName = ko.observable();
        self.partyId = ko.observable();
        self.paymentStatusValue = ko.observable();
        self.lessSearchOptions = ko.observable();
        self.lessSearchOptionsClicked = ko.observable(false);
        self.programNameList = ko.observableArray();
        self.counterPartyList = ko.observableArray();
        self.invoiceDataLoaded = ko.observable(false);
        self.invoiceStatusLoaded = ko.observable(false);
        self.paymentStatusLoaded = ko.observable(false);

        if (params.rootModel.params.fromTimeline) {
            self.currency(params.rootModel.params.currency);
            self.fromDate(params.rootModel.params.fromDate);
            self.toDate(params.rootModel.params.toDate);
            self.role(params.rootModel.params.role);
        }

        if (self.role() === "S") {
            self.columnsArray()[6].headerText = self.nls.InvoiceList.AmountReceivable;
            self.columnsArray()[0].field = "buyerName";
        }

        self.queryParameter = ko.observable({
            criteria: []
        });

        if (params.rootModel.previousState) {
            self.role(params.rootModel.previousState.role);
            self.invoiceRefNo(params.rootModel.previousState.invoiceRefNo);
            self.invoiceSearchgetpaymentStatus(params.rootModel.previousState.invoiceSearchgetpaymentStatus);
            self.counterPartiesgetprogramCode(params.rootModel.previousState.counterPartiesgetprogramCode);
            self.invoiceSearchgetinvoiceStatus(params.rootModel.previousState.invoiceSearchgetinvoiceStatus);
            self.fromDate(params.rootModel.previousState.fromDate);
            self.toDate(params.rootModel.previousState.toDate);
            self.programsgetprogramName(params.rootModel.previousState.programsgetprogramName);
            self.programsgetprogramCode(params.rootModel.previousState.programsgetprogramCode);
            self.invoiceSearchgetprogramCode(params.rootModel.previousState.invoiceSearchgetprogramCode);
            self.currency(params.rootModel.previousState.currency);
            self.invoiceSearchgetinvoiceAmountFrom(params.rootModel.previousState.invoiceSearchgetinvoiceAmountFrom);
            self.invoiceSearchgetinvoiceAmountTo(params.rootModel.previousState.invoiceSearchgetinvoiceAmountTo);
            self.queryParameter(params.rootModel.previousState.queryParameter);
            self.lessSearchOptionsClicked(false);
            self.showMoreOptionsClicked(true);
        }

        self.getInvoiceData = function() {
            Model.invoiceSearchget(JSON.stringify(self.queryParameter()), self.currency(), self.invoiceSearchgetinvoiceAmountFrom(), self.invoiceSearchgetinvoiceAmountTo(), self.fromDate(), self.toDate()).then(function (response) {
                self.invoiceDataLoaded(false);
                self.invoiceListData([]);

                let paymentStatusFound = false,invoiceStatusFound = false;

                for (let i = 0; i < response.invoices.length; i++) {
                    for (let j = 0; j < self.paymentStatusgetVar().length; j++) {
                        if (response.invoices[i].paymentStatus === self.paymentStatusgetVar()[j].code) {
                            response.invoices[i].paymentStatusDescription = self.paymentStatusgetVar()[j].description;
                            paymentStatusFound = true;
                            break;
                        }
                    }

                    if (!paymentStatusFound) {
                        response.invoices[i].paymentStatus = "OTHERS";
                        response.invoices[i].paymentStatusDescription = self.nls.InvoiceList.statusOthers;
                    }

                    paymentStatusFound = false;

                    for (let j = 0; j < self.invoiceStatusgetVar().length; j++) {
                        if (response.invoices[i].invoiceStatus === self.invoiceStatusgetVar()[j].code) {
                            response.invoices[i].invoiceStatusDescription = self.invoiceStatusgetVar()[j].description;
                            invoiceStatusFound = true;
                            break;
                        }
                    }

                    if (!invoiceStatusFound) {
                        response.invoices[i].invoiceStatus = "OTHERS";
                        response.invoices[i].invoiceStatusDescription = self.nls.InvoiceList.statusOthers;
                    }

                    invoiceStatusFound = false;

                    response.invoices[i].programName = response.invoices[i].program.programName;
                    response.invoices[i].buyerName = response.invoices[i].associatedParty.name;

                    self.invoiceListData().push(response.invoices[i]);
                }

                self.dataSource14(new oj.PagingDataProviderView(new oj.ArrayDataProvider(self.invoiceListData(), {
                    idAttribute: "invoiceId"
                })));

                self.invoiceDataLoaded(true);
            });
        };

        self.setProgramQueryParametersForInvoice = function () {
            self.queryParameter().criteria = [];

            if (self.invoiceSearchgetprogramCode() !== undefined && self.invoiceSearchgetprogramCode() !== "") {
                self.queryParameter().criteria.push({
                    operand: "program.programKey.programCode",
                    operator: "EQUALS",
                    value: [self.invoiceSearchgetprogramCode()]
                });
            }

            if (params.rootModel.params.showOutstanding) {
                self.queryParameter().criteria.push({
                    operand: "invoiceStatus",
                    operator: "IN",
                    value: params.rootModel.params.invoiceStatusArray
                });

                self.queryParameter().criteria.push({
                    operand: "paymentStatus",
                    operator: "IN",
                    value: params.rootModel.params.paymentStausArray
                });
            } else {
                if (self.invoiceSearchgetinvoiceStatus() !== undefined && self.invoiceSearchgetinvoiceStatus() !== "") {
                    self.queryParameter().criteria.push({
                        operand: "invoiceStatus",
                        operator: "IN",
                        value: [self.invoiceSearchgetinvoiceStatus()]
                    });
                }

                if (self.invoiceSearchgetpaymentStatus() !== undefined && self.invoiceSearchgetpaymentStatus() !== "") {
                    self.queryParameter().criteria.push({
                        operand: "paymentStatus",
                        operator: "IN",
                        value: [self.invoiceSearchgetpaymentStatus()]
                    });
                }
            }

            if (self.role() !== undefined && self.role() !== "") {
                self.queryParameter().criteria.push({
                    operand: "program.role",
                    operator: "ENUM",
                    value: [self.role()]
                });
            } else {
                self.queryParameter().criteria.push({
                    operand: "program.role",
                    operator: "ENUM",
                    value: ["B"]
                });
            }

            if (self.counterPartiesgetprogramCode() !== undefined && self.counterPartiesgetprogramCode() !== "") {
                self.queryParameter().criteria.push({
                    operand: "associatedParty.associatedPartyKey.id",
                    operator: "EQUALS",
                    value: [self.counterPartiesgetprogramCode()]
                });
            }

            if (self.invoiceRefNo() !== undefined && self.invoiceRefNo() !== "") {
                self.queryParameter().criteria.push({
                    operand: "invoiceNumber",
                    operator: "CONTAINS",
                    value: [self.invoiceRefNo()]
                });
            }
        };

        self.refresh = ko.observable(true);
        self.noData = "-";

        params.baseModel.registerComponent("view-invoice-details", "supply-chain-finance");

        function Role25ValueChangeHook(newValue) {
            if (newValue === "B") {
                self.programsgetrole("B");

                self.columnsArray()[6].headerText = self.nls.InvoiceList.AmountPayble;
                self.columnsArray()[0].field = "supplierName";
            } else {
                self.programsgetrole("S");

                self.columnsArray()[6].headerText = self.nls.InvoiceList.AmountReceivable;
                self.columnsArray()[0].field = "buyerName";
            }

            self.clearResults();

            self.setProgramQueryParametersForInvoice();

            self.getInvoiceData();
        }

        function onSelectCounterparty(newValue) {

            if (newValue !== "") {

                self.queryParameter().criteria = [];

                self.queryParameter().criteria.push({

                    operand: "associatedPartyList.associatedPartyKey.id",
                    operator: "EQUALS",
                    value: [newValue]
                });

                self.queryParameter().criteria.push({
                    operand: "role",
                    operator: "ENUM",
                    value: [self.programsgetrole()]
                });

                Model.programsget(JSON.stringify(self.queryParameter())).then(function (response) {
                    self.programNameList().splice(0, self.programNameList().length);

                    self.programTypesLoaded(false);
                    self.programsgetVar(response);

                    if (self.programsgetVar().programs[0]) {
                        for (let i = 0; i < self.programsgetVar().programs.length; i++) {
                            self.programNameList.push({
                                code: self.programsgetVar().programs[i].programCode,
                                label: self.programsgetVar().programs[i].programName
                            });
                        }
                    }

                    ko.tasks.runEarly();
                    self.programTypesLoaded(true);
                });
            }
        }

        const counterpartySubscriber = self.counterPartiesgetprogramCode.subscribe(onSelectCounterparty);

        if (self.role() === "B") {
            self.programsgetrole("B");
        } else if (self.role() === "S") {
            self.programsgetrole("S");
        }

        if (params.rootModel.params.spokeId && params.rootModel.params.spokeId !== "") {
            self.counterPartiesgetprogramCode(params.rootModel.params.spokeId);
        }

        if (params.rootModel.params.programCode && params.rootModel.params.programCode !== "") {
            self.invoiceSearchgetprogramCode(params.rootModel.params.programCode);
        }

        if (params.rootModel.params.currency && params.rootModel.params.currency !== "") {
            self.currency(params.rootModel.params.currency);
        }

        self.clearResults = function () {
            self.refresh(false);
            self.invoiceRefNo("");
            self.invoiceSearchgetpaymentStatus("");
            self.counterPartiesgetprogramCode("");
            self.invoiceSearchgetinvoiceStatus("");
            self.fromDate("");
            self.toDate("");
            self.programsgetprogramName("");
            self.programsgetprogramCode("");
            self.invoiceSearchgetprogramCode("");
            self.currency("");
            self.invoiceSearchgetinvoiceAmountFrom("");
            self.programNameList([]);
            self.invoiceSearchgetinvoiceAmountTo("");
            ko.tasks.runEarly();
            self.refresh(true);
        };

        const qQuery = {
            criteria: [{
                operand: "relation",
                operator: "ENUM",
                value: ["BOTH"]
            }]
        };

        Model.counterPartiesget(JSON.stringify(qQuery)).then(function (response) {
            self.counterPartyList().splice(0, self.counterPartyList().length);

            self.counterpartiesLoaded(false);

            for (let i = 0; i < response.associatedParties.length; i++) {
                self.counterPartyList.push({
                    code: response.associatedParties[i].id.value,
                    label: response.associatedParties[i].name
                });

            }

            ko.tasks.runEarly();

            if (params.rootModel.params.spokeId && params.rootModel.params.spokeId !== "") {
                self.counterPartiesgetprogramCode(params.rootModel.params.spokeId);
            }

            if (self.counterPartiesgetprogramCode() && self.counterPartiesgetprogramCode() !== null && self.counterPartiesgetprogramCode() !== "") {
                onSelectCounterparty(self.counterPartiesgetprogramCode());
            }

            self.counterpartiesLoaded(true);
        });

        Model.mepartyget().then(function (response) {
            self.mepartygetVar(response);
            self.partyId(self.mepartygetVar().party.id.displayValue);
            self.partyName(self.mepartygetVar().party.personalDetails.fullName);
        });

        Model.paymentStatusget().then(function (response) {
            self.paymentStatusLoaded(false);

            for (let i = 0; i < response.enumRepresentations[0].data.length; i++) {
                if (response.enumRepresentations[0].data[i].code !== "OTHERS") {
                    self.paymentStatusgetVar().push({
                        description: response.enumRepresentations[0].data[i].description,
                        code: response.enumRepresentations[0].data[i].code
                    });
                }
            }

            ko.tasks.runEarly();
            self.paymentStatusLoaded(true);

        });

        Model.invoiceStatusget().then(function (response) {
            self.invoiceStatusLoaded(false);

            for (let i = 0; i < response.enumRepresentations[0].data.length; i++) {
                if (response.enumRepresentations[0].data[i].code !== "OTHERS") {

                    self.invoiceStatusgetVar().push({
                        description: response.enumRepresentations[0].data[i].description,
                        code: response.enumRepresentations[0].data[i].code
                    });
                }
            }

            ko.tasks.runEarly();
            self.invoiceStatusLoaded(true);
        });

        self.setProgramQueryParametersForInvoice();

        if (params.rootModel.params.fromTimeline) {
            self.queryParameter(params.rootModel.params.queryParams);
        }

        self.getInvoiceData();

        self.currencyParser = function (data) {
            const output = {};

            output.currencies = [];

            output.currencies.push({
                code: "",
                description: ""
            });

            for (let i = 0; i < data.currencyList.length; i++) {
                output.currencies.push({
                    code: data.currencyList[i].code,
                    description: data.currencyList[i].code
                });
            }

            return output;
        };

        self.download = function () {
            if (self.invoiceListData()) {
                Model.fetchPdfget(JSON.stringify(self.queryParameter()), self.currency(), self.invoiceSearchgetinvoiceAmountFrom(), self.invoiceSearchgetinvoiceAmountTo(), self.fromDate(), self.toDate());
            }
        };

        const Role25Subscriber = self.role.subscribe(Role25ValueChangeHook);

        self.onClickMoreSearchOptions64 = function () {
            self.lessSearchOptionsClicked(false);
            self.showMoreOptionsClicked(true);
        };

        self.onClickLessSearchOptions4 = function () {
            self.lessSearchOptionsClicked(true);
            self.showMoreOptionsClicked(false);
        };

        self.onClickInvoiceNo62 = function (data) {
            params.dashboard.loadComponent("view-invoice-details", {
                invoiceNo: data.invoiceId,
                role: self.role(),
                paymentStatusDescription: data.paymentStatusDescription,
                invoiceStatusDescription: data.invoiceStatusDescription,
                productCode: data.program.programProduct.productCode,
                invoiceRefNo: self.invoiceRefNo(),
                invoiceSearchgetpaymentStatus: self.invoiceSearchgetpaymentStatus(),
                counterPartiesgetprogramCode: self.counterPartiesgetprogramCode(),
                invoiceSearchgetinvoiceStatus: self.invoiceSearchgetinvoiceStatus(),
                fromDate: self.fromDate(),
                toDate: self.toDate(),
                programsgetprogramName: self.programsgetprogramName(),
                programsgetprogramCode: self.programsgetprogramCode(),
                invoiceSearchgetprogramCode: self.invoiceSearchgetprogramCode(),
                currency: self.currency(),
                invoiceSearchgetinvoiceAmountFrom: self.invoiceSearchgetinvoiceAmountFrom(),
                invoiceSearchgetinvoiceAmountTo: self.invoiceSearchgetinvoiceAmountTo(),
                queryParameter: self.queryParameter()
            });
        };

        self.dispose = function () {
            Role25Subscriber.dispose();
            counterpartySubscriber.dispose();
        };

        self.onClickSearch30 = function () {

            self.setProgramQueryParametersForInvoice();

            self.getInvoiceData();
        };

        self.createInvoiceRedirect = function () {
            params.baseModel.registerComponent("invoice-creation-home", "supply-chain-finance");
            params.dashboard.loadComponent("invoice-creation-home");
        };
    };
});