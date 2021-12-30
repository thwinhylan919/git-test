define([
    "ojL10n!resources/nls/invoice-update-status",
    "knockout",
    "ojs/ojcore",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojbutton"
], function(resourceBundle, ko, oj) {
    "use strict";

    return function(params) {
        const self = this;

        ko.utils.extend(self, params.rootModel);
        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);

        self.selectedInvoices = ko.observableArray();

        if (params.rootModel.params.mode && params.rootModel.params.mode === "approval") {
            self.selectedInvoices.push(params.rootModel.params.data.invoice);
            self.isVisible = ko.observable(false);

            (function (extensionObject) {
                extensionObject.isSet = true;
                extensionObject.data = self.params.data;
                extensionObject.template = "supply-chain-finance/invoice-accept-reject-checker";

                extensionObject.customFields = {
                    resourceBundle: self.nls,
                    fromDetailView: true,
                    invoiceNumber: params.rootModel.params.data.invoice.invoiceNumber,
                    invoiceRefNumber: params.rootModel.params.data.invoice.invoiceId,
                    comments: params.rootModel.params.data.invoice.remarks
                };
            })(self.params.confirmScreenExtensions);
        } else {
            self.selectedInvoices = params.rootModel.params.selectedInvoices;
            self.selectedRole = params.rootModel.params.selectedRole;
            self.invoiceRefNo = params.rootModel.params.invoicegetinvoiceRefNo;
            self.invoiceNo = ko.observable(params.rootModel.params.invoicegetVar().invoiceNumber);
            self.isVisible = ko.observable(true);
        }

        params.baseModel.registerElement("confirm-screen");
        params.baseModel.registerComponent("view-invoice-details", "supply-chain-finance");
        params.baseModel.registerComponent("view-invoice", "supply-chain-finance");

        self.goToConfirmScreen = function (data) {
            const transactionName = self.nls.componentHeader;

            params.dashboard.loadComponent("confirm-screen", {
                transactionResponse: data,
                transactionName: transactionName,
                customFields: {
                    resourceBundle: self.nls,
                    additionalData: self,
                    fromDetailView: true,
                    invoiceNumber: data.invoice ? data.invoice.invoiceNumber : self.invoiceNo ? self.invoiceNo() : "",
                    invoiceRefNumber: data.invoice ? data.invoice.invoiceId : self.invoiceRefNo ? self.invoiceRefNo() : "",
                    comments: params.rootModel.params.acceptReject() === "R" ? data.invoice ? data.invoice.remarks : "" : "",
                    overLayTitle: params.rootModel.params.acceptReject() === "A" ? self.nls.invoiceAccept : self.nls.invoiceReject
                },
                confirmScreenExtensions: {
                    confirmScreenMsgEval: function (data) {
                        if (params.rootModel.params.acceptReject() === "R") {
                            return self.nls.rejectConfirmMessage;
                        }

                        return self.nls.acceptConfirmMessage;
                    },
                    isSet: true,
                    template: "confirm-screen/invoice-accept-reject"
                }
            });
        };

        self.columnsArray = [{
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

        self.dataSource97 = new oj.ArrayTableDataSource(self.selectedInvoices, { idAttribute: "invoiceId" });

        self.onClickConfirm84 = function (_event, data) {
            params.rootModel.params.acceptCall().then(function (data) {
                self.goToConfirmScreen(data);
            });
        };

        self.onClickBack52 = function () {
            params.dashboard.loadComponent("view-invoice-details", {
                role: self.selectedRole(),
                invoiceNo: self.invoiceRefNo()
            });
        };

        self.onClickCancel28 = function() {
            params.dashboard.switchModule(true);
        };
    };
});