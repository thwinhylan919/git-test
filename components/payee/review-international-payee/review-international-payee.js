define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/international-payee",
    "ojL10n!resources/nls/bank-account-payee",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojbutton",
    "ojs/ojavatar"
], function(oj, ko, $, internationalPayeeModel, ResourceBundle, commonPayee) {
    "use strict";

    return function(Params) {
        const self = this;

        ko.utils.extend(self, Params.rootModel);

        self.payments = commonPayee.payments;
        self.payments.payee.international = ResourceBundle.payments.payee.international;

        if (self.params.reviewMode) {
            Params.dashboard.headerName(self.params.header);
        }

        self.payeeDetails = ko.observable();
        self.dataLoaded = ko.observable(false);
        self.network = ko.observable();
        self.limitCurrency = ko.observable();
        self.preview = ko.observable();
        self.fileId = ko.observable("input");
        self.target = ko.observable("target");
        self.avatarSize = ko.observable("md");
        self.countriesMap = {};
        self.payeeCountryDescription = ko.observable();

        let confirmScreenDetailsArray = [];

        self.getConfirmScreenMsg = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") { return self.payments.common.confirmScreen.approvalMessages.FAILED.successmsg; } else if (jqXHR.responseJSON.transactionAction) { return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg; }
        };

        self.getConfirmScreenStatus = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") { return self.payments.common.confirmScreen.approvalMessages.FAILED.statusmsg; } else if (jqXHR.responseJSON.transactionAction) { return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg; }
        };

        self.imageUploadFlag = ko.observable();

        function getPayeeMaintenance(data) {
            const configurationDetails = {};

            for (let k = 0; k < data.configurationDetails.length; k++) {
                configurationDetails[data.configurationDetails[k].propertyId] = data.configurationDetails[k].propertyValue;
            }

            if (Params.dashboard.appData.segment === "CORP") { self.imageUploadFlag(configurationDetails.CORPORATE_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0); } else { self.imageUploadFlag(configurationDetails.RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0); }
        }

        function loadImage(data) {
            if (data && data.contentDTOList[0]) {
                self.preview("data:image/gif;base64," + data.contentDTOList[0].content);
                $("#" + self.target()).attr("src", self.preview());
            }
        }

        function setCountryMap(data) {
            for (let j = 0; j < data.enumRepresentations[0].data.length; j++) {
                self.countriesMap[data.enumRepresentations[0].data[j].code] = data.enumRepresentations[0].data[j].description;
            }
        }

        self.transferObject = ko.observable();

        self.confirmPayee = function() {
            const currentServiceCall = !self.params.isEdit ? internationalPayeeModel.confirmPayee(self.params.payeeGroupId, self.params.payeeId, self.params.payeeType) : internationalPayeeModel.updatePayee(self.params.payeeGroupId, self.params.payeeId, self.params.payeeType, ko.toJSON(self.params.editPayeePayload));

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
                            taskCode: !self.params.isEdit ? "PC_N_CITNP" : "PC_N_UITNP",
                            confirmScreenDetails: confirmScreenDetailsArray,
                            template: "confirm-screen/payments-template",
                            makePayment: self.makePayment
                        },
                        pay: data.getResponseStatus() !== 202,
                        isEdit: self.params.isEdit,
                        payeeData: self.payeeDetails,
                        limitPackage: self.params.limitPackage,
                        payeeLimitsMap: self.params.payeeLimitsMap,
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
            ko.utils.extend(self.params.data, self.params.data.internationalPayee);
            payeeId = self.params.data.payeeId || (self.params.data.demandDraftPayeeDTO ? self.params.data.demandDraftPayeeDTO.id : null);
            getPayeeDetailsPromise = !self.params.data.internationalPayee ? internationalPayeeModel.getPayeeDetails(self.params.data.groupId, payeeId) : Promise.resolve({ internationalPayee: self.params.data.internationalPayee });
        } else {
            getPayeeDetailsPromise = !self.params.isEdit ? internationalPayeeModel.getPayeeDetails(self.params.payeeGroupId, self.params.payeeId) : Promise.resolve({ internationalPayee: ko.mapping.toJS(self.params.editPayeePayload) });
        }

        function getBankDetails(bankDetailsCode, network) {
            if (network === "SWI") {
                bankDetailsPromise = internationalPayeeModel.getBankDetailsBIC(bankDetailsCode);
            } else if (network === "NAC") {
                bankDetailsPromise = internationalPayeeModel.getBankDetailsNCC(bankDetailsCode);
            }
        }

        getPayeeDetailsPromise.then(function(data) {
            if (self.params.isEdit || (self.params.data && self.params.data.internationalPayee)) {
                const currentPayeeDetails = self.params.editPayeePayload || self.params.data.internationalPayee;

                ko.utils.extend(data.internationalPayee, ko.mapping.toJS(currentPayeeDetails));

                if (ko.utils.unwrapObservable(currentPayeeDetails.contentId)) {
                    data.internationalPayee.contentId = { value: currentPayeeDetails.contentId instanceof Object ? currentPayeeDetails.contentId.value : currentPayeeDetails.contentId };
                } else {
                    data.internationalPayee.contentId = null;
                }

                getBankDetails(currentPayeeDetails.bankDetails.code, currentPayeeDetails.network);
            }

            self.payeeDetails = data.internationalPayee;
            self.payeeDetails.initials = oj.IntlConverterUtils.getInitials(self.payeeDetails.nickName.split(/\s+/)[0], self.payeeDetails.nickName.split(/\s+/)[1]);
            self.payeeDetails.preview = self.preview;

            if (!self.payeeDetails.address) {
                self.payeeDetails.address = {};
            }

            self.network(self.payeeDetails.network);

            const previewImageMaintenancePromise = internationalPayeeModel.getPayeeMaintenance(),
                previewImagePromise = self.payeeDetails.contentId ? internationalPayeeModel.retrieveImage(self.payeeDetails.contentId.value) : Promise.resolve(),
                payeeGroupPromise = !self.payeeDetails.contentId ? internationalPayeeModel.getGroupDetails(self.params.data ? self.params.data.groupId : self.params.payeeGroupId) : Promise.resolve();

            Promise.all([
                previewImageMaintenancePromise,
                previewImagePromise,
                payeeGroupPromise,
                internationalPayeeModel.getCountries(),
                bankDetailsPromise
            ]).then(function(response) {
                if (self.payeeDetails.contentId) {
                    loadImage(response[1]);
                } else if (Params.dashboard.appData.segment !== "CORP" && response[2] && response[2].payeeGroup.contentId) {
                    internationalPayeeModel.retrieveImage(response[2].payeeGroup.contentId.value).then(function(response) {
                        loadImage(response);
                    });
                }

                setCountryMap(response[3]);

                getPayeeMaintenance(response[0]);

                if (response[4]) {
                    self.payeeDetails.bankDetails = {
                        code: response[4].code,
                        name: response[4].name,
                        branch: response[4].branchName,
                        address: response[4].branchAddress.line1,
                        city: response[4].branchAddress.city,
                        country: response[4].branchAddress.country
                    };
                }

                self.payeeDetails.network = self.network;

                if (self.payeeDetails.address && self.payeeDetails.address.country) {
                    self.payeeCountryDescription(self.countriesMap[self.payeeDetails.address.country]);
                }

                if (self.payeeDetails) {
                    self.setLimitClicked = ko.observable(false);
                    self.setMonthlyLimitClicked = ko.observable(false);

                    self.payeeDetails.limitDetails = {
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

                confirmScreenDetailsArray = [
                    [{
                            label: self.payments.payee.accounttype,
                            value: self.payments.payee.accinternational
                        },
                        {
                            label: self.payments.payee.accountname,
                            value: self.payeeDetails.accountName
                        }
                    ],
                    [{
                            label: self.payments.payee.accountnumber,
                            value: self.payeeDetails.accountNumber
                        },
                        {
                            label: self.payments.payee.labels.bnkdetails,
                            value: [
                                self.payeeDetails.bankDetails.code,
                                self.payeeDetails.bankDetails.name,
                                self.payeeDetails.bankDetails.address,
                                self.payeeDetails.bankDetails.city,
                                self.countriesMap[self.payeeDetails.bankDetails.country] ? self.countriesMap[self.payeeDetails.bankDetails.country] : self.payeeDetails.bankDetails.country
                            ]
                        }
                    ]
                ].concat(self.payeeDetails.address && (self.payeeDetails.address.line1 || self.payeeDetails.address.line2 || self.payeeDetails.address.city || self.payeeDetails.address.country) ? [
                    [{
                        label: self.payments.payee.international.payeeDetails,
                        value: [self.payeeDetails.address.line1, self.payeeDetails.address.line2, self.payeeDetails.address.city, self.payeeCountryDescription()]
                    }]
                ] : []);

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