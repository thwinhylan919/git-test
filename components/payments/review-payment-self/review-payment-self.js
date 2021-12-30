define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/review-payment-self",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojbutton"
], function(ko, $, selfModel, ResourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.resource = ResourceBundle;
        self.paymentData = self.paymentData || ko.observable();
        self.isDataLoaded = ko.observable(false);
        self.isStandingInstruction = ko.observable(false);
        self.isInstr = ko.observable(false);
        self.paymentId = ko.observable();
        self.note= ko.observable();
        self.model = ko.observable();
        self.payeeId= ko.observable();
        self.transactionType= ko.observable();

        if(rootParams.rootModel.params.retainedData!==undefined && rootParams.rootModel.params.retainedData.mobileNumber !== undefined && rootParams.rootModel.params.retainedData.amountToTransfer !== undefined){
        self.confirmScreenDetails = rootParams.rootModel.params.retainedData.confirmScreenDetails;
        self.betweenWalletAcc = ko.observable(rootParams.rootModel.params.retainedData.betweenWalletAcc());
            self.mobileNumber= ko.observable(rootParams.rootModel.params.retainedData.mobileNumber());
            self.amountToTransfer= ko.observable(rootParams.rootModel.params.retainedData.amountToTransfer());
            self.note= ko.observable(rootParams.rootModel.params.retainedData.note());
        }else{
            self.confirmScreenExtensions = rootParams.rootModel.params.confirmScreenExtensions;
            self.betweenWalletAcc = ko.observable(false);
        }

        self.dealDetails = ko.observable();
        self.dealType = ko.observable();
        self.exchangeRate = ko.observable();
        self.wallet= ko.observable("WALLET");
        self.walletLocalCurrency = ko.observable(rootParams.dashboard.appData.localCurrency);
        self.payeeDetails = ko.observable(rootParams.rootModel.params);

        if (rootParams.rootModel.params.transferData && rootParams.rootModel.params.transferData.reviewMode) {
            rootParams.dashboard.headerName(rootParams.rootModel.params.transferData.header);
        }

        if (rootParams.rootModel.params.transferData && rootParams.rootModel.params.transferData.instructionId) {
            self.paymentId(ko.utils.unwrapObservable(rootParams.rootModel.params.transferData.instructionId));
            self.isInstr(true);
        } else if (rootParams.rootModel.params.transferData && rootParams.rootModel.params.transferData.paymentId) {
            self.paymentId(ko.utils.unwrapObservable(rootParams.rootModel.params.transferData.paymentId));
        } else if (rootParams.rootModel.params.data) {
            self.paymentId(ko.utils.unwrapObservable(rootParams.rootModel.params.data.paymentId || rootParams.rootModel.params.data.instructionId));
            self.isInstr(!!rootParams.rootModel.params.data.instructionId);
        }

        self.getConfirmScreenMsg = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") { return self.resource.common.confirmScreen.approvalMessages.FAILED.successmsg; } else if (jqXHR.responseJSON.transactionAction) { return self.resource.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg; }
        };

        self.getConfirmScreenStatus = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") { return self.resource.common.confirmScreen.approvalMessages.FAILED.statusmsg; } else if (jqXHR.responseJSON.transactionAction) { return self.resource.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg; }
        };

        if(!self.betweenWalletAcc()) {
        selfModel.getTransferData(self.paymentId(), self.isInstr()).done(function(data) {
            self.paymentData(data);
            self.isDataLoaded(true);

            if (self.paymentData().transferDetails && self.paymentData().transferDetails.dealId) {
                selfModel.fetchForexDealList(self.paymentData().transferDetails.dealId).then(function(data) {
                    self.dealDetails(false);

                    self.exchangeRate({
                        amount : data.forexDealDTO[0].rate.amount,
                        currency : data.forexDealDTO[0].rateType === "B" ? data.forexDealDTO[0].buyAmount.currency : data.forexDealDTO[0].sellAmount.currency
                    });

                    self.dealType(data.forexDealDTO[0].dealType === "S" ? self.resource.paymentDetails.spot : self.resource.paymentDetails.forward);
                    ko.tasks.runEarly();
                    self.dealDetails(true);
                });
            } else if (self.paymentData().transferDetails.instructionDetails && self.paymentData().transferDetails.instructionDetails.dealId) {
                selfModel.fetchForexDealList(self.paymentData().transferDetails.instructionDetails.dealId).then(function(data) {
                    self.dealDetails(false);
                    self.dealType(data.forexDealDTO[0].dealType === "S" ? self.payments.moneytransfer.spot : self.payments.moneytransfer.forward);

                    self.exchangeRate({
                        amount : data.forexDealDTO[0].rate.amount,
                        currency : data.forexDealDTO[0].rateType === "B" ? data.forexDealDTO[0].buyAmount.currency : data.forexDealDTO[0].sellAmount.currency
                    });

                    ko.tasks.runEarly();
                    self.dealDetails(true);
                });
            }

            self.isStandingInstruction(data.transferDetails.type === "REC");

            const confirmScreenDetailsArray = [
                [{
                        label: self.resource.paymentDetails.transferto,
                        value: data.transferDetails.creditAccountId.displayValue
                    },
                    {
                        label: self.resource.paymentDetails.amount,
                        value: data.transferDetails.amount.amount,
                        currency: data.transferDetails.amount.currency,
                        isCurrency: true
                    }
                ],
                [{
                    label: self.resource.paymentDetails.transferfrom,
                    value: data.transferDetails.debitAccountId.displayValue
                }].concat(self.isStandingInstruction() ? [{
                    label: self.resource.paymentDetails.frequency,
                    value: self.resource.frequency[data.transferDetails.frequency]
                }] : [{
                    label: self.resource.paymentDetails.transferon,
                    value: data.transferDetails.startDate ? data.transferDetails.startDate : data.transferDetails.valueDate,
                    isDate: true
                }])
            ].concat(self.isStandingInstruction() ? [
                [{
                        label: self.resource.paymentDetails.startTransfer,
                        value: data.transferDetails.startDate ? data.transferDetails.startDate : data.transferDetails.valueDate,
                        isDate: true
                    },
                    {
                        label: self.resource.paymentDetails.stopTransfer,
                        value: data.transferDetails.endDate,
                        isDate: true
                    }
                ]
            ] : []).concat(data.transferDetails && data.transferDetails.dealId ? [
                [{
                    label: self.payments.moneytransfer.dealNumber,
                    value: data.transferDetails.dealId
                }]
            ] : []).concat(data.transferDetails.instructionDetails && data.transferDetails.instructionDetails.dealId ? [
                [{
                    label: self.payments.moneytransfer.dealNumber,
                    value: data.transferDetails.instructionDetails.dealId
                }]
            ] : []);

            if (self.shareMessage) {
                self.shareMessage(rootParams.baseModel.format(self.shareMessage(), {
                    amount: rootParams.baseModel.formatCurrency(data.transferDetails.amount.amount, data.transferDetails.amount.currency),
                    transferTo: data.transferDetails.creditAccountId.displayValue,
                    valueDate: data.transferDetails.startDate ? data.transferDetails.startDate : data.transferDetails.valueDate
                }));
            }

            if (typeof self.confirmScreenDetails === "function") { self.confirmScreenDetails(confirmScreenDetailsArray); } else if (self.confirmScreenExtensions) {
                $.extend(self.confirmScreenExtensions, {
                    isSet: true,
                    eReceiptRequired: true,
                    taskCode: "PC_F_SELF",
                    confirmScreenDetails: confirmScreenDetailsArray,
                    confirmScreenMsgEval: self.getConfirmScreenMsg,
                    confirmScreenStatusEval: self.getConfirmScreenStatus,
                    template: "confirm-screen/payments-template"
                });
            }
        });
      }

        self.getRepeateIntervals = function() {
            selfModel.getRepeateIntervals().done(function(data) {
                if (data.enumRepresentations !== null) {
                    for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
                        if (self.paymentData().transferDetails.frequency === data.enumRepresentations[0].data[i].code) {
                            self.paymentData().transferDetails.frequencyDescription = data.enumRepresentations[0].data[i].description;
                            self.isStandingInstruction(true);
                            break;
                        }
                    }
                }

                self.isDataLoaded(true);
            });
        };

        if(self.betweenWalletAcc()) {
        self.verifyTransferToWallet = function() {
            self.paymentId(rootParams.rootModel.params.retainedData.paymentId());
            self.model(rootParams.rootModel.params.retainedData.WalletToWalletPayload);
            self.payeeId(rootParams.rootModel.params.retainedData.payeeId().value);
            self.transactionType("INTERNALFT");

            selfModel.verifyTransferWallet(self.paymentId()).done(function(data, status, jqXHR) {
                self.paymentData(data);

                const confirmScreenDetailsArray = [
                    [{
                        label: self.resource.paymentDetails.transferfrom,
                        value: self.wallet
                    },
                    {
                        label: self.resource.paymentDetails.amount,
                        value: rootParams.rootModel.params.retainedData.amountToTransfer(),
                        currency: rootParams.dashboard.appData.localCurrency,
                        isCurrency: true
                        },
                        {
                            label: self.resource.paymentDetails.recipientMobileNumber,
                            value: self.mobileNumber
                        },
                        {
                            label: self.resource.paymentDetails.note,
                            value: self.note
                        }
                    ]

                ];

                self.httpStatus = jqXHR.status;

                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    hostReferenceNumber: data.externalReferenceId,
                    favorite: true,
                    model: self.model(),
                    paymentId : self.paymentId(),
                    payeeId : self.payeeId(),
                    transactionType: self.transactionType(),
                    transactionName: self.resource.paymentDetails.transactionName,
                    confirmScreenExtensions: {
                        isSet: true,
                        taskCode: "WA_F_WFT",
                        confirmScreenDetails: confirmScreenDetailsArray,
                        template: "confirm-screen/payments-template"
                    }
                }, self);

            }).fail(function() {
                self.cancelPayment();
            });

    };
}
    };
});