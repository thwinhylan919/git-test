define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/payments-money-transfer",
    "ojs/ojknockout",
    "ojs/ojavatar"
], function(oj, ko, $, internationalModel, ResourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.payments = ResourceBundle.payments;
        self.paymentData = ko.observable();
        self.charges = ko.observable();
        self.chargesDescription = ko.observable();
        self.stageTwo = ko.observable(false);
        self.transferNow = ko.observable(true);
        self.paymentId = ko.observable();
        self.chargesData = ko.observable();
        self.chargesSum = ko.observable();
        self.serviceChargesLoaded = ko.observable(false);
        self.noteInternational = ko.observable();

        if(rootParams.rootModel.payeeDetails!==undefined){
            self.payeeDetails = rootParams.rootModel.payeeDetails;
        }
       else{
        self.payeeDetails = rootParams.rootModel.params.retainedData? rootParams.rootModel.params.retainedData.payeeDetails :null;
       }

        if (rootParams.rootModel.params.transferData && rootParams.rootModel.params.transferData.reviewMode) {
            rootParams.dashboard.headerName(rootParams.rootModel.params.transferData.header);
        }

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
        self.initials = ko.observable();
        self.imageUploadFlag = ko.observable();
        self.payeeDetails = rootParams.rootModel.params.mode === "approval" ? ko.observable() : self.payeeDetails;
        self.instructionId = ko.observable(ko.utils.unwrapObservable(rootParams.rootModel.params.data ? rootParams.rootModel.params.data.instructionId : rootParams.rootModel.params.transferData.instructionId));

        let intermediaryBankDetailsPromise, intermediaryBankNetwork;

        if (self.instructionId()) {
            self.transferNow(false);
            self.paymentId(self.instructionId());
        } else if (rootParams.rootModel.params.data || rootParams.rootModel.params.transferData.paymentId) {
            self.paymentId(ko.utils.unwrapObservable(rootParams.rootModel.params.data ? rootParams.rootModel.params.data.paymentId : rootParams.rootModel.params.transferData.paymentId));
        }

        self.getConfirmScreenMsg = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") { return self.payments.common.confirmScreen.approvalMessages.FAILED.successmsg; } else if (jqXHR.responseJSON.transactionAction) { return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg; }
        };

        self.getConfirmScreenStatus = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") { return self.payments.common.confirmScreen.approvalMessages.FAILED.statusmsg; } else if (jqXHR.responseJSON.transactionAction) { return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg; }
        };

        function serviceCharges(urlParams) {
            internationalModel.getServiceCharges(urlParams).then(function(chargesResponse) {
                if (chargesResponse && chargesResponse.paymentChargeDetails && chargesResponse.paymentChargeDetails.length > 0) {
                    self.chargesData(chargesResponse.paymentChargeDetails);

                    let sum = 0,
                        j = 0;

                    for (j = 0; j < self.chargesData && self.chargesData().length; j++) {
                        sum = sum + self.chargesData()[j].serviceCharge.amount;
                    }

                    self.chargesSum(sum);
                    self.serviceChargesLoaded(true);
                    self.stageTwo(true);
                }
            });
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
                const groupId = self.paymentData().payoutDetails.instructionDetails ? self.paymentData().payoutDetails.payeeDetails.groupId : self.paymentData().payeeDetails.groupId,
                    payeeId = self.paymentData().payoutDetails.instructionDetails ? self.paymentData().payoutDetails.instructionDetails.payeeId : self.paymentData().payoutDetails.payeeId;

                internationalModel.getPayeeDetails(groupId, payeeId).then(function(payeeData) {
                    self.initials(oj.IntlConverterUtils.getInitials(payeeData.internationalPayee.nickName.split(/\s+/)[0], payeeData.internationalPayee.nickName.split(/\s+/)[1]));

                    if (payeeData.internationalPayee.contentId && payeeData.internationalPayee.contentId.value) {
                        internationalModel.retrieveImage(payeeData.internationalPayee.contentId.value).then(function(imageData) {
                            if (imageData && imageData.contentDTOList) {
                                self.preview("data:image/gif;base64," + imageData.contentDTOList[0].content);
                            }
                        });
                    } else {
                        internationalModel.getGroupDetails(groupId).then(function(groupData) {
                            if (groupData.payeeGroup.contentId && groupData.payeeGroup.contentId.value) {
                                internationalModel.retrieveImage(groupData.payeeGroup.contentId.value).then(function(imageData) {
                                    if (imageData && imageData.contentDTOList) {
                                        self.preview("data:image/gif;base64," + imageData.contentDTOList[0].content);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }

        function setIntermediaryBankDetails() {
            if (self.paymentData().payoutDetails.instructionDetails) {
                if (self.paymentData().payoutDetails.instructionDetails.intermediaryBankNetwork) {
                    intermediaryBankNetwork = self.paymentData().payoutDetails.instructionDetails.intermediaryBankNetwork;

                    if (intermediaryBankNetwork === "SWI") {
                        intermediaryBankDetailsPromise = internationalModel.getBankDetailsBIC(self.paymentData().payoutDetails.instructionDetails.intermediaryBankDetails.code);
                    } else if (intermediaryBankNetwork === "NAC") {
                        intermediaryBankDetailsPromise = internationalModel.getBankDetailsNCC(self.paymentData().payoutDetails.instructionDetails.intermediaryBankDetails.code);
                    } else
                        {intermediaryBankDetailsPromise = Promise.resolve();}
                } else
                    {intermediaryBankDetailsPromise = Promise.resolve();}
            } else if (self.paymentData().payoutDetails.intermediaryBankNetwork) {
                    intermediaryBankNetwork = self.paymentData().payoutDetails.intermediaryBankNetwork;

                    if (intermediaryBankNetwork === "SWI") {
                        intermediaryBankDetailsPromise = internationalModel.getBankDetailsBIC(self.paymentData().payoutDetails.intermediaryBankDetails.code);
                    } else if (intermediaryBankNetwork === "NAC") {
                        intermediaryBankDetailsPromise = internationalModel.getBankDetailsNCC(self.paymentData().payoutDetails.intermediaryBankDetails.code);
                    } else {
                        intermediaryBankDetailsPromise = Promise.resolve();
                    }
                } else
                    {intermediaryBankDetailsPromise = Promise.resolve();}
        }

                function setNote(data){
          let codeDescription;

            if(self.paymentData().payoutDetails && self.paymentData().payoutDetails.instructionDetails){

                 codeDescription = ko.utils.arrayFirst(data.enumRepresentations[0].data, function(config) {
                                    return config.code === self.paymentData().payoutDetails.instructionDetails.remarks.split("/")[1];
                                }).description;

                self.noteInternational([codeDescription , self.paymentData().payoutDetails.instructionDetails.remarks.split("/")[2]]);
            }
            else{
                codeDescription = ko.utils.arrayFirst(data.enumRepresentations[0].data, function(config) {
                                    return config.code === self.paymentData().payoutDetails.remarks.split("/")[1];
                                }).description;

                self.noteInternational([codeDescription , self.paymentData().payoutDetails.remarks.split("/")[2]]);
            }
        }

        function responseHandler(data) {
            self.paymentData(data);

            internationalModel.getPayeeMaintenance().then(function(maintenanceResponse) {
                getPayeeMaintenance(maintenanceResponse);
            });

            let transactionAmount, transactionCurrency, debitAccountId;

            if (self.transferNow()) {
                self.charges(data.payoutDetails.charges);
                transactionAmount = data.payoutDetails.amount.amount;
                transactionCurrency = data.payoutDetails.amount.currency;
                debitAccountId = data.payoutDetails.debitAccountId.value;
            } else {
                self.charges(data.payoutDetails.instructionDetails.charges);
                transactionAmount = data.payoutDetails.instructionDetails.amount.amount;
                transactionCurrency = data.payoutDetails.instructionDetails.amount.currency;
                debitAccountId = data.payoutDetails.instructionDetails.debitAccountId.value;
            }

            if (self.paymentData().payoutDetails && self.paymentData().payoutDetails.dealId) {
                internationalModel.fetchForexDealList(self.paymentData().payoutDetails.dealId).then(function(data) {
                    self.dealDetails(false);
                    self.dealType(data.forexDealDTO[0].dealType === "S" ? self.payments.moneytransfer.spot : self.payments.moneytransfer.forward);

                    self.exchangeRate({
                        amount : data.forexDealDTO[0].rate.amount,
                        currency : data.forexDealDTO[0].rateType === "B" ? data.forexDealDTO[0].buyAmount.currency : data.forexDealDTO[0].sellAmount.currency
                    });

                    ko.tasks.runEarly();
                    self.dealDetails(true);
                });
            } else if (self.paymentData().payoutDetails.instructionDetails && self.paymentData().payoutDetails.instructionDetails.dealId) {
                internationalModel.fetchForexDealList(self.paymentData().payoutDetails.instructionDetails.dealId).then(function(data) {
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

            internationalModel.getChargesMaintenances().then(function(maintenanceRespnse) {
                let checkServiceChargesEnabled, s = 0;

                if (rootParams.dashboard.appData.segment === "RETAIL") {
                    for (s = 0; s < maintenanceRespnse.configurationDetails.length; s++) {
                        checkServiceChargesEnabled = ko.utils.arrayFirst(maintenanceRespnse.configurationDetails, function(config) {
                            return config.propertyId === "RETAIL_SERVICE_CHARGES_ENABLED";
                        }).propertyValue === "Y";
                    }
                } else if (rootParams.dashboard.appData.segment === "CORP") {
                    for (s = 0; s < maintenanceRespnse.configurationDetails.length; s++) {
                        checkServiceChargesEnabled = ko.utils.arrayFirst(maintenanceRespnse.configurationDetails, function(config) {
                            return config.propertyId === "CORPORATE_SERVICE_CHARGES_ENABLED";
                        }).propertyValue === "Y";
                    }
                }

                if (checkServiceChargesEnabled) {
                    serviceCharges({
                        paymentType: "INTERNATIONALFT",
                        transactionAmount: transactionAmount,
                        transactionCurrency: transactionCurrency,
                        debitAccountId: debitAccountId
                    });
                }
            });

            let bankDetailsPromise;

            if (rootParams.rootModel.params.mode === "approval") {
                let bankDetailsCode, network;

                if (self.paymentData().payoutDetails.instructionDetails) {
                    bankDetailsCode = self.paymentData().payoutDetails.payeeDetails.bankDetails.code;
                    network = self.paymentData().payoutDetails.payeeDetails.bankDetails.codeType;

                    self.payeeDetails({
                        accountType: "INTERNATIONAL",
                        accountNumber: self.paymentData().payoutDetails.payeeDetails.accountNumber,
                        accountName: self.paymentData().payoutDetails.payeeDetails.accountName,
                        payeeAddress: self.paymentData().payoutDetails.payeeDetails.address ? {
                            line1: self.paymentData().payoutDetails.payeeDetails.address.line1 ? self.paymentData().payoutDetails.payeeDetails.address.line1 : null,
                            line2: self.paymentData().payoutDetails.payeeDetails.address.line2 ? self.paymentData().payoutDetails.payeeDetails.address.line2 : null,
                            city: self.paymentData().payoutDetails.payeeDetails.address.city ? self.paymentData().payoutDetails.payeeDetails.address.city : null,
                            country: self.paymentData().payoutDetails.payeeDetails.address.country ? self.paymentData().payoutDetails.payeeDetails.address.country : null
                        } : null
                    });
                } else {
                    bankDetailsCode = self.paymentData().payeeDetails.bankDetails.code;
                    network = self.paymentData().payeeDetails.bankDetails.codeType;

                    self.payeeDetails({
                        accountType: "INTERNATIONAL",
                        accountNumber: self.paymentData().payeeDetails.accountNumber,
                        accountName: self.paymentData().payeeDetails.accountName,
                        payeeAddress: self.paymentData().payeeDetails.address ? {
                            line1: self.paymentData().payeeDetails.address.line1 ? self.paymentData().payeeDetails.address.line1 : null,
                            line2: self.paymentData().payeeDetails.address.line2 ? self.paymentData().payeeDetails.address.line2 : null,
                            city: self.paymentData().payeeDetails.address.city ? self.paymentData().payeeDetails.address.city : null,
                            country: self.paymentData().payeeDetails.address.country ? self.paymentData().payeeDetails.address.country : null
                        } : null
                    });
                }

                if (network === "SWI") { bankDetailsPromise = internationalModel.getBankDetailsBIC(bankDetailsCode); } else if (network === "NAC") { bankDetailsPromise = internationalModel.getBankDetailsNCC(bankDetailsCode); } else if (network === "SPE") { self.payeeDetails().accountBranch = self.paymentData().payeeDetails ? self.paymentData().payeeDetails.bankDetails : self.paymentData().payoutDetails.payeeDetails.bankDetails; }
            } else { bankDetailsPromise = Promise.resolve(); }

            if (self.shareMessage) {
                self.shareMessage(rootParams.baseModel.format(self.shareMessage(), {
                    amount: data.payoutDetails.instructionDetails ? rootParams.baseModel.formatCurrency(data.payoutDetails.instructionDetails.amount.amount, data.payoutDetails.instructionDetails.amount.currency) : rootParams.baseModel.formatCurrency(data.payoutDetails.amount.amount, data.payoutDetails.amount.currency),
                    transferTo: data.payoutDetails.instructionDetails ? data.payoutDetails.payeeDetails.nickName : data.payeeDetails.nickName,
                    valueDate: data.payoutDetails.instructionDetails ? data.payoutDetails.instructionDetails.startDate : data.payoutDetails.valueDate
                }));
            }

            let confirmScreenDetailsArray;

            setIntermediaryBankDetails();

            function chargesDetails(chargesRes) {
                if (chargesRes.enumRepresentations !== null) {
                    for (let i = 0; i < chargesRes.enumRepresentations[0].data.length; i++) {
                        if (self.charges() === chargesRes.enumRepresentations[0].data[i].code) {
                            self.chargesDescription(chargesRes.enumRepresentations[0].data[i].description);
                            break;
                        }
                    }
                }
            }

            Promise.all([
                bankDetailsPromise,
                internationalModel.getCharges(),
                intermediaryBankDetailsPromise,
                internationalModel.getRemarks()
            ]).then(function(response) {
                const bankDetailsRes = response[0],
                    chargesRes = response[1];

                     setNote(response[3]);

                if (bankDetailsRes) {
                    self.payeeDetails().accountBranch = {
                        code: bankDetailsRes.code,
                        name: bankDetailsRes.name,
                        branch: bankDetailsRes.branchName,
                        address: bankDetailsRes.branchAddress.line1,
                        city: bankDetailsRes.branchAddress.city,
                        country: bankDetailsRes.branchAddress.country
                    };
                }

                chargesDetails(chargesRes);

                if (response[2] && intermediaryBankNetwork && intermediaryBankNetwork !== "SPE") {
                    self.payeeDetails().intermediaryBankDetails = {
                        code: response[2].code,
                        name: response[2].name,
                        branch: response[2].branchName,
                        address: response[2].branchAddress.line1,
                        city: response[2].branchAddress.city,
                        country: response[2].branchAddress.country
                    };
                }
                else if (intermediaryBankNetwork && intermediaryBankNetwork === "SPE" && (rootParams.rootModel.params.mode !== "approval")) {
                    self.payeeDetails().intermediaryBankDetails = data.payoutDetails.instructionDetails ? data.payoutDetails.instructionDetails.intermediaryBankDetails : self.paymentData().payoutDetails.intermediaryBankDetails;

                }

                confirmScreenDetailsArray = [
                    [{
                            label: self.payments.moneytransfer.transferTo,
                            value: data.payoutDetails.instructionDetails ? data.payoutDetails.payeeDetails.nickName : data.payeeDetails.nickName
                        },
                        {
                            label: self.payments.moneytransfer.amount,
                            value: data.payoutDetails.instructionDetails ? data.payoutDetails.instructionDetails.amount.amount : data.payoutDetails.amount.amount,
                            currency: data.payoutDetails.instructionDetails ? data.payoutDetails.instructionDetails.amount.currency : data.payoutDetails.amount.currency,
                            isCurrency: true
                        }
                    ],
                    [{
                            label: self.payments ? self.payments.payee.accountNumber : self.payments.moneytransfer.accountNumber,
                            value: self.payeeDetails().accountNumber

                        },
                        {
                            label: self.payments ? self.payments.payee.accountType : self.payments.moneytransfer.accountType,
                            value: self.payments.payee.type.INTERNATIONAL
                        }
                    ],
                    [{
                            label: self.payments.payee.branchDetails,
                            value: [
                               self.payeeDetails().accountBranch.code,
                               self.payeeDetails().accountBranch.name,
                               self.payeeDetails().accountBranch.address
                            ]
                        },
                        {
                            label: self.payments.moneytransfer.paymentdetails,
                            value: data.payoutDetails.instructionDetails ? [data.payoutDetails.instructionDetails.otherDetails.line1, data.payoutDetails.instructionDetails.otherDetails.line2, data.payoutDetails.instructionDetails.otherDetails.line3, data.payoutDetails.instructionDetails.otherDetails.line4] : [data.payoutDetails.otherDetails.line1, data.payoutDetails.otherDetails.line2, data.payoutDetails.otherDetails.line3, data.payoutDetails.otherDetails.line4]
                        }
                    ],
                    [{
                            label: self.payments.moneytransfer.transferfrom,
                            value: data.payoutDetails.instructionDetails ? data.payoutDetails.instructionDetails.debitAccountId.displayValue : data.payoutDetails.debitAccountId.displayValue
                        },
                        {
                            label: self.payments.moneytransfer.transferon,
                            value: data.payoutDetails.instructionDetails ? data.payoutDetails.instructionDetails.startDate : data.payoutDetails.valueDate,
                            isDate: true
                        }
                    ]
                ].concat(data.payoutDetails && data.payoutDetails.dealId ? [
                    [{
                        label: self.payments.moneytransfer.dealNumber,
                        value: data.payoutDetails.dealId
                    }]
                ] : []).concat(data.payoutDetails.instructionDetails && data.payoutDetails.instructionDetails.dealId ? [
                    [{
                        label: self.payments.moneytransfer.dealNumber,
                        value: data.payoutDetails.instructionDetails.dealId
                    }]
                ] : []).concat(self.payeeDetails().payeeAddress ? [
                    [{
                        label: self.payments.moneytransfer.internationalPayee.payeeDetails,
                        value: [self.payeeDetails().payeeAddress.line1, self.payeeDetails().payeeAddress.line2, self.payeeDetails().payeeAddress.city, self.payeeDetails().payeeAddress.country]
                    }]
                ] : []).concat(self.payeeDetails().intermediaryBankDetails ? [
                    [{
                        label: self.payments.moneytransfer.internationalPayee.intermediatoryBankDetails,
                        value: intermediaryBankNetwork === "SPE" ? [self.payeeDetails().intermediaryBankDetails.name, self.payeeDetails().intermediaryBankDetails.address, self.payeeDetails().intermediaryBankDetails.city, self.payeeDetails().intermediaryBankDetails.country] : [self.payeeDetails().intermediaryBankDetails.code, self.payeeDetails().intermediaryBankDetails.name, self.payeeDetails().intermediaryBankDetails.city, self.payeeDetails().intermediaryBankDetails.country]
                    }]
                ] : []);

                if (typeof self.confirmScreenDetails === "function") { self.confirmScreenDetails(confirmScreenDetailsArray); } else if (self.confirmScreenExtensions) {
                    $.extend(self.confirmScreenExtensions, {
                        isSet: true,
                        eReceiptRequired: true,
                        taskCode: "PC_F_IT",
                        confirmScreenDetails: confirmScreenDetailsArray,
                        confirmScreenMsgEval: self.getConfirmScreenMsg,
                        confirmScreenStatusEval: self.getConfirmScreenStatus,
                        template: "confirm-screen/payments-template"
                    });
                }

                self.stageTwo(true);
            });
        }

        if (self.isMultiplePayment) {
            self.transferNow(rootParams.isTransferNow);
            responseHandler(rootParams.rootModel.params.data);
        } else {
            internationalModel.getPayoutData(self.paymentId(), "payouts", "international", self.transferNow()).done(function(data) {
                responseHandler(data);
            });
        }
    };
});