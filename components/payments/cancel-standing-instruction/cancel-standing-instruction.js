define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/cancel-standing-instruction",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojknockout-validation"
], function(ko, $, cancelSIModel, ResourceBundle) {
    "use strict";

    return function(Params) {
        const self = this,
            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(cancelSIModel.getNewModel());

                return KoModel;
            };

        ko.utils.extend(self, Params.rootModel);

        self.payments = ResourceBundle.payments;
        self.common = ResourceBundle.common;
        self.validationTracker = Params.validator;
        self.stageOne = ko.observable(true);
        self.SIData = Params.data || ko.observable(self.params.data);
        self.callback = Params.callback;
        self.extRefId = ko.observable();
        self.initiateSuccess = ko.observable(false);
        self.instructionType = ko.observable();
        self.confirmScreenDetails = ko.observable();
        self.selectedPayeeImage = Params.selectedPayeeImage || self.params.selectedPayeeImage;
        self.selectedPayeeInitials = Params.selectedPayeeInitials || self.params.selectedPayeeInitials;
        self.imageUploadFlag = Params.imageUploadFlag || self.params.imageUploadFlag;
        Params.dashboard.headerName(self.params.header);
        self.extRefId(self.SIData().externalReferenceNumber);
        self.instructionType(self.SIData().type);
        self.baseURL = "payments/instructions/cancellation/" + self.extRefId();
        self.cancelSIModel = getNewKoModel().cancelSIModel;
        cancelSIModel.init();
        self.cancelSIModel.instructionType(self.instructionType());

        const payload = ko.toJSON(self.cancelSIModel);

        cancelSIModel.initiateCancelSI(self.extRefId(), payload).done(function() {
            self.initiateSuccess(true);
            $("#menuButtonDialog").trigger("openModal");

            const confirmScreenDetailsArray = [
                [{
                        label: self.payments.standinginstructions.payeeName,
                        value: self.SIData().name
                    },
                    {
                        label: self.payments.standinginstructions.amount,
                        value: self.SIData().amount,
                        currency: self.SIData().currency,
                        isCurrency: true
                    }
                ],
                [{
                        label: self.payments.standinginstructions.transferWhen,
                        value: self.SIData().date,
                        isDate: true
                    },
                    {
                        label: self.payments.standinginstructions.accountNumber,
                        value: self.SIData().account
                    }
                ],
                [{
                    label: self.payments.standinginstructions.accountType,
                    value: self.SIData().desc
                }]
            ];

            if (typeof self.confirmScreenDetails === "function") { self.confirmScreenDetails(confirmScreenDetailsArray); }
        }).fail(function() {
            if (self.closeHandler) {
                self.closeHandler();
            }
        });

        self.verify = function() {
            if (self.initiateSuccess() === false) {
                return;
            }

            cancelSIModel.verifyCancelSI(self.extRefId()).done(function(data, status, jqXHR) {
                self.stageOne(false);

                let successMessage, statusMessages;

                self.httpStatus = jqXHR.status;

                if (Params.dashboard.appData.segment === "CORP" && self.httpStatus && self.httpStatus === 202) {
                    successMessage = self.common.confirmScreen.corpMaker;
                    statusMessages = self.common.confirmScreen.approvalMessages.PENDING_APPROVAL.statusmsg;
                } else {
                    successMessage = self.common.confirmScreen.successSI;
                    statusMessages = self.common.success;
                }

                Params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    eReceiptRequired: true,
                    hostReferenceNumber: self.extRefId(),
                    transactionName: self.payments.standinginstructions.verifyCancelSI,
                    confirmScreenExtensions: {
                        successMessage: successMessage,
                        statusMessages: statusMessages,
                        isSet: true,
                        eReceiptRequired: true,
                        taskCode: "PC_F_PIC",
                        confirmScreenDetails: self.confirmScreenDetails(),
                        template: "confirm-screen/payments-template"
                    }
                }, self);
            });
        };

        self.closeDialog = function() {
            if (Params.baseModel.large()) { $("#menuButtonDialog").hide(); } else {
                self.cancelSIClicked(false);
                Params.dashboard.hideDetails();
            }
        };

        self.done = function() {
            $("#menuButtonDialog").hide();
            self.stageOne(true);
        };

        self.cancel = function() {
            self.stageOne(true);
        };

        self.getDate = function(startDate) {
            const date = startDate.substring(9, 10);

            return date;
        };

        Params.baseModel.registerElement("confirm-screen");
    };
});