define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/payments-money-transfer",
    "ojs/ojknockout",
    "ojs/ojavatar"
], function(oj, ko, $, internalModel, ResourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);

        self.payments = ResourceBundle.payments;
        self.paymentData = self.paymentData || ko.observable();
        self.stageTwo = ko.observable(false);
        self.transferNow = ko.observable(true);
        self.frequencyDesc = ko.observable();
        self.purpose =self.params.retainedData ? self.params.retainedData.purpose : ko.observable() ;
        self.purposeText = ko.observable();
        self.isStandingInstruction = ko.observable();
        self.paymentId = ko.observable();
        self.branchCode = ko.observable();
        self.confirmScreenDetailsArray = ko.observableArray();
        self.instructionId = ko.observable(ko.utils.unwrapObservable(self.params.data ? self.params.data.instructionId : self.params.transferData.instructionId));

        if (self.params.transferData && self.params.transferData.reviewMode) {
            rootParams.dashboard.headerName(self.params.transferData.header);
        }

        self.initials = ko.observable();
        self.payeeDetails = ko.observable({});

        if(rootParams.rootModel.params.retainedData !== undefined)
        {
        self.confirmScreenDetails = rootParams.rootModel.params.retainedData.confirmScreenDetails;
        }
        else{
            self.confirmScreenExtensions = rootParams.rootModel.params.confirmScreenExtensions;
        }

        self.dealDetails = ko.observable();
        self.dealType = ko.observable();
        self.exchangeRate = ko.observable();
        self.preview = ko.observable();

        rootParams.baseModel.registerElement([
            "internal-account-input"
        ]);

        if (self.instructionId()) {
            self.transferNow(false);
            self.paymentId(self.instructionId());
        } else if (ko.utils.unwrapObservable(self.params.data || self.params.transferData.paymentId)) {
            self.paymentId(ko.utils.unwrapObservable(self.params.data ? self.params.data.paymentId : self.params.transferData.paymentId));
        }

        function purposeHandler(data) {
            if (data.purposeList !== null && data.purposeList.length > 0) {
                for (let i = 0; i < data.purposeList.length; i++) {
                    if (self.purpose() === data.purposeList[i].code) {
                        self.purposeText(data.purposeList[i].description);
                        break;
                    }
                }

                self.stageTwo(true);
            } else {
                self.stageTwo(true);
            }
        }

        self.imageUploadFlag = ko.observable();

        self.getConfirmScreenMsg = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") { return self.payments.common.confirmScreen.approvalMessages.FAILED.successmsg; } else if (jqXHR.responseJSON.transactionAction) { return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg; }
        };

        self.getConfirmScreenStatus = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") { return self.payments.common.confirmScreen.approvalMessages.FAILED.statusmsg; } else if (jqXHR.responseJSON.transactionAction) { return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg; }
        };

        function setPreviewImage(data) {
            if (data && data.contentDTOList) {
                self.preview("data:image/gif;base64," + data.contentDTOList[0].content);
            }
        }

        function getPayeeMaintenance(maintenanceResponse) {
            let propertyValue;

            if (rootParams.dashboard.appData.segment === "CORP") {
                propertyValue = ko.utils.arrayFirst(maintenanceResponse.configurationDetails, function(element) {
                    return element.propertyId === "CORPORATE_PAYEE_PHOTO_UPLOAD_ENABLED";
                }).propertyValue;
            } else {
                propertyValue = ko.utils.arrayFirst(maintenanceResponse.configurationDetails, function(element) {
                    return element.propertyId === "RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED";
                }).propertyValue;
            }

            if (propertyValue === "Y") {
                self.imageUploadFlag(true);
            } else {
                self.imageUploadFlag(false);
            }

            if (self.imageUploadFlag()) {
                const groupId = self.paymentData().transferDetails.instructionDetails ? self.paymentData().transferDetails.payeeDetails.groupId : self.paymentData().payeeDetails.groupId,
                    payeeId = self.paymentData().transferDetails.instructionDetails ? self.paymentData().transferDetails.instructionDetails.payeeId : self.paymentData().transferDetails.payeeId;

                internalModel.getPayeeDetails(groupId, payeeId).then(function(payeeData) {
                    self.initials(oj.IntlConverterUtils.getInitials(payeeData.internalPayee.nickName.split(/\s+/)[0], payeeData.internalPayee.nickName.split(/\s+/)[1]));

                    if (payeeData.internalPayee.contentId && payeeData.internalPayee.contentId.value) {
                        internalModel.retrieveImage(payeeData.internalPayee.contentId.value).then(function(imageData) {
                            setPreviewImage(imageData);
                        });
                    } else {
                        internalModel.getGroupDetails(groupId).then(function(groupData) {
                            if (groupData.payeeGroup.contentId && groupData.payeeGroup.contentId.value) {
                                internalModel.retrieveImage(groupData.payeeGroup.contentId.value).then(function(imageData) {
                                    setPreviewImage(imageData);
                                });
                            }
                        });
                    }
                });
            }
        }

        function responseHandler(data) {
            self.paymentData(data);

            internalModel.getPayeeMaintenance().then(function(maintenanceResponse) {
                getPayeeMaintenance(maintenanceResponse);
            });

            if (self.paymentData().transferDetails && self.paymentData().transferDetails.dealId) {
                internalModel.fetchForexDealList(self.paymentData().transferDetails.dealId).then(function(data) {
                    self.dealDetails(false);
                    self.dealType(data.forexDealDTO[0].dealType === "S" ? self.payments.moneytransfer.spot : self.payments.moneytransfer.forward);

                    self.exchangeRate({
                        amount : data.forexDealDTO[0].rate.amount,
                        currency : data.forexDealDTO[0].rateType === "B" ? data.forexDealDTO[0].buyAmount.currency : data.forexDealDTO[0].sellAmount.currency
                    });

                    ko.tasks.runEarly();
                    self.dealDetails(true);
                });
            } else if (self.paymentData().transferDetails.instructionDetails && self.paymentData().transferDetails.instructionDetails.dealId) {
                internalModel.fetchForexDealList(self.paymentData().transferDetails.instructionDetails.dealId).then(function(data) {
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

            if (!self.transferNow()) {
                self.isStandingInstruction(data.transferDetails.instructionDetails.type === "REC");
                self.purpose(data.transferDetails.instructionDetails.purpose);

                if (self.purpose() === "OTH") { self.purposeText(data.transferDetails.instructionDetails.purposeText); }

                self.payeeDetails({
                    accountType: "INTERNAL",
                    accountNumber: self.paymentData().transferDetails.payeeDetails.accountNumber,
                    accountName: self.paymentData().transferDetails.payeeDetails.accountName
                });
            } else {
                self.purpose(data.transferDetails.purpose);

                if (self.purpose() === "OTH") { self.purposeText(data.transferDetails.purposeText); }

                self.payeeDetails({
                    accountType: "INTERNAL",
                    accountNumber: self.paymentData().payeeDetails.accountNumber,
                    accountName: self.paymentData().payeeDetails.accountName
                });
            }

if(self.purpose()!==undefined){
            if (self.purpose() !== "OTH") {
                if (self.isMultiplePayment) {
                    purposeHandler(self.supportingData.purpose);
                } else {
                    self.getPurposeDescription();
                }
            }
        }
            else { self.stageTwo(true); }

            const confirmScreenDetailsArray = [
                [{
                        label: self.payments.moneytransfer.transferTo,
                        value: data.payeeDetails ? data.payeeDetails.nickName : data.transferDetails.payeeDetails.nickName
                    },
                    {
                        label: self.payments.moneytransfer.amount,
                        value: data.transferDetails.instructionDetails ? rootParams.baseModel.formatCurrency(data.transferDetails.instructionDetails.amount.amount, data.transferDetails.instructionDetails.amount.currency) : rootParams.baseModel.formatCurrency(data.transferDetails.amount.amount, data.transferDetails.amount.currency)
                    }
                ],
                [{
                        label: self.payments ? self.payments.payee.accountNumber : self.payments.moneytransfer.accountNumber,
                        value: self.payeeDetails().accountNumber,
                        isInternalAccNo: true
                    },
                    {
                        label: self.payments ? self.payments.payee.accountType : self.payments.moneytransfer.accountType,
                        value: self.payments.payee.type.INTERNAL
                    }
                ],
                [{
                    label: self.payments.moneytransfer.transferfrom,
                    value: data.transferDetails.instructionDetails ? data.transferDetails.instructionDetails.debitAccountId.displayValue : data.transferDetails.debitAccountId.displayValue
                }].concat(self.isStandingInstruction() ? [{
                    label: self.payments.moneytransfer.frequency,
                    value: self.payments.common.frequency[data.transferDetails.instructionDetails.frequency]
                }] : [{
                    label: self.payments.moneytransfer.transferon,
                    value: data.transferDetails.instructionDetails ? data.transferDetails.instructionDetails.startDate : data.transferDetails.valueDate,
                    isDate: true
                }])
            ].concat(self.isStandingInstruction() ? [{
                    label: self.payments.moneytransfer.startTransfer,
                    value: data.transferDetails.instructionDetails ? data.transferDetails.instructionDetails.startDate : data.transferDetails.valueDate,
                    isDate: true
                },
                {
                    label: self.payments.moneytransfer.stopTransfer,
                    value: data.transferDetails.instructionDetails.endDate,
                    isDate: true
                }
            ] : []).concat(data.transferDetails.instructionDetails && data.transferDetails.instructionDetails.dealId ? [
                [{
                    label: self.payments.moneytransfer.dealNumber,
                    value: data.transferDetails.instructionDetails.dealId
                }]
            ] : []).concat(data.transferDetails && data.transferDetails.dealId ? [
                [{
                    label: self.payments.moneytransfer.dealNumber,
                    value: data.transferDetails.dealId
                }]
            ] : []);

            if (self.shareMessage) {
                self.shareMessage(rootParams.baseModel.format(self.shareMessage(), {
                    amount: data.transferDetails.instructionDetails ? rootParams.baseModel.formatCurrency(data.transferDetails.instructionDetails.amount.amount, data.transferDetails.instructionDetails.amount.currency) : rootParams.baseModel.formatCurrency(data.transferDetails.amount.amount, data.transferDetails.amount.currency),
                    transferTo: data.payeeDetails ? data.payeeDetails.nickName : data.transferDetails.payeeDetails.nickName,
                    valueDate: data.transferDetails.instructionDetails ? data.transferDetails.instructionDetails.startDate : data.transferDetails.valueDate
                }));
            }

            if (typeof self.confirmScreenDetails === "function") { self.confirmScreenDetails(confirmScreenDetailsArray); } else if (self.confirmScreenExtensions) {
                $.extend(self.confirmScreenExtensions, {
                    isSet: true,
                    eReceiptRequired: true,
                    taskCode: "PC_F_INTRNL",
                    confirmScreenDetails: confirmScreenDetailsArray,
                    confirmScreenMsgEval: self.getConfirmScreenMsg,
                    confirmScreenStatusEval: self.getConfirmScreenStatus,
                    template: "confirm-screen/payments-template"
                });
            }
        }

        self.getFrequencyDescription = function() {
            internalModel.getFrequencyDesc().done(function(data) {
                if (data.enumRepresentations !== null) {
                    for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
                        if (self.paymentData().transferDetails.instructionDetails.frequency === data.enumRepresentations[0].data[i].code) {
                            self.frequencyDesc(data.enumRepresentations[0].data[i].description);
                            self.isStandingInstruction(true);
                            break;
                        }
                    }
                }
            });
        };

        self.getPurposeDescription = function() {
            internalModel.getPurposeDesc().done(function(data) {
                purposeHandler(data);
            });
        };

        if (self.isMultiplePayment) {
            self.transferNow(rootParams.isTransferNow);
            responseHandler(self.params.data);
        } else {
            internalModel.getTransferData(self.paymentId(), "transfers", "internal", self.transferNow()).done(function(data) {
                responseHandler(data);
            });
        }
    };
});