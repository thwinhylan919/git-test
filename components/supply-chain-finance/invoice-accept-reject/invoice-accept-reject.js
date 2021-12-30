define([
    "ojL10n!resources/nls/invoice-accept-reject",
    "knockout",
    "./model",
    "ojs/ojcore",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojcheckboxset",
    "ojs/ojbutton"
], function (resourceBundle, ko, Model, oj) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);
        self.role = ko.observable("B");
        self.selectAll = ko.observable([]);
        self.mepartygetVar = ko.observable();
        self.partyName = ko.observable();
        self.partyId = ko.observable();
        self.showInvoices = ko.observable(false);
        self.batchList = ko.observableArray();
        self.invoiceList = ko.observableArray();
        self.selectedInvoices = ko.observableArray();
        self.acceptReject = ko.observable();

        self.queryParameter = ko.observable({
            criteria: []
        });

        const getNewKoModel = function () {
            const KoModel = Model.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.modelInstance = params.rootModel.previousState ? params.rootModel.previousState.data : getNewKoModel();

        params.baseModel.registerElement("search-box");
        params.baseModel.registerComponent("invoice-approval-review", "supply-chain-finance");
        params.baseModel.registerComponent("preview-invoice-details", "supply-chain-finance");

        Model.mepartyget().then(function (response) {
            self.mepartygetVar(response);
            self.partyId(response.party.id.displayValue);
            self.partyName(response.party.personalDetails.fullName);

        });

        self.columnsArray = [{
                headerRenderer: oj.KnockoutTemplateUtils.getRenderer("checkbox_hdr_tmpl", true),
                field: "selectBox"
            },
            {
                headerText: self.nls.InvoiceList.CounterPartyName,
                field: "supplierName"
            },
            {
                headerText: self.nls.InvoiceList.ProgramName,
                field: "program.programName"
            },
            {
                headerText: self.nls.InvoiceList.InvoiceNumber,
                field: "invoiceNumber"
            },
            {
                headerText: self.nls.InvoiceList.InvoiceAmount,
                field: "totalAmount"
            },
            {
                headerText: self.nls.InvoiceList.DueDate,
                field: "invoiceDueDate"
            },
            {
                headerText: self.nls.InvoiceList.Status,
                field: "invoiceStatus"
            },
            {
                headerText: self.nls.InvoiceList.Remarks,
                field: "remarks"
            }
        ];

        self.acceptComments = function (event, data) {
            if (event.target.value.length === 0) {
                data.disabled(true);
            } else {
                data.disabled(false);
            }

        };

        self.onClickInvoiceNumber13 = function (data) {
            params.dashboard.openRightPanel("preview-invoice-details", {
                invoiceNo: data.invoiceNumber,
                role: self.role(),
                invoiceDetails: data,
                programName: data.program.programName,
                partyDetails: self.mepartygetVar()
            }, self.nls.overlayTitle);
        };

        self.approveRejectBatchCall = function () {
            const batchPayLoad = {
                batchDetailRequestList: []
            };

            batchPayLoad.batchDetailRequestList = self.batchList();

            return new Promise(function (resolve, reject) {
                Model.batchpost(batchPayLoad).then(function (data) {
                    resolve(data);
                }).catch(function (err) {
                    reject(err);
                });
            });
        };

        self.onApprove = function () {
            let i = 0,
                contentCount = 0,
                remarks = null;

            self.acceptReject("A");

            for (i = 0; i < self.invoiceList().length; i++) {

                if (self.invoiceList()[i].selectBox()[0] === "selected") {

                    self.modelInstance.invoice.invoiceNumber(self.invoiceList()[i].invoiceNumber);
                    self.modelInstance.invoice.acceptanceAmount.amount(self.invoiceList()[i].totalAmount.amount);
                    self.modelInstance.invoice.acceptanceAmount.currency(self.invoiceList()[i].totalAmount.currency);
                    remarks = self.invoiceList()[i].remarks() !== null && self.invoiceList()[i].remarks() !== "" ? self.invoiceList()[i].remarks() : "-";
                    self.modelInstance.invoice.remarks(remarks);
                    self.modelInstance.invoice.supplierName(self.invoiceList()[i].supplierName);
                    self.modelInstance.invoice.program.programName(self.invoiceList()[i].program.programName);
                    self.modelInstance.invoice.program.role("B");
                    self.modelInstance.invoice.invoiceDueDate(self.invoiceList()[i].invoiceDueDate);
                    self.modelInstance.invoice.totalAmount.amount(self.invoiceList()[i].totalAmount.amount);
                    self.modelInstance.invoice.totalAmount.currency(self.invoiceList()[i].totalAmount.currency);
                    self.selectedInvoices.push(self.invoiceList()[i]);

                    self.batchList.push({
                        methodType: "PUT",
                        uri: {
                            value: "/supplyChainFinance/invoices/{invoiceId}/accept",
                            params: {
                                invoiceId: self.invoiceList()[i].invoiceId
                            }
                        },
                        headers: {
                            "Content-Id": contentCount,
                            "Content-Type": "application/json",
                            X_APP_VERSION: "v1"
                        },
                        payload: ko.toJSON(ko.mapping.toJS(self.modelInstance))
                    });

                    contentCount = contentCount + 1;
                }
            }

            params.dashboard.loadComponent("invoice-approval-review", self);
        };

        self.onReject = function () {
            let i = 0;

            self.acceptReject("R");

            const tracker = document.getElementById("tracker");

            if (!params.baseModel.showComponentValidationErrors(tracker)) {
                return;
            }

            let contentCount = 0,
                remarks = null;

            for (i = 0; i < self.invoiceList().length; i++) {
                if (self.invoiceList()[i].selectBox()[0] === "selected") {

                    self.modelInstance.invoice.invoiceNumber(self.invoiceList()[i].invoiceNumber);
                    remarks = self.invoiceList()[i].remarks() !== null && self.invoiceList()[i].remarks() !== "" ? self.invoiceList()[i].remarks() : "-";
                    self.modelInstance.invoice.remarks(remarks);
                    self.modelInstance.invoice.supplierName(self.invoiceList()[i].supplierName);
                    self.modelInstance.invoice.program.programName(self.invoiceList()[i].program.programName);
                    self.modelInstance.invoice.program.role("B");
                    self.modelInstance.invoice.invoiceDueDate(self.invoiceList()[i].invoiceDueDate);
                    self.modelInstance.invoice.totalAmount.amount(self.invoiceList()[i].totalAmount.amount);
                    self.modelInstance.invoice.totalAmount.currency(self.invoiceList()[i].totalAmount.currency);
                    self.selectedInvoices.push(self.invoiceList()[i]);

                    self.batchList.push({
                        methodType: "PUT",
                        uri: {
                            value: "/supplyChainFinance/invoices/{invoiceId}/reject",
                            params: {
                                invoiceId: self.invoiceList()[i].invoiceId
                            }
                        },
                        headers: {
                            "Content-Id": contentCount,
                            "Content-Type": "application/json",
                            X_APP_VERSION: "v1"
                        },
                        payload: ko.toJSON(ko.mapping.toJS(self.modelInstance))
                    });

                    contentCount = contentCount + 1;
                }
            }

            params.dashboard.loadComponent("invoice-approval-review", self);
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

        self.queryParameter().criteria.push({
            operand: "program.role",
            operator: "ENUM",
            value: [self.role()]
        }, {
            operand: "invoiceStatus",
            operator: "IN",
            value: invoiceStatusArray
        }, {
            operand: "paymentStatus",
            operator: "IN",
            value: paymentStausArray
        });

        if (params.rootModel.params.invoiceList) {
            self.invoiceList = params.rootModel.params.invoiceList;
            self.showInvoices(true);
        } else {
            Model.invoiceSearchget(JSON.stringify(self.queryParameter())).then(function (data) {
                let counter = 0;

                self.showInvoices(false);

                for (counter = 0; counter < data.invoices.length; counter++) {
                    self.responseParameters = ko.observable(data.invoices[counter]);
                    self.responseParameters().selectBox = ko.observable([]);
                    self.responseParameters().invoiceStatus = jsonDataInvoiceStatus[data.invoices[counter].invoiceStatus];
                    self.responseParameters().remarks = ko.observable(data.invoices[counter].remarks);
                    self.responseParameters().disabled = ko.observable(true);
                    self.invoiceList().push(self.responseParameters());
                }

                self.showInvoices(true);

            });
        }

        self.dataSource58 = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.invoiceList, {
            idAttribute: "invoiceId"
        }));

        function SelectAll50ValueChangeHook(newValue) {
            let i = 0;

            if (newValue[0] === "selectAll") {
                for (i = 0; i < self.invoiceList().length; i++) {
                    self.invoiceList()[i].selectBox(["selected"]);
                    self.invoiceList()[i].disabled(false);
                }
            } else {
                for (i = 0; i < self.invoiceList().length; i++) {
                    self.invoiceList()[i].selectBox([]);
                    self.invoiceList()[i].disabled(true);
                }
            }
        }

        const SelectAll50Subscriber = self.selectAll.subscribe(SelectAll50ValueChangeHook);

        self.onClickAccept29 = function () {
            if (self.invoiceList().length === 0) {
                params.baseModel.showMessages(null, [self.nls.noInvoicesError], "ERROR");
            } else {
                let index = 0;

                for (let i = 0; i < self.invoiceList().length; i++) {
                    if (self.invoiceList()[i].selectBox().length > 0) {
                        index = i + 1;
                        break;
                    }
                }

                if (index > 0) {
                    self.onApprove();
                } else {
                    params.baseModel.showMessages(null, [self.nls.noInvoicesSelectedError], "ERROR");
                }
            }
        };

        self.onClickReject51 = function () {
            if (self.invoiceList().length === 0) {
                params.baseModel.showMessages(null, [self.nls.noInvoicesError], "ERROR");
            } else {
                let index = 0;

                for (let i = 0; i < self.invoiceList().length; i++) {
                    if (self.invoiceList()[i].selectBox().length > 0) {
                        index = i + 1;
                        break;
                    }
                }

                if (index > 0) {
                    self.onReject();
                } else {
                    params.baseModel.showMessages(null, [self.nls.noInvoicesSelectedError], "ERROR");
                }
            }
        };

        self.dispose = function () {
            SelectAll50Subscriber.dispose();
        };
    };
});