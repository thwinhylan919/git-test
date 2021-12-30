define([
    "ojL10n!resources/nls/review-multiple-invoices",
    "knockout",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojcollapsible",
    "ojs/ojaccordion",
    "ojs/ojbutton"
], function (resourceBundle, ko) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);

        self.expandedAccordians = ko.observableArray([]);
        self.invoicesArray = ko.observableArray(params.rootModel.params.invoicesArray);
        self.saveAsTemplate = params.rootModel.params.saveAsTemplate;
        params.baseModel.registerComponent("review-invoice-creation-form", "supply-chain-finance");
        params.baseModel.registerElement("confirm-screen");
        params.baseModel.registerComponent("invoice-create-details", "supply-chain-finance");
        params.baseModel.registerComponent("select-role-invoice", "supply-chain-finance");
        params.baseModel.registerComponent("preview-invoice-details", "supply-chain-finance");

        self.beforeExpandAccordian = function(item) {
            self.expandedAccordians.push({
                id: item.target.id
            });
        };

        self.expandAllAccordians = function() {
            self.expandedAccordians([]);

            for (let i = 0; i < self.invoicesArray().length; i++) {
                self.expandedAccordians.push({
                    id: "invoice-" + self.invoicesArray()[i].formId
                });
            }
        };

        self.collapseAllAccordians = function() {
            while (self.expandedAccordians().length > 0) {
                self.expandedAccordians.pop();
            }
        };

        self.collapseAccordian = function(item) {
            for (let i = 0; i < self.expandedAccordians().length; i++) {
                if (item.target.id === self.expandedAccordians()[i].id) {
                    self.expandedAccordians.splice(i, 1);
                    break;
                }
            }
        };

        self.onClickExpandAll4 = function () {
            self.expandAllAccordians();
        };

        self.onClickCollapseAll33 = function () {
            self.collapseAllAccordians();
        };

        self.preview = function (programName,data) {
            params.dashboard.openRightPanel("preview-invoice-details", {
                invoiceNo: data.invoiceNumber,
                role: "S",
                invoiceDetails : data,
                programName : programName,
                supplierName: params.rootModel.params.supplierName
            }, self.nls.CreateInvoice.overlayTitle);
        };

        self.onClickConfirm43 = function () {
            params.rootModel.params.createInvoices().then(function(data) {
                let failedTxn,
                    confirmMessage, templateMessage, length, templateFailed, templateSequenceId;

                if (self.saveAsTemplate) {
                    length = data.batchDetailResponseDTOList.length - 1;

                    if (data.batchDetailResponseDTOList[length].status !== 200 && data.batchDetailResponseDTOList[length].status !== 201 && data.batchDetailResponseDTOList[length].status !== 202) {
                        templateFailed = data.batchDetailResponseDTOList[length].sequenceId;
                    }

                    templateSequenceId = data.batchDetailResponseDTOList[length].sequenceId;
                } else {
                    length = data.batchDetailResponseDTOList.length;
                }

                for (let j = 0; j < length; j++) {
                    if (data.batchDetailResponseDTOList[j].status !== 200 && data.batchDetailResponseDTOList[j].status !== 201 && data.batchDetailResponseDTOList[j].status !== 202) {
                        failedTxn = data.batchDetailResponseDTOList[j].sequenceId;
                    }
                }

                if (failedTxn) {
                    confirmMessage = self.nls.rejectConfirmMessage;
                } else {
                    confirmMessage = self.nls.acceptConfirmMessage;
                }

                if (templateFailed) {
                    templateMessage = self.nls.rejectTemplate;
                } else if (self.saveAsTemplate) {
                    templateMessage = self.nls.acceptTemplate;
                }

                params.dashboard.loadComponent("confirm-screen", {
                    transactionResponse: data,
                    transactionName: self.nls.componentHeader,
                    customFields: {
                        resourceBundle: self.nls,
                        additionalData: self.invoicesArray(),
                        overLayTitle: self.nls.invoiceDetails,
                        saveAsTemplate: self.saveAsTemplate
                    },
                    confirmScreenExtensions: {
                        confirmScreenMsgEval: function(data) {
                            if (failedTxn && data.sequenceId !== templateSequenceId) {
                                return Number(data.sequenceId) === Number(failedTxn) ? confirmMessage : null;
                            } else if (self.saveAsTemplate && data.sequenceId === templateSequenceId) {
                                return templateMessage;
                            }

                            return data.sequenceId === "0" ? confirmMessage : null;

                        },
                        isSet: true,
                        template: "confirm-screen/invoice-creation-confirmation"
                    }
                });
            });
        };

        self.onClickCancel99 = function () {
            params.dashboard.switchModule(true);
        };

        self.onClickBack52 = function () {
            params.dashboard.hideDetails();
        };
    };
});