define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/payments-money-transfer",
    "ojs/ojknockout",
    "ojs/ojavatar"
], function (oj, ko, $, domesticModel, ResourceBundle) {
    "use strict";

    return function (rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.payments = ResourceBundle.payments;
        self.paymentData = self.paymentData || ko.observable();
        self.stageTwo = ko.observable(false);
        self.transferNow = ko.observable(true);
        self.frequencyDescription = ko.observable();
        self.purpose = ko.observable();
        self.purposeText = ko.observable();
        self.bankDetailsCode = ko.observable();
        self.isStandingInstruction = ko.observable();
        self.domesticPayeeType = ko.observable();
        self.paymentId = ko.observable();
        self.chargesList = ko.observable();
        self.chargesDescription = ko.observable();
        self.chargesData = ko.observable();
        self.chargesSum = ko.observable();
        self.serviceChargesLoaded = ko.observable(false);
        self.preview = ko.observable();
        self.initials = ko.observable();
        self.typeOfAccountDescription = ko.observable();
        self.ukNetworkType = ko.observable();

        if(rootParams.rootModel.payeeDetails!==undefined){
          self.payeeDetails=rootParams.rootModel.payeeDetails;
        }
        else{
       self.payeeDetails=rootParams.rootModel.params.retainedData? rootParams.rootModel.params.retainedData.payeeDetails :null;
        }

        if (rootParams.rootModel.params && rootParams.rootModel.params.retainedData &&
            rootParams.rootModel.params.retainedData.payeeDetails && rootParams.rootModel.params.retainedData.payeeDetails()) {
            self.prevPayeeDetails = ko.observable(rootParams.rootModel.params.retainedData.payeeDetails());
            self.payeeDetails().accountType = self.prevPayeeDetails().accountType;
            self.payeeDetails().accountNumber = self.prevPayeeDetails().accountNumber;
            self.payeeDetails().accountName = self.prevPayeeDetails().accountName;
        }

        if (rootParams.rootModel.params.transferData && rootParams.rootModel.params.transferData.reviewMode) {
            rootParams.dashboard.headerName(rootParams.rootModel.params.transferData.header);
        }

        if (rootParams.rootModel.params.retainedData !== undefined) {
            self.confirmScreenDetails = rootParams.rootModel.params.retainedData.confirmScreenDetails;
        } else {
            self.confirmScreenExtensions = rootParams.rootModel.params.confirmScreenExtensions;
        }

        self.payeeDetails = rootParams.rootModel.params.mode === "approval" ? ko.observable() : self.payeeDetails;
        self.instructionId = ko.observable(ko.utils.unwrapObservable(rootParams.rootModel.params.data ? rootParams.rootModel.params.data.instructionId : rootParams.rootModel.params.transferData.instructionId));

        if (self.instructionId()) {
            self.transferNow(false);
            self.paymentId(self.instructionId());
        } else if (rootParams.rootModel.params.data || rootParams.rootModel.params.transferData.paymentId) {
            self.paymentId(ko.utils.unwrapObservable(rootParams.rootModel.params.data ? rootParams.rootModel.params.data.paymentId : rootParams.rootModel.params.transferData.paymentId));
        }

        function purposeHandler(data) {
            if (data.purposeList !== null && data.purposeList.length > 0) {
                for (let i = 0; i < data.purposeList.length; i++) {
                    if (self.purpose() === data.purposeList[i].code) {
                        self.purposeText(data.purposeList[i].description);
                        break;
                    }
                }
            }
        }

        function setPreviewImage(data) {
            if (data && data.contentDTOList) {
                self.preview("data:image/gif;base64," + data.contentDTOList[0].content);
            }
        }

        self.imageUploadFlag = ko.observable();

        function getPayeeMaintenance(maintenanceResponse, payeeData, groupId, domesticPayeeType) {
            let propertyValue;

            if (rootParams.dashboard.appData.segment === "CORP") {
                propertyValue = ko.utils.arrayFirst(maintenanceResponse.configurationDetails, function (element) {
                    return element.propertyId === "CORPORATE_PAYEE_PHOTO_UPLOAD_ENABLED";
                }).propertyValue;
            } else {
                propertyValue = ko.utils.arrayFirst(maintenanceResponse.configurationDetails, function (element) {
                    return element.propertyId === "RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED";
                }).propertyValue;
            }

            if (propertyValue === "Y") {
                self.imageUploadFlag(true);
            } else {
                self.imageUploadFlag(false);
            }

            if (self.imageUploadFlag()) {
                const domType = {
                    INDIA: "indiaDomesticPayee",
                    UK: "ukDomesticPayee",
                    SEPA: "sepaDomesticPayee"
                }[domesticPayeeType];

                if (payeeData.domesticPayee[domType].contentId && payeeData.domesticPayee[domType].contentId.value) {
                    domesticModel.retrieveImage(payeeData.domesticPayee[domType].contentId.value).then(function (imageData) {
                        setPreviewImage(imageData);
                    });
                } else {
                    domesticModel.getGroupDetails(groupId).then(function (groupData) {
                        if (groupData.payeeGroup.contentId && groupData.payeeGroup.contentId.value) {
                            domesticModel.retrieveImage(groupData.payeeGroup.contentId.value).then(function (imageData) {
                                setPreviewImage(imageData);
                            });
                        }
                    });
                }
            }
        }

        self.getConfirmScreenMsg = function (jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") {
                return self.payments.common.confirmScreen.approvalMessages.FAILED.successmsg;
            } else if (jqXHR.responseJSON.transactionAction) {
                return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg;
            }
        };

        self.getConfirmScreenStatus = function (jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") {
                return self.payments.common.confirmScreen.approvalMessages.FAILED.statusmsg;
            } else if (jqXHR.responseJSON.transactionAction) {
                return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg;
            }
        };

        const paymentType = {
            UK: "UKDOMESTICFT",
            INDIA: "INDIADOMESTICFT",
            SEPA: "SEPADOMESTICFT"
        };

        function serviceCharges(urlParams) {
            if (urlParams.network !== "IMPS") {
                domesticModel.getServiceCharges(urlParams).then(function (chargesResponse) {
                    if (chargesResponse && chargesResponse.paymentChargeDetails && chargesResponse.paymentChargeDetails.length > 0) {
                        self.chargesData(chargesResponse.paymentChargeDetails);

                        let sum = 0,
                            j = 0;

                        for (j = 0; j < self.chargesData().length; j++) {
                            sum = sum + self.chargesData()[j].serviceCharge.amount;
                        }

                        self.chargesSum(sum);
                        self.serviceChargesLoaded(true);
                        self.stageTwo(true);
                    }
                });
            }
        }

        let bankDetailsPromise, purposePromise, chargesPromise, amount, transactionAmount, transactionCurrency, debitAccountId, networkType;

        function sepahandler(data) {
            if (!(data.payoutDetails.payeeDetails.domesticPayeeType === "SEPA")) {
                transactionAmount = data.payoutDetails.instructionDetails.amount.amount;
                transactionCurrency = data.payoutDetails.instructionDetails.amount.currency;
                debitAccountId = data.payoutDetails.instructionDetails.debitAccountId.value;
            } else {
                transactionAmount = data.payoutDetails.instructionDetails.sepaDomesticPayout.amount.amount;
                transactionCurrency = data.payoutDetails.instructionDetails.sepaDomesticPayout.amount.currency;
                debitAccountId = data.payoutDetails.instructionDetails.sepaDomesticPayout.debitAccountId.value;
            }
        }

        function setTypeOfAccountDescription(data, typeofAccount, domesticPayeeType) {
            if (domesticPayeeType === "INDIA") {
                self.typeOfAccountDescription(ko.utils.arrayFirst(data.enumRepresentations[0].data, function (element) {
                    return element.code === typeofAccount;
                }).description);
            }
        }

        function checkUKNework(data) {
            if (self.domesticPayeeType() === "UK") {
                if (data.payeeDetails) {
                    self.ukNetworkType(data.payeeDetails.ukDomesticPayee.paymentType);
                } else {
                    self.ukNetworkType(data.payoutDetails.payeeDetails.ukDomesticPayee.paymentType);
                }
            }
        }

        function responseHandler(data) {
            self.paymentData(data);

            const groupId = self.paymentData().payoutDetails.instructionDetails ? self.paymentData().payoutDetails.payeeDetails.groupId : self.paymentData().payeeDetails.groupId,
                payeeId = self.paymentData().payoutDetails.instructionDetails ? self.paymentData().payoutDetails.payeeDetails.id : self.paymentData().payeeDetails.id;

            domesticModel.getPayeeDetails(groupId, payeeId).then(function (payeeData) {
                const typeofAccount = payeeData.domesticPayee.domesticPayeeType === "INDIA" ? payeeData.domesticPayee.indiaDomesticPayee.accountType : null,
                    accountTypePromise = payeeData.domesticPayee.domesticPayeeType === "INDIA" ? domesticModel.getPayeeAccountType(payeeData.domesticPayee.domesticPayeeType) : Promise.resolve();

                self.initials(oj.IntlConverterUtils.getInitials(payeeData.domesticPayee[{
                    INDIA: "indiaDomesticPayee",
                    UK: "ukDomesticPayee",
                    SEPA: "sepaDomesticPayee"
                }[payeeData.domesticPayee.domesticPayeeType]].nickName.split(/\s+/)[0], payeeData.domesticPayee[{
                    INDIA: "indiaDomesticPayee",
                    UK: "ukDomesticPayee",
                    SEPA: "sepaDomesticPayee"
                }[payeeData.domesticPayee.domesticPayeeType]].nickName.split(/\s+/)[1]));

                Promise.all([
                    domesticModel.getPayeeMaintenance(),
                    accountTypePromise
                ]).then(function (imageData) {
                    setTypeOfAccountDescription(imageData[1], typeofAccount, payeeData.domesticPayee.domesticPayeeType);

                    if (self.transferNow()) {
                        self.domesticPayeeType(data.payeeDetails.domesticPayeeType);
                        self.purpose(data.payoutDetails.purpose);
                        amount = rootParams.baseModel.formatCurrency(data.payoutDetails.amount.amount, data.payoutDetails.amount.currency);
                        transactionAmount = data.payoutDetails.amount.amount;
                        transactionCurrency = data.payoutDetails.amount.currency;
                        debitAccountId = data.payoutDetails.debitAccountId.value;
                        networkType = data.payoutDetails.network;

                        if (self.purpose() === "OTH") {
                            self.purposeText(data.payoutDetails.purposeText);
                        }
                    } else {
                        self.isStandingInstruction(data.payoutDetails.instructionDetails.type === "REC");
                        self.domesticPayeeType(data.payoutDetails.payeeDetails.domesticPayeeType);
                        sepahandler(data);
                        networkType = data.payoutDetails.instructionDetails.network;

                        if (data.payoutDetails.payeeDetails.domesticPayeeType === "SEPA") {
                            self.purpose(data.payoutDetails.instructionDetails.sepaDomesticPayout.purpose);
                            amount = rootParams.baseModel.formatCurrency(data.payoutDetails.instructionDetails.sepaDomesticPayout.amount.amount, data.payoutDetails.instructionDetails.sepaDomesticPayout.amount.currency);
                            transactionAmount = data.payoutDetails.instructionDetails.sepaDomesticPayout.amount.amount;
                            transactionCurrency = data.payoutDetails.instructionDetails.sepaDomesticPayout.amount.currency;
                        } else {
                            self.purpose(data.payoutDetails.instructionDetails.purpose);
                            amount = rootParams.baseModel.formatCurrency(data.payoutDetails.instructionDetails.amount.amount, data.payoutDetails.instructionDetails.amount.currency);
                            transactionAmount = data.payoutDetails.instructionDetails.amount.amount;
                            transactionCurrency = data.payoutDetails.instructionDetails.amount.currency;
                        }

                        if (self.purpose() === "OTH") {
                            self.purposeText(data.payoutDetails.instructionDetails.sepaDomesticPayout ? data.payoutDetails.instructionDetails.sepaDomesticPayout.purposeText : data.payoutDetails.instructionDetails.purposeText);
                        }
                    }

                    if (self.domesticPayeeType() === "INDIA" && !self.isStandingInstruction()) {
                        domesticModel.getChargesMaintenances().then(function (maintenanceRespnse) {
                            let checkServiceChargesEnabled, s = 0;

                            if (rootParams.dashboard.appData.segment === "RETAIL") {
                                for (s = 0; s < maintenanceRespnse.configurationDetails.length; s++) {
                                    checkServiceChargesEnabled = ko.utils.arrayFirst(maintenanceRespnse.configurationDetails, function (config) {
                                        return config.propertyId === "RETAIL_SERVICE_CHARGES_ENABLED";
                                    }).propertyValue === "Y";
                                }
                            } else if (rootParams.dashboard.appData.segment === "CORP") {
                                for (s = 0; s < maintenanceRespnse.configurationDetails.length; s++) {
                                    checkServiceChargesEnabled = ko.utils.arrayFirst(maintenanceRespnse.configurationDetails, function (config) {
                                        return config.propertyId === "CORPORATE_SERVICE_CHARGES_ENABLED";
                                    }).propertyValue === "Y";
                                }
                            }

                            if (checkServiceChargesEnabled) {
                                serviceCharges({
                                    paymentType: paymentType[self.domesticPayeeType()],
                                    transactionAmount: transactionAmount,
                                    transactionCurrency: transactionCurrency,
                                    debitAccountId: debitAccountId,
                                    network: networkType
                                });
                            }
                        });
                    }

                    checkUKNework(data);

                    chargesPromise = self.domesticPayeeType() === "UK" ? domesticModel.getCharges() : Promise.resolve();

                    if (rootParams.rootModel.params.mode === "approval") {
                        let bankDetailsCode, network, region;

                        if (self.paymentData().payoutDetails.instructionDetails) {
                            if (self.paymentData().payoutDetails.payeeDetails.indiaDomesticPayee) {
                                bankDetailsCode = self.paymentData().payoutDetails.payeeDetails.indiaDomesticPayee.bankDetails.code;
                                region = "INDIA";

                                self.payeeDetails({
                                    typeofAccount: self.typeOfAccountDescription(),
                                    accountType: "DOMESTIC",
                                    accountNumber: self.paymentData().payoutDetails.payeeDetails.indiaDomesticPayee.accountNumber,
                                    accountName: self.paymentData().payoutDetails.payeeDetails.indiaDomesticPayee.accountName,
                                    accountBranch: self.paymentData().payoutDetails.payeeDetails.indiaDomesticPayee.accountBranch
                                });
                            } else if (self.paymentData().payoutDetails.payeeDetails.ukDomesticPayee) {
                                bankDetailsCode = self.paymentData().payoutDetails.payeeDetails.ukDomesticPayee.bankDetails.code;
                                region = "UK";

                                self.payeeDetails({
                                    typeofAccount: null,
                                    accountType: "DOMESTIC",
                                    accountNumber: self.paymentData().payoutDetails.payeeDetails.ukDomesticPayee.accountNumber,
                                    accountName: self.paymentData().payoutDetails.payeeDetails.ukDomesticPayee.accountName,
                                    accountBranch: self.paymentData().payoutDetails.payeeDetails.ukDomesticPayee.bankDetails
                                });
                            } else if (self.paymentData().payoutDetails.payeeDetails.sepaDomesticPayee) {
                                bankDetailsCode = self.paymentData().payoutDetails.payeeDetails.sepaDomesticPayee.bankDetails.code;
                                region = "SEPA";

                                self.payeeDetails({
                                    typeofAccount: null,
                                    accountType: "DOMESTIC",
                                    accountNumber: self.paymentData().payoutDetails.payeeDetails.sepaDomesticPayee.accountNumber,
                                    accountName: self.paymentData().payoutDetails.payeeDetails.sepaDomesticPayee.accountName,
                                    accountBranch: self.paymentData().payoutDetails.payeeDetails.sepaDomesticPayee.accountBranch
                                });
                            }
                        } else if (self.paymentData().payeeDetails.indiaDomesticPayee) {
                            bankDetailsCode = self.paymentData().payeeDetails.indiaDomesticPayee.bankDetails.code;
                            region = "INDIA";

                            self.payeeDetails({
                                typeofAccount: self.typeOfAccountDescription(),
                                accountType: "DOMESTIC",
                                accountNumber: self.paymentData().payeeDetails.indiaDomesticPayee.accountNumber,
                                accountName: self.paymentData().payeeDetails.indiaDomesticPayee.accountName,
                                accountBranch: self.paymentData().payeeDetails.indiaDomesticPayee.bankDetails
                            });
                        } else if (self.paymentData().payeeDetails.ukDomesticPayee) {
                            bankDetailsCode = self.paymentData().payeeDetails.ukDomesticPayee.bankDetails.code;
                            region = "UK";
                            network = self.paymentData().payeeDetails.ukDomesticPayee.network;

                            self.payeeDetails({
                                typeofAccount: null,
                                accountType: "DOMESTIC",
                                accountNumber: self.paymentData().payeeDetails.ukDomesticPayee.accountNumber,
                                accountName: self.paymentData().payeeDetails.ukDomesticPayee.accountName,
                                accountBranch: self.paymentData().payeeDetails.ukDomesticPayee.bankDetails
                            });
                        } else if (self.paymentData().payeeDetails.sepaDomesticPayee) {
                            bankDetailsCode = self.paymentData().payeeDetails.sepaDomesticPayee.bankDetails.code;
                            region = "SEPA";

                            self.payeeDetails({
                                typeofAccount: null,
                                accountType: "DOMESTIC",
                                accountNumber: self.paymentData().payeeDetails.sepaDomesticPayee.accountNumber,
                                accountName: self.paymentData().payeeDetails.sepaDomesticPayee.accountName,
                                accountBranch: self.paymentData().payeeDetails.sepaDomesticPayee.accountBranch
                            });
                        }

                        if (self.purpose() !== "OTH") {
                            purposePromise = domesticModel.getPurpose();
                        } else {
                            purposePromise = Promise.resolve();
                        }

                        if (region === "INDIA") {
                            bankDetailsPromise = domesticModel.getBankDetailsDCC(bankDetailsCode);
                        } else if (region === "UK" && network === "SORT") {
                            bankDetailsPromise = domesticModel.getBankDetailsNCC(region, bankDetailsCode);
                        } else if (region === "SEPA" || (network === "SWIFT" && region === "UK")) {
                            bankDetailsPromise = domesticModel.getBankDetails(bankDetailsCode);
                        }
                    } else {
                        bankDetailsPromise = Promise.resolve();
                    }

                    if (self.purpose() !== "OTH" && rootParams.rootModel.params.mode !== "approval") {
                        purposePromise = self.isMultiplePayment ? Promise.resolve(self.supportingData.purpose) : domesticModel.getPurpose();
                    }

                    if (self.shareMessage) {
                        self.shareMessage(rootParams.baseModel.format(self.shareMessage(), {
                            amount: amount,
                            transferTo: data.payoutDetails.instructionDetails ? data.payoutDetails.payeeDetails.nickName : data.payeeDetails.nickName,
                            valueDate: data.payoutDetails.instructionDetails ? data.payoutDetails.instructionDetails.startDate : data.payoutDetails.valueDate
                        }));
                    }

                    let confirmScreenDetailsArray;

                    Promise.all([
                        bankDetailsPromise,
                        purposePromise,
                        chargesPromise
                    ]).then(function (response) {
                        const bankDetailsResponse = response[0];

                        if (bankDetailsResponse) {
                            self.payeeDetails().accountBranch = {
                                code: bankDetailsResponse.code,
                                name: bankDetailsResponse.name,
                                branch: bankDetailsResponse.branchName,
                                address: bankDetailsResponse.branchAddress.line1,
                                city: bankDetailsResponse.branchAddress.city,
                                country: bankDetailsResponse.branchAddress.country
                            };
                        }

                        if (response[1]) {
                            purposeHandler(response[1]);
                        }

                        if (response[2]) {
                            self.chargesList(response[2].enumRepresentations[0].data);

                            let obj;

                            if (self.transferNow()) {
                                obj = ko.utils.arrayFirst(self.chargesList(), function (element) {
                                    return element.code === data.payoutDetails.charges;
                                });
                            } else {
                                obj = ko.utils.arrayFirst(self.chargesList(), function (element) {
                                    return element.code === data.payoutDetails.instructionDetails.charges;
                                });
                            }

                            self.chargesDescription(obj.description);
                        }

                        confirmScreenDetailsArray = [
                            [{
                                    label: self.payments.moneytransfer.transferTo,
                                    value: data.payoutDetails.instructionDetails ? data.payoutDetails.payeeDetails.nickName : data.payeeDetails.nickName
                                },
                                {
                                    label: self.payments.moneytransfer.amount,
                                    value: transactionAmount,
                                    currency: transactionCurrency,
                                    isCurrency: true
                                }
                            ],
                            [{
                                    label: self.payments ? self.payments.payee.accountNumber : self.payments.moneytransfer.accountNumber,
                                    value: self.payeeDetails().accountNumber
                                },
                                {
                                    label: self.payments ? self.payments.payee.accountType : self.payments.moneytransfer.accountType,
                                    value: self.domesticPayeeType() === "INDIA" ? rootParams.baseModel.format(self.payments.payee.typeOfAccount, {
                                        payeeAccountType: self.payments.payee.type[self.payeeDetails().accountType],
                                        accountType: self.typeOfAccountDescription ? self.typeOfAccountDescription() : self.payeeDetails().typeofAccount
                                    }) : self.payments.payee.type.DOMESTIC
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
                                    label: self.payments.moneytransfer.transferfrom,
                                    value: data.payoutDetails.instructionDetails ? data.payoutDetails.instructionDetails.sepaDomesticPayout ? data.payoutDetails.instructionDetails.sepaDomesticPayout.debitAccountId.displayValue : data.payoutDetails.instructionDetails.debitAccountId.displayValue : data.payoutDetails.debitAccountId.displayValue
                                }
                            ]
                        ].concat(self.isStandingInstruction() ? [
                            [{
                                    label: self.payments.moneytransfer.startTransfer,
                                    value: data.payoutDetails.instructionDetails ? data.payoutDetails.instructionDetails.startDate : data.payoutDetails.valueDate,
                                    isDate: true
                                },
                                {
                                    label: self.payments.moneytransfer.stopTransfer,
                                    value: data.payoutDetails.instructionDetails.endDate,
                                    isDate: true
                                }
                            ]
                        ] : []).concat(self.isStandingInstruction() ? [
                            [{
                                label: self.payments.moneytransfer.frequency,
                                value: self.payments.common.frequency[data.payoutDetails.instructionDetails.frequency]
                            }]
                        ] : [
                            [{
                                label: self.payments.moneytransfer.transferon,
                                value: data.payoutDetails.instructionDetails ? data.payoutDetails.instructionDetails.startDate : data.payoutDetails.valueDate,
                                isDate: true
                            }]
                        ]).concat(self.domesticPayeeType() === "INDIA" ? [
                            [{
                                label: self.payments.moneytransfer.payVia,
                                value: self.network ? self.network() : data.payoutDetails.network
                            }]
                        ] : []).concat(self.domesticPayeeType() === "UK" && self.ukNetworkType() === "URG" ? [
                            [{
                                label: self.payments.moneytransfer.paymentdetails,
                                value: data.payoutDetails.instructionDetails ? [data.payoutDetails.instructionDetails.otherDetails.line1, data.payoutDetails.instructionDetails.otherDetails.line2, data.payoutDetails.instructionDetails.otherDetails.line3, data.payoutDetails.instructionDetails.otherDetails.line4] : [data.payoutDetails.otherDetails.line1, data.payoutDetails.otherDetails.line2, data.payoutDetails.otherDetails.line3, data.payoutDetails.otherDetails.line4]
                            }]
                        ] : []);

                        if (typeof self.confirmScreenDetails === "function") {
                            self.confirmScreenDetails(confirmScreenDetailsArray);
                        } else if (self.confirmScreenExtensions) {
                            $.extend(self.confirmScreenExtensions, {
                                isSet: true,
                                eReceiptRequired: true,
                                taskCode: "PC_F_DOM",
                                confirmScreenDetails: confirmScreenDetailsArray,
                                confirmScreenMsgEval: self.getConfirmScreenMsg,
                                confirmScreenStatusEval: self.getConfirmScreenStatus,
                                template: "confirm-screen/payments-template"
                            });
                        }

                        self.stageTwo(true);
                        getPayeeMaintenance(imageData[0], payeeData, groupId, self.domesticPayeeType());
                    });
                });
            });

        }

        self.getFrequencyDescription = function () {
            domesticModel.getFrequencyDesc().done(function (data) {
                if (data.enumRepresentations !== null) {
                    for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
                        if (self.paymentData().payoutDetails.instructionDetails.frequency === data.enumRepresentations[0].data[i].code) {
                            self.frequencyDescription(self.payments.moneytransfer.frequencyLabel[data.enumRepresentations[0].data[i].description]);
                            self.isStandingInstruction(true);
                            break;
                        }
                    }
                }
            });
        };

        if (self.isMultiplePayment) {
            self.transferNow(rootParams.isTransferNow);
            responseHandler(rootParams.rootModel.params.data);
        } else {
            domesticModel.getTransferData(self.paymentId(), "payouts", "domestic", self.transferNow()).then(function (data) {
                responseHandler(data);
            });
        }
    };
});