define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/review-bill-payments",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker",
    "ojs/ojbutton"
], function(ko, $, billPaymentModel, ResourceBundle) {
    "use strict";

    return function(Params) {
        const self = this;

        ko.utils.extend(self, Params.rootModel);

        self.resource = ResourceBundle;
        self.confirmScreenDetails = Params.rootModel.confirmScreenDetails;

        if (self.params.reviewMode) {
            Params.dashboard.headerName(self.params.header);
        }

        self.biller = self.biller || {};
        self.dataLoaded = ko.observable(false);
        self.selectedBillerName = ko.observable();
        self.disableConfirmButton = ko.observable(false);

        billPaymentModel.getBillPaymentDetails(Params.data ? Params.data.paymentId : ko.utils.unwrapObservable(self.params.data ? self.params.data.paymentId : self.params.paymentId)).done(function(data) {
            self.biller = data.transferDetails;
            self.biller.amount.amount = ko.observable(self.biller.amount.amount);
            self.getBillerDetails();
        });

        self.getConfirmScreenMsg = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") { return self.resource.common.confirmScreen.approvalMessages.FAILED.successmsg; } else if (jqXHR.responseJSON.transactionAction) { return self.resource.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg; }
        };

        self.getConfirmScreenStatus = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") { return self.resource.common.confirmScreen.approvalMessages.FAILED.statusmsg; } else if (jqXHR.responseJSON.transactionAction) { return self.resource.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg; }
        };

        self.getBillerDetails = function() {
            billPaymentModel.getBillerDetails(self.biller.billerId).done(function(data) {
                self.selectedBillerName(data.billerCategoryRel.billerDescription);
                self.dataLoaded(true);

                const confirmScreenDetailsArray = [
                    [{
                            label: self.resource.billPayment.billerName,
                            value: self.selectedBillerName()
                        },
                        {
                            label: self.resource.billPayment.relationshipNumber,
                            value: self.biller.relationshipNumber
                        }
                    ],
                    [{
                            label: self.resource.billPayment.amount,
                            value: Params.baseModel.formatCurrency(self.biller.amount.amount(), self.biller.amount.currency)
                        },
                        {
                            label: self.resource.billPayment.transferFrom,
                            value: self.biller.debitAccountId.displayValue
                        }
                    ]
                ];

                if (typeof self.confirmScreenDetails === "function") { self.confirmScreenDetails(confirmScreenDetailsArray); } else if (self.confirmScreenExtensions) {
                    $.extend(self.confirmScreenExtensions, {
                        isSet: true,
                        taskCode: "PC_F_BLPMT",
                        eReceiptRequired: true,
                        confirmScreenDetails: confirmScreenDetailsArray,
                        confirmScreenMsgEval: self.getConfirmScreenMsg,
                        confirmScreenStatusEval: self.getConfirmScreenStatus,
                        template: "confirm-screen/payments-template"
                    });
                }
            });
        };

        self.confirmPayment = function() {
            self.disableConfirmButton(true);

            billPaymentModel.confirmPayment(self.params.paymentId, self.transactionId).done(function(data, status, jqXHR) {
                self.baseURL = "payments/transfers/bill/" + self.paymentId();
                self.externalReferenceId(data.externalReferenceId);
                self.httpStatus = jqXHR.status;

                let successMessage, statusMessages;

                if (Params.dashboard.appData.segment === "CORP" && self.httpStatus && self.httpStatus === 202) {
                    successMessage = self.resource.common.confirmScreen.corpMaker;
                    statusMessages = self.resource.common.confirmScreen.approvalMessages.PENDING_APPROVAL.statusmsg;
                } else {
                    successMessage = self.resource.billPayment.successMessage;
                    statusMessages = self.resource.billPayment.sucessfull;
                }

                const shareMessage = Params.baseModel.format(self.resource.billPayment.shareMessage, {
                    biller: self.selectedBillerName(),
                    amount: Params.baseModel.formatCurrency(self.payBillModel.amount.amount(), self.payBillModel.amount.currency),
                    account: self.payBillModel.debitAccountId.displayValue()
                });

                Params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    eReceiptRequired: true,
                    hostReferenceNumber: data.externalReferenceId,
                    transactionName: self.resource.billPayment.titleRetail,
                    shareMessage: shareMessage,
                    confirmScreenExtensions: {
                        successMessage: successMessage,
                        statusMessages: statusMessages,
                        taskCode: self.currentTask(),
                        eReceiptRequired: true,
                        isSet: true,
                        confirmScreenDetails: self.confirmScreenDetails(),
                        template: "confirm-screen/payments-template"
                    },
                    favorite: true
                });
            });
        };
    };
});