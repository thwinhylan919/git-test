define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/demand-draft-payee",
    "ojL10n!resources/nls/domestic-demand-draft-payee",
    "ojL10n!resources/nls/international-demand-draft-payee",
    "ojs/ojknockout",
    "ojs/ojbutton",
    "ojs/ojavatar"
], function(oj, ko, $, DDPayeeModel, CommonPayee, DomesticResourceBundle, InternationalResourceBundle) {
    "use strict";

    return function(Params) {
        const self = this,
            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(DDPayeeModel.getNewModel());

                return KoModel;
            };
        let confirmScreenDetailsArrayDomestic, confirmScreenDetailsArrayInternational;

        self.addressDetails = getNewKoModel().addressDetails;
        ko.utils.extend(self, Params.rootModel);

        self.payeeType = ko.observable();
        self.selectedCountry = ko.observable();
        self.dataLoaded = ko.observable(false);
        self.name = ko.observable();
        self.nickName = ko.observable();
        self.payAtCity = ko.observable();
        self.deliveryMode = ko.observable();
        self.limitCurrency = ko.observable();
        self.payments = CommonPayee.payments;
        self.common = CommonPayee.payments.common;
        self.preview = ko.observable();
        self.fileId = ko.observable("input");
        self.target = ko.observable("target");
        self.avatarSize = ko.observable("md");
        self.payments.payee.international = InternationalResourceBundle.payments.payee.international;
        self.payments.payee.domestic = DomesticResourceBundle.payments.payee.domestic;
        self.transferObject = ko.observable({});

        if (self.params.reviewMode) {
            Params.dashboard.headerName(self.params.header);
        }

        self.domesticpayments = {};
        self.domestic = {};
        self.international = {};

        self.getConfirmScreenMsg = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") { return self.payments.common.confirmScreen.approvalMessages.FAILED.successmsg; } else if (jqXHR.responseJSON.transactionAction) { return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg; }
        };

        self.getConfirmScreenStatus = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") { return self.payments.common.confirmScreen.approvalMessages.FAILED.statusmsg; } else if (jqXHR.responseJSON.transactionAction) { return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg; }
        };

        function loadImage(data) {
            if (data && data.contentDTOList) {
                self.preview("data:image/gif;base64," + data.contentDTOList[0].content);
            }
        }

        self.imageUploadFlag = ko.observable();

        function getPayeeMaintenance(data) {
            const configurationDetails = {};

            for (let k = 0; k < data.configurationDetails.length; k++) {
                configurationDetails[data.configurationDetails[k].propertyId] = data.configurationDetails[k].propertyValue;
            }

            if (Params.dashboard.appData.segment === "CORP") { self.imageUploadFlag(configurationDetails.CORPORATE_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0); } else { self.imageUploadFlag(configurationDetails.RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0); }
        }

        let getPayeeDetailsPromise, payeeId, groupId;

        if (self.params.data) {
            ko.utils.extend(self.params.data, self.params.data.demandDraftPayeeDTO);
            payeeId = self.params.data.payeeId || (self.params.data.demandDraftPayeeDTO ? self.params.data.demandDraftPayeeDTO.id : null);
            groupId = self.params.data.groupId || (self.params.data.demandDraftPayeeDTO ? self.params.data.demandDraftPayeeDTO.groupId : null);
            getPayeeDetailsPromise = !self.params.data.demandDraftPayeeDTO || (self.params.taskCode === "PC_N_DDDP") ? DDPayeeModel.getPayeeDetails(groupId, payeeId) : Promise.resolve({demandDraftPayeeDTO : self.params.data.demandDraftPayeeDTO});
        } else {
            getPayeeDetailsPromise = !self.params.isEdit ? DDPayeeModel.getPayeeDetails(self.params.payeeGroupId, self.params.payeeId) : Promise.resolve({demandDraftPayeeDTO : ko.mapping.toJS(self.params.editPayeePayload)});
        }

        getPayeeDetailsPromise.then(function(data) {
            self.payeeType(data.demandDraftPayeeDTO.demandDraftPayeeType);

            if ((self.params.isEdit || (self.params.data && self.params.data.demandDraftPayeeDTO)) && self.params.taskCode !== "PC_N_DDDP") {
                const currentPayeeDetails = self.params.editPayeePayload || self.params.data.demandDraftPayeeDTO;

                ko.utils.extend(data.demandDraftPayeeDTO, ko.mapping.toJS(currentPayeeDetails));

                if (ko.utils.unwrapObservable(currentPayeeDetails.contentId)) {
                    data.demandDraftPayeeDTO.contentId = {value: currentPayeeDetails.contentId instanceof Object ? currentPayeeDetails.contentId.value : currentPayeeDetails.contentId};
                } else {
                    data.demandDraftPayeeDTO.contentId = null;
                }
            }

            self.payeeDetails = data.demandDraftPayeeDTO;
            self.payeeDetails.initials = oj.IntlConverterUtils.getInitials(self.payeeDetails.nickName.split(/\s+/)[0], self.payeeDetails.nickName.split(/\s+/)[1]);
            self.payeeDetails.preview = self.preview;

            const previewImageMaintenancePromise = DDPayeeModel.getPayeeMaintenance(),
                previewImagePromise = data.demandDraftPayeeDTO.contentId ? DDPayeeModel.retrieveImage(data.demandDraftPayeeDTO.contentId.value) : Promise.resolve(),
                payeeGroupPromise = !data.demandDraftPayeeDTO.contentId ? DDPayeeModel.getGroupDetails(self.params.data ? self.params.data.groupId : self.params.payeeGroupId) : Promise.resolve();

            Promise.all([
                previewImageMaintenancePromise,
                previewImagePromise,
                payeeGroupPromise
            ]).then(function(response) {
                if (self.payeeDetails.contentId) {
                    loadImage(response[1]);
                } else if (Params.dashboard.appData.segment !== "CORP" && response[2] && response[2].payeeGroup.contentId) {
                    DDPayeeModel.retrieveImage(response[2].payeeGroup.contentId.value).then(function(response) {
                        loadImage(response);
                    });
                }

                getPayeeMaintenance(response[0]);

                if (self.payeeType() === "DOM") {
                    self.domestic = data.demandDraftPayeeDTO;
                    self.deliveryMode(self.domestic.demandDraftDeliveryDTO.deliveryMode);
                    self.domestic.name = ko.observable(self.domestic.name);
                    self.domestic.nickName = ko.observable(self.domestic.nickName);
                    self.domestic.payAtCity = ko.observable(self.domestic.payAtCity);
                    self.domestic.demandDraftDeliveryDTO.deliveryMode = self.deliveryMode();
                    self.payeeAccessType = ko.utils.unwrapObservable(data.demandDraftPayeeDTO.shared);

                    if (self.domestic.demandDraftDeliveryDTO.deliveryMode === "BRN") {
                        self.getBranchDetails(self.domestic.demandDraftDeliveryDTO.branch);
                    } else if (self.domestic.demandDraftDeliveryDTO.deliveryMode === "MAI") {
                        self.getPartyAddress(self.domestic.demandDraftDeliveryDTO.addressType);
                    } else if (self.domestic.demandDraftDeliveryDTO.deliveryMode === "OTHADD") {
                        self.addressDetails.postalAddress = data.demandDraftPayeeDTO.address;
                        self.dataLoaded(true);
                    } else {
                        self.dataLoaded(true);
                    }

                    if (self.payeeDetails) {
                        self.payeeDetails.nickName = self.domestic.nickName;
                        self.payeeDetails.name = self.domestic.name;
                        self.payeeDetails.id = self.domestic.id;
                        self.payeeDetails.payeeType = "DEMANDDRAFT";
                        self.payeeDetails.demandDraftPayeeType = "DOM";
                        self.payeeDetails.payAtCity = self.domestic.payAtCity;
                        self.payeeDetails.demandDraftDeliveryDTO = self.domestic.demandDraftDeliveryDTO;
                        self.payeeDetails.demandDraftDeliveryDTO.deliveryMode = self.domestic.demandDraftDeliveryDTO.deliveryMode;

                        if (self.payeeDetails.demandDraftDeliveryDTO.deliveryMode === "BRN") {
                            self.getBranchDetails(self.domestic.demandDraftDeliveryDTO.branch);
                        } else if (self.payeeDetails.demandDraftDeliveryDTO.deliveryMode === "MAI") {
                            self.getPartyAddress(self.domestic.demandDraftDeliveryDTO.addressType);
                        }else if(self.payeeDetails.demandDraftDeliveryDTO.deliveryMode === "OTHADD"){
                            self.payeeDetails.postalAddress = self.addressDetails;
                            self.dataLoaded(true);
                        }
                        else {
                            self.dataLoaded(true);
                        }

                        self.setLimitClicked = ko.observable(false);
                        self.confirmPage = ko.observable(true);
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

                    confirmScreenDetailsArrayDomestic = [
                        [{
                                label: self.payments.payee.domestic.drafttype,
                                value: self.payments.payee.accdomestic
                            },
                            {
                                label: self.payments.payee.domestic.draftfavouring,
                                value: self.domestic.nickName
                            }
                        ],
                        [{
                            label: self.payments.payee.domestic.draftpayableatcity,
                            value: self.domestic.payAtCity
                        }]
                    ];

                    if (self.confirmScreenExtensions) {
                        $.extend(self.confirmScreenExtensions, {
                            isSet: true,
                            confirmScreenDetails: confirmScreenDetailsArrayDomestic,
                            confirmScreenMsgEval: self.getConfirmScreenMsg,
                            confirmScreenStatusEval: self.getConfirmScreenStatus,
                            template: "confirm-screen/payments-template"
                        });
                    }
                } else {
                    self.international = data.demandDraftPayeeDTO;
                    self.deliveryMode(self.international.demandDraftDeliveryDTO.deliveryMode);
                    self.international.name = ko.observable(self.international.name);
                    self.international.nickName = ko.observable(self.international.nickName);
                    self.international.payAtCity = ko.observable(self.international.payAtCity);
                    self.international.demandDraftDeliveryDTO.deliveryMode = self.deliveryMode();
                    self.payeeAccessType = ko.utils.unwrapObservable(data.demandDraftPayeeDTO.shared);
                    self.selectedCountry(self.international.payAtCountry);
                    self.getCountries(data);

                    if (self.payeeDetails) {
                        self.payeeDetails.nickName = self.international.nickName;
                        self.payeeDetails.id = self.international.id;
                        self.payeeDetails.name = self.international.name;
                        self.payeeDetails.payeeType = "DEMANDDRAFT";
                        self.payeeDetails.demandDraftPayeeType = "INT";
                        self.payeeDetails.payAtCity = self.international.payAtCity;
                        self.payeeDetails.payAtCountry = self.international.payAtCountry;
                        self.selectedCountry(self.payeeDetails.payAtCountry);
                        self.getCountries(data);
                        self.payeeDetails.demandDraftDeliveryDTO = self.international.demandDraftDeliveryDTO;
                        self.payeeDetails.demandDraftDeliveryDTO.deliveryMode = self.international.demandDraftDeliveryDTO.deliveryMode;
                        self.setLimitClicked = ko.observable(false);
                        self.confirmPage = ko.observable(true);
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

                    confirmScreenDetailsArrayInternational = [
                        [{
                                label: self.payments.payee.international.drafttype,
                                value: self.payments.payee.accinternational
                            },
                            {
                                label: self.payments.payee.international.draftfavouring,
                                value: self.international.nickName
                            }
                        ],
                        [{
                                label: self.payments.payee.international.payableCountry,
                                value: self.international.payAtCountry
                            },
                            {
                                label: self.payments.payee.international.payableCity,
                                value: self.international.payAtCity
                            }
                        ]
                    ];

                    if (self.confirmScreenExtensions) {
                        $.extend(self.confirmScreenExtensions, {
                            isSet: true,
                            confirmScreenDetails: confirmScreenDetailsArrayInternational,
                            confirmScreenMsgEval: self.getConfirmScreenMsg,
                            confirmScreenStatusEval: self.getConfirmScreenStatus,
                            template: "confirm-screen/payments-template"
                        });
                    }
                }
            });
        });

        self.confirmRecipient = function() {
            const currentServiceCall = !self.params.isEdit ? DDPayeeModel.confirmPayee(self.params.payeeGroupId, self.params.payeeId, self.params.payeeType) : DDPayeeModel.updatePayee(self.params.payeeGroupId, self.params.payeeId, self.params.payeeType, ko.toJSON(self.params.editPayeePayload));

            currentServiceCall.then(function(data, status) {
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
                    self.baseURL = "payments/payeeGroup/" + self.params.payeeGroupId + "/payees/demandDraft/" + self.params.payeeId;
                } else {
                    self.transferObject({
                        id: self.params.payeeId,
                        groupId: self.params.payeeGroupId,
                        name: self.params.payeeName
                    });

                    self.transactionName = self.payments.payee.transactionMessage[self.params.payeeType];

                    Params.dashboard.loadComponent("confirm-screen", {
                        transactionResponse: data,
                        hostReferenceNumber: data.externalReferenceId,
                        setLimit: true,
                        transactionName: Params.dashboard.headerName(),
                        confirmScreenExtensions: {
                            successMessage: successMessage,
                            statusMessages: statusMessages,
                            isSet: true,
                            taskCode: !self.params.isEdit ? "PC_N_CDDP" : "PC_N_UDDP",
                            confirmScreenDetails: self.payeeType() === "DOM" ? confirmScreenDetailsArrayDomestic : confirmScreenDetailsArrayInternational,
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

        self.makePayment = function() {
            if (Params.dashboard.appData.segment === "CORP") {
                Params.dashboard.loadComponent("issue-demand-draft", {
                    transferDataPayee: self.transferObject()
                });
            } else {
                self.selectedTab = "";

                Params.dashboard.loadComponent("manage-accounts", {
                    applicationType: "payments",
                    defaultTab: "issue-demand-draft",
                    transferDataPayee: self.transferObject()
                });
            }
        };

        self.getBranchDetails = function(branchCode) {
            DDPayeeModel.getBranchDetails(branchCode).done(function(data) {
                self.addressDetails.postalAddress = data.addressDTO[0].branchAddress.postalAddress;
                self.addressDetails.postalAddress.zipCode = self.addressDetails.postalAddress.postalCode;
                self.addressDetails.postalAddress.branchName = data.addressDTO[0].branchName;

                if (self.payeeDetails) {
                    self.payeeDetails.postalAddress = data.addressDTO[0].branchAddress.postalAddress;
                    self.payeeDetails.postalAddress.zipCode = self.payeeDetails.postalAddress && self.payeeDetails.postalAddress.postalCode ? self.payeeDetails.postalAddress.postalCode : "";
                    self.payeeDetails.postalAddress.branchName = data.addressDTO[0].branchName;
                }

                self.addressDetails.postalAddress.branch = branchCode;

                self.dataLoaded(true);
            });
        };

        self.getPartyAddress = function(addressType) {
            DDPayeeModel.getPartyAddress().done(function(data) {
                if (data.party) {
                    for (let i = 0; i < data.party.addresses.length; i++) {
                        if (data.party.addresses[i].type === addressType) {
                            self.addressDetails.postalAddress = data.party.addresses[i].postalAddress ? data.party.addresses[i].postalAddress : "";

                            if (self.payeeDetails) {
                                self.payeeDetails.postalAddress = data.party.addresses[i].postalAddress ? data.party.addresses[i].postalAddress : "";
                            }

                            break;
                        }
                    }
                }

                self.addressDetails.addressTypeDescription = self.payments.payee[addressType];
                self.addressDetails.postalAddress.zipCode = self.addressDetails.postalAddress.postalCode;

                if (self.payeeDetails) {
                    self.payeeDetails.addressTypeDescription = self.payments.payee[addressType];
                    self.payeeDetails.postalAddress.zipCode = self.payeeDetails.postalAddress && self.payeeDetails.postalAddress.postalCode ? self.payeeDetails.postalAddress.postalCode : "";
                }

                self.dataLoaded(true);
            });
        };

        self.getCountries = function() {
            DDPayeeModel.getCountries().done(function(data) {
                for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
                    if (self.selectedCountry() === data.enumRepresentations[0].data[i].code) {
                        self.selectedCountry(data.enumRepresentations[0].data[i].description);
                        break;
                    }
                }

                if (self.international.demandDraftDeliveryDTO.deliveryMode === "BRN") {
                    self.getBranchDetails(self.international.demandDraftDeliveryDTO.branch);
                } else if (self.international.demandDraftDeliveryDTO.deliveryMode === "MAI") {
                    self.getPartyAddress(self.international.demandDraftDeliveryDTO.addressType);
                } else {
                    self.addressDetails.postalAddress = self.international.address;
                    self.dataLoaded(true);
                }

                if (self.payeeDetails) {
                    if (self.payeeDetails.demandDraftDeliveryDTO.deliveryMode === "BRN") {
                        self.getBranchDetails(self.international.demandDraftDeliveryDTO.branch);
                    } else if (self.payeeDetails.demandDraftDeliveryDTO.deliveryMode === "MAI") {
                        self.getPartyAddress(self.international.demandDraftDeliveryDTO.addressType);
                    } else {
                        self.addressDetails.postalAddress = self.international.address;
                        self.dataLoaded(true);
                    }
                }
            });
        };
    };
});