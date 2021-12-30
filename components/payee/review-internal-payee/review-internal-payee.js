define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/internal-payee",
    "ojL10n!resources/nls/bank-account-payee",
    "ojs/ojknockout",
    "ojs/ojavatar"
], function(oj, ko, $, reviewInternalPayeeModel, ResourceBundle, commonPayee) {
    "use strict";

    return function(Params) {
        const self = this;

        ko.utils.extend(self, Params.rootModel);

        self.name = ko.observable();
        self.accountNumber = ko.observable();
        self.accountName = ko.observable();
        self.dataLoaded = ko.observable(false);
        self.validationTracker = Params.validator;
        self.payments = commonPayee.payments;
        self.limitCurrency = ko.observable();
        self.payments.payee.internal = ResourceBundle.payments.payee.internal;
        self.payeeDetails = ko.observable();
        self.branchName = ko.observable();
        self.preview = ko.observable();
        self.fileId = ko.observable("input");
        self.target = ko.observable("target");
        self.avatarSize = ko.observable("md");
        self.confirmScreenDetails = Params.rootModel.confirmScreenDetails;

        if (self.params.reviewMode) {
            Params.dashboard.headerName(self.params.header);
        }

        Params.baseModel.registerElement([
            "internal-account-input"
        ]);

        self.getConfirmScreenMsg = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") { return self.payments.common.confirmScreen.approvalMessages.FAILED.successmsg; } else if (jqXHR.responseJSON.transactionAction) { return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg; }
        };

        self.getConfirmScreenStatus = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") { return self.payments.common.confirmScreen.approvalMessages.FAILED.statusmsg; } else if (jqXHR.responseJSON.transactionAction) { return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg; }
        };

        let confirmScreenDetailsArray = [];

        function postReadDetails() {
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
                        value: self.payments.payee.accinternal
                    },
                    {
                        label: self.payments.payee.accountname,
                        value: self.payeeDetails.accountName
                    },
                    {
                        label: self.payments.payee.accountnickname,
                        value: self.payeeDetails.nickName
                    }
                ],
                [
                    {
                        label: self.payments.payee.accountnumber,
                        value: self.payeeDetails.accountNumber,
                        isInternalAccNo: true
                    }
                ]
            ];

            if (typeof self.confirmScreenDetails === "function") {
                self.confirmScreenDetails(confirmScreenDetailsArray);
            } else if (self.confirmScreenExtensions) {
                $.extend(self.confirmScreenExtensions, {
                    isSet: true,
                    confirmScreenDetails: confirmScreenDetailsArray,
                    confirmScreenMsgEval: self.getConfirmScreenMsg,
                    confirmScreenStatusEval: self.getConfirmScreenStatus,
                    template: "confirm-screen/payments-template"
                });
            }

            self.dataLoaded(true);
        }

        self.transferObject = ko.observable();

        self.confirmPayee = function() {
            const currentServiceCall = !self.params.isEdit ? reviewInternalPayeeModel.confirmPayee(self.params.payeeGroupId, self.params.payeeId, self.params.payeeType) : reviewInternalPayeeModel.updatePayee(self.params.payeeGroupId, self.params.payeeId, self.params.payeeType, ko.toJSON(self.params.editPayeePayload));

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
                            taskCode: !self.params.isEdit ? "PC_N_CIP" : "PC_N_UIP",
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

        self.imageUploadFlag = ko.observable();

        function loadImage(contentId) {
            reviewInternalPayeeModel.retrieveImage(contentId).then(function(data) {
                if (data && data.contentDTOList[0]) {
                    self.preview("data:image/gif;base64," + data.contentDTOList[0].content);
                    $("#" + self.target()).attr("src", self.preview());
                }
            });
        }

        let getPayeeDetailsPromise, payeeId;

        if (self.params.data) {
            ko.utils.extend(self.params.data, self.params.data.internalPayee);
            payeeId = self.params.data.payeeId || (self.params.data.demandDraftPayeeDTO ? self.params.data.demandDraftPayeeDTO.id : null);
            getPayeeDetailsPromise = !self.params.data.internalPayee ? reviewInternalPayeeModel.getPayeeDetails(self.params.data.groupId, payeeId) : Promise.resolve({internalPayee : self.params.data.internalPayee});
        } else {
            getPayeeDetailsPromise = !self.params.isEdit ? reviewInternalPayeeModel.getPayeeDetails(self.params.payeeGroupId, self.params.payeeId) : Promise.resolve({internalPayee : ko.mapping.toJS(self.params.editPayeePayload)});
        }

        getPayeeDetailsPromise.then(function(data) {
            if (self.params.isEdit || (self.params.data && self.params.data.internalPayee)) {
                const currentPayeeDetails = self.params.editPayeePayload || self.params.data.internalPayee;

                ko.utils.extend(data.internalPayee, ko.mapping.toJS(currentPayeeDetails));

                if (ko.utils.unwrapObservable(currentPayeeDetails.contentId)) {
                    data.internalPayee.contentId = {value: currentPayeeDetails.contentId instanceof Object ? currentPayeeDetails.contentId.value : currentPayeeDetails.contentId};
                } else {
                    data.internalPayee.contentId = null;
                }
            }

            self.payeeDetails = data.internalPayee;
            self.payeeDetails.initials = oj.IntlConverterUtils.getInitials(self.payeeDetails.nickName.split(/\s+/)[0], self.payeeDetails.nickName.split(/\s+/)[1]);
            self.payeeDetails.preview = self.preview;

            reviewInternalPayeeModel.getPayeeMaintenance().then(function(data) {
                const configurationDetails = {};

                for (let k = 0; k < data.configurationDetails.length; k++) {
                    configurationDetails[data.configurationDetails[k].propertyId] = data.configurationDetails[k].propertyValue;
                }

                if (Params.dashboard.appData.segment === "CORP") { self.imageUploadFlag(configurationDetails.CORPORATE_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0); } else { self.imageUploadFlag(configurationDetails.RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0); }

                if (self.payeeDetails.contentId) {
                    loadImage(self.payeeDetails.contentId.value);
                } else {
                    reviewInternalPayeeModel.getGroupDetails(self.params.data ? self.params.data.groupId : self.params.payeeGroupId).then(function(response) {
                        if (Params.dashboard.appData.segment !== "CORP" && response && response.payeeGroup.contentId) {
                            loadImage(response.payeeGroup.contentId.value);
                        }

                    });
                }

                postReadDetails();
            });
        });
    };
});