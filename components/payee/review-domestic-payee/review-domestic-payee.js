define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/domestic-payee",
    "ojL10n!resources/nls/bank-account-payee",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojbutton",
    "ojs/ojavatar"
], function(oj, ko, $, domesticPayeeModel, ResourceBundle, commonPayee) {
    "use strict";

    return function(Params) {
        const self = this;
        let confirmScreenDetailsArray;

        ko.utils.extend(self, Params.rootModel);

        self.payments = commonPayee.payments;
        self.payments.payee.domestic = ResourceBundle.payments.payee.domestic;
        self.payeeDetails = ko.observable();
        self.domesticPayeeType = ko.observable();
        self.dataLoaded = ko.observable(false);
        self.limitCurrency = ko.observable();
        self.preview = ko.observable();
        self.typeOfAccountDescription = ko.observable();
        self.fileId = ko.observable("input");
        self.target = ko.observable("target");
        self.avatarSize = ko.observable("md");
        self.paymentTypes = ko.observableArray();
        self.isPaymentTypesLoaded = ko.observable(false);
        self.fromAdhocTransferUpi = Params.rootModel.fromAdhocTransferUpi ? Params.rootModel.fromAdhocTransferUpi : ko.observable(false);

        if (self.params.reviewMode) {
            Params.dashboard.headerName(self.params.header);
        }

        self.confirmScreenDetails = Params.rootModel.confirmScreenDetails;

        self.getConfirmScreenMsg = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") { return self.payments.common.confirmScreen.approvalMessages.FAILED.successmsg; } else if (jqXHR.responseJSON.transactionAction) { return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg; }
        };

        self.getConfirmScreenStatus = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") { return self.payments.common.confirmScreen.approvalMessages.FAILED.statusmsg; } else if (jqXHR.responseJSON.transactionAction) { return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg; }
        };

        const configurationDetails = {};

        self.imageUploadFlag = ko.observable();

        function getPayeeMaintenance(data) {
            for (let k = 0; k < data.configurationDetails.length; k++) {
                configurationDetails[data.configurationDetails[k].propertyId] = data.configurationDetails[k].propertyValue;
            }

            if (Params.dashboard.appData.segment === "CORP") { self.imageUploadFlag(configurationDetails.CORPORATE_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0); } else { self.imageUploadFlag(configurationDetails.RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0); }
        }

        function loadImage(data) {
            if (data && data.contentDTOList[0]) {
                self.preview("data:image/gif;base64," + data.contentDTOList[0].content);
            }
        }

        function setTypeOfAccountDescription(data) {
            self.typeOfAccountDescription(ko.utils.arrayFirst(data.enumRepresentations[0].data, function(element) {
                return element.code === self.payeeDetails.indiaDomesticPayee.accountType;
            }).description);
        }

        const domType = {
            INDIA: "indiaDomesticPayee",
            UK: "ukDomesticPayee",
            SEPA: "sepaDomesticPayee"
        };

        self.transferObject = ko.observable();

        self.confirmPayee = function() {
            const currentServiceCall = !self.params.isEdit ? domesticPayeeModel.confirmPayee(self.params.payeeGroupId, self.params.payeeId, self.params.payeeType) : domesticPayeeModel.updatePayee(self.params.payeeGroupId, self.params.payeeId, self.params.payeeType, ko.toJSON(self.params.editPayeePayload));

            currentServiceCall.then(function(data) {
                self.httpStatus = data.getResponseStatus();

                let successMessage, statusMessages;

                if (Params.dashboard.appData.segment === "CORP" && self.httpStatus && self.httpStatus !== 202) {
                    successMessage = self.params.isEdit ? self.payments.payee.confirmScreen.updateSuccessMessage : self.payments.payee.confirmScreen.successMessage;
                    statusMessages = self.payments.common.completed;
                } else if (Params.dashboard.appData.segment === "CORP" && self.httpStatus && self.httpStatus === 202) {
                    successMessage = self.payments.payee.confirmScreen.corpMaker;
                    statusMessages = self.payments.payee.pendingApproval;
                } else if (Params.dashboard.appData.segment !== "CORP") {
                    successMessage = self.params.isEdit ? self.payments.payee.confirmScreen.updateSuccessMessage : self.payments.payee.confirmScreen.successMessage;
                    statusMessages = self.payments.common.success;
                }

                if (data.tokenAvailable) {
                    self.baseURL = "payments/payeeGroup/" + self.params.payeeGroupId + "/payees/" + self.params.payeeType + "/" + self.params.payeeId;
                } else {
                    self.transferObject({
                        id: self.params.payeeId,
                        isStandingInstruction: false,
                        payeeType: self.params.payeeType,
                        groupId: self.params.payeeGroupId,
                        name: self.params.payeeName,
                        preview: self.preview
                    });

                    Params.dashboard.loadComponent("confirm-screen", {
                        transactionResponse: data,
                        hostReferenceNumber: data.externalReferenceId,
                        setLimit: true,
                        transactionName: Params.dashboard.headerName(),
                        confirmScreenExtensions: {
                            successMessage: successMessage,
                            statusMessages: statusMessages,
                            isSet: true,
                            taskCode: !self.params.isEdit ? "PC_N_DOP" : "PC_N_UDOP",
                            confirmScreenDetails: confirmScreenDetailsArray,
                            template: "confirm-screen/payments-template",
                            makePayment: self.makePayment
                        },
                        pay: data.getResponseStatus() !== 202,
                        isEdit: self.params.isEdit,
                        payeeData: self.payeeDetails[domType[self.payeeDetails.domesticPayeeType]],
                        limitPackage: self.params.limitPackage,
                        payeeLimitsMap: self.params.payeeLimitsMap,
                        payeeAccountTypeList: self.params.payeeAccountTypeList,
                        imageUploadFlag: self.imageUploadFlag
                    });
                }
            });
        };

        Params.baseModel.registerComponent("payments-money-transfer", "payments");

        self.makePayment = function() {
            if (Params.dashboard.appData.segment === "CORP") {
                Params.dashboard.loadComponent("payments-money-transfer", {
                    transferDataPayee: self.transferObject()
                });
            } else {
                self.selectedTab = "";

                Params.dashboard.loadComponent("manage-accounts", {
                    applicationType: "payments",
                    defaultTab: "payments-money-transfer",
                    transferDataPayee: self.transferObject()
                });
            }
        };

        let bankDetailsPromise = Promise.resolve(),
            getPayeeDetailsPromise, payeeId;

        if (self.params.data) {
            ko.utils.extend(self.params.data, self.params.data.domesticPayee);
            payeeId = self.params.data.payeeId || (self.params.data.demandDraftPayeeDTO ? self.params.data.demandDraftPayeeDTO.id : null);
            getPayeeDetailsPromise = !self.params.data.domesticPayee ? domesticPayeeModel.getPayeeDetails(self.params.data.groupId, payeeId) : Promise.resolve({ domesticPayee: self.params.data.domesticPayee });
        } else {
            getPayeeDetailsPromise = !self.params.isEdit ? domesticPayeeModel.getPayeeDetails(self.params.payeeGroupId, self.params.payeeId) : Promise.resolve({ domesticPayee: ko.mapping.toJS(self.params.editPayeePayload) });
        }

        function getBankDetails(region, bankDetailsCode, network) {
            if (region === "INDIA") {
                bankDetailsPromise = domesticPayeeModel.getBankDetailsDCC(bankDetailsCode);
            } else if (region === "UK" && network === "SORT") {
                bankDetailsPromise = domesticPayeeModel.getBankDetailsNCC(region, bankDetailsCode);
            } else if (region === "SEPA" || (network === "SWIFT" && region === "UK")) {
                bankDetailsPromise = domesticPayeeModel.getBankDetails(bankDetailsCode);
            }
        }

        getPayeeDetailsPromise.then(function(data) {
            if (self.params.isEdit || (self.params.data && self.params.data.domesticPayee)) {
                const currentPayeeDetails = self.params.editPayeePayload || self.params.data.domesticPayee;

                ko.utils.extend(data.domesticPayee[domType[data.domesticPayee.domesticPayeeType]], ko.mapping.toJS(currentPayeeDetails[domType[currentPayeeDetails.domesticPayeeType]]));

                if (ko.utils.unwrapObservable(currentPayeeDetails[domType[currentPayeeDetails.domesticPayeeType]].contentId)) {
                    data.domesticPayee[domType[currentPayeeDetails.domesticPayeeType]].contentId = { value: currentPayeeDetails[domType[currentPayeeDetails.domesticPayeeType]].contentId instanceof Object ? currentPayeeDetails[domType[currentPayeeDetails.domesticPayeeType]].contentId.value : currentPayeeDetails[domType[currentPayeeDetails.domesticPayeeType]].contentId };
                } else {
                    data.domesticPayee[domType[currentPayeeDetails.domesticPayeeType]].contentId = null;
                }

                getBankDetails(currentPayeeDetails.domesticPayeeType, currentPayeeDetails[domType[currentPayeeDetails.domesticPayeeType]].bankDetails.code, currentPayeeDetails[domType[currentPayeeDetails.domesticPayeeType]].network);
            }

            self.domesticPayeeType(data.domesticPayee.domesticPayeeType);

            self.payeeDetails = data.domesticPayee;
            self.payeeDetails[domType[self.payeeDetails.domesticPayeeType]].initials = oj.IntlConverterUtils.getInitials(data.domesticPayee[domType[data.domesticPayee.domesticPayeeType]].nickName.split(/\s+/)[0], data.domesticPayee[domType[data.domesticPayee.domesticPayeeType]].nickName.split(/\s+/)[1]);
            self.payeeDetails[domType[self.payeeDetails.domesticPayeeType]].preview = self.preview;

            const previewImageMaintenancePromise = domesticPayeeModel.getPayeeMaintenance(),
                accountTypePromise = self.payeeDetails.domesticPayeeType === "INDIA" ? domesticPayeeModel.getPayeeAccountType(self.payeeDetails.domesticPayeeType) : Promise.resolve();
            let previewImagePromise, payeeGroupPromise;

            if (self.payeeDetails.domesticPayeeType === "INDIA") {
                previewImagePromise = self.payeeDetails.indiaDomesticPayee.contentId ? domesticPayeeModel.retrieveImage(self.payeeDetails.indiaDomesticPayee.contentId.value) : Promise.resolve();
                payeeGroupPromise = !self.payeeDetails.indiaDomesticPayee.contentId ? domesticPayeeModel.getGroupDetails(self.params.data ? self.params.data.groupId : self.params.payeeGroupId) : Promise.resolve();
            } else if (self.payeeDetails.domesticPayeeType === "SEPA") {
                previewImagePromise = self.payeeDetails.sepaDomesticPayee.contentId ? domesticPayeeModel.retrieveImage(self.payeeDetails.sepaDomesticPayee.contentId.value) : Promise.resolve();
                payeeGroupPromise = !self.payeeDetails.sepaDomesticPayee.contentId ? domesticPayeeModel.getGroupDetails(self.params.data ? self.params.data.groupId : self.params.payeeGroupId) : Promise.resolve();
            } else if (self.payeeDetails.domesticPayeeType === "UK") {
                domesticPayeeModel.getPaymentTypes(self.payeeDetails.domesticPayeeType).then(function(data) {
                    for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
                        self.paymentTypes.push({
                            text: data.enumRepresentations[0].data[i].description,
                            value: data.enumRepresentations[0].data[i].code
                        });
                    }

                    self.isPaymentTypesLoaded(true);
                });

                previewImagePromise = self.payeeDetails.ukDomesticPayee.contentId ? domesticPayeeModel.retrieveImage(self.payeeDetails.ukDomesticPayee.contentId.value) : Promise.resolve();
                payeeGroupPromise = !self.payeeDetails.ukDomesticPayee.contentId ? domesticPayeeModel.getGroupDetails(self.params.data ? self.params.data.groupId : self.params.payeeGroupId) : Promise.resolve();
            }

            Promise.all([
                previewImageMaintenancePromise,
                accountTypePromise,
                previewImagePromise,
                payeeGroupPromise,
                bankDetailsPromise
            ]).then(function(response) {
                if (self.payeeDetails.domesticPayeeType === "INDIA") { setTypeOfAccountDescription(response[1]); }

                if (response[2]) {
                    loadImage(response[2]);
                } else if (Params.dashboard.appData.segment !== "CORP" && response[3] && response[3].payeeGroup.contentId) {
                    domesticPayeeModel.retrieveImage(response[3].payeeGroup.contentId.value).then(function(response) {
                        loadImage(response);
                    });
                }

                getPayeeMaintenance(response[0]);

                if (response[4]) {
                    self.payeeDetails[domType[self.payeeDetails.domesticPayeeType]].bankDetails = {
                        code: response[4].code,
                        name: response[4].name,
                        branch: response[4].branchName,
                        address: response[4].branchAddress.line1,
                        city: response[4].branchAddress.city,
                        country: response[4].branchAddress.country
                    };
                }

                if (self.payeeDetails) {
                    self.payeeDetails[domType[self.payeeDetails.domesticPayeeType]].payeeType = "DOMESTIC";

                    self.setLimitClicked = ko.observable(false);
                    self.confirmPage = ko.observable(true);
                    self.setMonthlyLimitClicked = ko.observable(false);

                    self.payeeDetails[domType[self.payeeDetails.domesticPayeeType]].limitDetails = {
                        DAILY: {
                            isEffectiveFromTomorrow: false,
                            maxAmount: {
                                amount: ko.observable(),
                                currency: self.limitCurrency()
                            }
                        },
                        MONTHLY: {
                            isEffectiveFromTomorrow: false,
                            maxAmount: {
                                amount: ko.observable(),
                                currency: self.limitCurrency()
                            }
                        }
                    };
                }

                if (self.payeeDetails.domesticPayeeType === "INDIA") {
                    confirmScreenDetailsArray = [
                        [{
                                label: self.payments.payee.accounttype,
                                value: Params.baseModel.format(self.payments.payee.typeOfAccount, {
                                    payeeAccountType: self.payments.payee.accdomestic,
                                    accountType: self.typeOfAccountDescription()
                                })
                            },
                            {
                                label: self.payments.payee.accountnumber,
                                value: self.payeeDetails.indiaDomesticPayee.accountNumber
                            }
                        ],
                        [{
                                label: self.payments.payee.accountname,
                                value: self.payeeDetails.indiaDomesticPayee.accountName
                            },
                            {
                                label: self.payments.payee.labels.bnkdetails,
                                value: [
                                    self.payeeDetails.indiaDomesticPayee.bankDetails.code,
                                    self.payeeDetails.indiaDomesticPayee.bankDetails.name,
                                    self.payeeDetails.indiaDomesticPayee.bankDetails.address,
                                    self.payeeDetails.indiaDomesticPayee.bankDetails.city,
                                    self.payeeDetails.indiaDomesticPayee.bankDetails.country
                                ]
                            }
                        ]
                    ];
                } else if (self.payeeDetails.domesticPayeeType === "SEPA") {
                    confirmScreenDetailsArray = [
                        [{
                                label: self.payments.payee.accounttype,
                                value: self.payments.payee.accdomestic
                            },
                            {
                                label: self.payments.payee.accountnumber,
                                value: self.payeeDetails.sepaDomesticPayee.iban
                            }
                        ],
                        [{
                                label: self.payments.payee.accountname,
                                value: self.payeeDetails.sepaDomesticPayee.accountName
                            },
                            {
                                label: self.payments.payee.labels.bnkdetails,
                                value: [
                                    self.payeeDetails.sepaDomesticPayee.bankDetails.code,
                                    self.payeeDetails.sepaDomesticPayee.bankDetails.name,
                                    self.payeeDetails.sepaDomesticPayee.bankDetails.city,
                                    self.payeeDetails.sepaDomesticPayee.bankDetails.country
                                ]
                            }
                        ]
                    ];
                } else if (self.payeeDetails.domesticPayeeType === "UK") {
                    confirmScreenDetailsArray = [
                        [{
                                label: self.payments.payee.accounttype,
                                value: self.payments.payee.accdomestic
                            },
                            {
                                label: self.payments.payee.accountnumber,
                                value: self.payeeDetails.ukDomesticPayee.accountNumber
                            }
                        ],
                        [{
                                label: self.payments.payee.accountname,
                                value: self.payeeDetails.ukDomesticPayee.accountName
                            },
                            {
                                label: self.payments.payee.labels.bnkdetails,
                                value: [
                                    self.payeeDetails.ukDomesticPayee.bankDetails.code,
                                    self.payeeDetails.ukDomesticPayee.bankDetails.name,
                                    self.payeeDetails.ukDomesticPayee.bankDetails.city,
                                    self.payeeDetails.ukDomesticPayee.bankDetails.country
                                ]
                            }
                        ]
                    ];
                }

                if (typeof self.confirmScreenDetails === "function") { self.confirmScreenDetails(confirmScreenDetailsArray); } else if (self.confirmScreenExtensions) {
                    $.extend(self.confirmScreenExtensions, {
                        isSet: true,
                        confirmScreenDetails: confirmScreenDetailsArray,
                        confirmScreenMsgEval: self.getConfirmScreenMsg,
                        confirmScreenStatusEval: self.getConfirmScreenStatus,
                        template: "confirm-screen/payments-template"
                    });
                }

                self.dataLoaded(true);
            });
        });
    };
});