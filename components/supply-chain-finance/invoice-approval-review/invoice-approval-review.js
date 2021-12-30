define([
    "ojL10n!resources/nls/invoice-approval-review",
    "ojs/ojcore",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojarraytabledatasource",
    "ojs/ojtable",
    "ojs/ojbutton"
], function (resourceBundle, oj) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);

        self.selectedInvoices = params.rootModel.params.selectedInvoices;
        self.invoiceList = params.rootModel.params.invoiceList;
        self.acceptReject = params.rootModel.params.acceptReject;
        params.baseModel.registerElement("confirm-screen");
        params.baseModel.registerComponent("select-role-invoice", "supply-chain-finance");
        params.baseModel.registerComponent("invoice-update-details", "supply-chain-finance");
        params.baseModel.registerComponent("invoice-accept-reject", "supply-chain-finance");

        self.goToConfirmScreen = function (data, failedTxn, confirmMessage) {
            const transactionName = self.nls.componentHeader;

            params.dashboard.loadComponent("confirm-screen", {
                transactionResponse: data,
                transactionName: transactionName,
                customFields: {
                    resourceBundle: self.nls,
                    additionalData: self,
                    comments: self.acceptReject() === "R" ? data.invoice ? data.invoice.remarks : "" : "",
                    overLayTitle: self.acceptReject() === "A" ? self.nls.invoiceAccept : self.nls.invoiceReject
                },
                confirmScreenExtensions: {
                    confirmScreenMsgEval: function (data) {
                        if (failedTxn) {
                            return Number(data.sequenceId) === Number(failedTxn) ? confirmMessage : null;
                        }

                        return data.sequenceId === "0" ? confirmMessage : null;

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

        self.dataSource97 = new oj.ArrayTableDataSource(self.selectedInvoices, {
            idAttribute: "invoiceId"
        });

        self.onClickConfirm11 = function () {
            params.rootModel.params.approveRejectBatchCall().then(function (data) {
                let failedTxn,
                    confirmMessage;

                for (let j = 0; j < data.batchDetailResponseDTOList.length; j++) {
                    if (data.batchDetailResponseDTOList[j].status !== 200 && data.batchDetailResponseDTOList[j].status !== 201 && data.batchDetailResponseDTOList[j].status !== 202) {
                        failedTxn = data.batchDetailResponseDTOList[j].sequenceId;
                    }
                }

                if (failedTxn && self.acceptReject() === "R") {
                    confirmMessage = self.nls.rejectFailureMessage;
                } else if (failedTxn && self.acceptReject() === "A") {
                    confirmMessage = self.nls.acceptFailureMessage;
                } else if (params.rootModel.params.acceptReject() === "R") {
                    confirmMessage = self.nls.rejectConfirmMessage;
                } else {
                    confirmMessage = self.nls.acceptConfirmMessage;
                }

                self.goToConfirmScreen(data, failedTxn, confirmMessage);
            });
        };

        self.onClickBack31 = function () {
            params.dashboard.loadComponent("invoice-accept-reject", self);
        };

        self.onClickCancel59 = function () {
            params.dashboard.switchModule(true);
        };
    };
});