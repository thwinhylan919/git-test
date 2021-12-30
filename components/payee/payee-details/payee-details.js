define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/payee-details",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojavatar",
    "ojs/ojbutton"
], function(ko, $, payeeModel, ResourceBundle) {
    "use strict";

    return function(Params) {
        const self = this,
            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(payeeModel.getNewModel());

                return KoModel;
            };

        ko.utils.extend(self, Params.rootModel);

        self.stageOne = ko.observable(false);
        self.stageTwo = ko.observable(false);
        self.validationTracker = ko.observable();
        self.stageThree = ko.observable(false);
        self.stageFour = ko.observable(false);
        self.isEdit = ko.observable(false);
        self.isVerify = ko.observable(false);
        self.payments = ResourceBundle.payments;
        self.common = ResourceBundle.payments.common;
        self.payeeName = ko.observable();
        self.payeeAccountType = ko.observable();
        self.payeeRelationType = ko.observable();
        self.isPayeeRelationTypeLoaded = ko.observable(false);
        self.payeeData = ko.toJS(self.params);
        self.payeeType = ko.observable();
        self.payeeName(self.payeeData.name);
        self.icon = ko.observable(self.payeeData.image);
        self.groupId = ko.observable(ko.utils.unwrapObservable(self.payeeData.groupId));
        self.branchName = ko.observable();
        self.payeeData.payeeType = ko.utils.unwrapObservable(self.payeeData.payeeType);
        self.addressDetails = ko.toJS(getNewKoModel().addressDetails);
        self.editPayeeModel = getNewKoModel().editPayeeModel;
        self.payeeLimitModel = getNewKoModel().payeeLimitModel;
        self.tempcurrency = ko.observable("GBP");
        self.dailyLimit = ko.observable(self.payments.payee.notset);
        self.file = ko.observable();
        self.contentId = ko.observable();
        self.preview = ko.observable();
        self.fileId = ko.observable("input");
        self.imageId = ko.observable("target");
        self.fileTypeArray = ko.observableArray();
        self.maxFileSize = ko.observable();
        self.type = ko.observable();
        self.selectedComponent = ko.observable();
        self.addressMap = ko.observable({});
        payeeModel.init(self.payeeData.id, self.groupId());
        Params.baseModel.registerComponent("payments-money-transfer", "payments");
        Params.baseModel.registerComponent("issue-demand-draft", "payments");
        Params.baseModel.registerComponent("image-upload", "goals");
        Params.baseModel.registerComponent("bank-account-payee", "payee");
        Params.baseModel.registerComponent("demand-draft-payee", "payee");

        Params.baseModel.registerElement([
            "confirm-screen",
            "amount-input",
            "internal-account-input"
        ]);

        Params.dashboard.headerName(self.payments.payee.payees);

        self.transferObject = ko.observable({
            payeeId: "",
            isStandingInstruction: false,
            transferType: "",
            paymentType: ""
        });

        self.limitPackage = ko.observable({
            exists: false,
            data: null,
            fetch: true
        });

        payeeModel.fetchBankConfiguration().done(function(data) {
            self.tempcurrency(data.bankConfigurationDTO.localCurrency);
        });

        self.limitFetched = ko.observable(false);
        self.limitsEffectiveTomorrowFlag = ko.observable(false);
        self.limitsEffectiveTomorrowDetailsFlag = ko.observable(false);
        self.limitsEffectiveTomorrow = ko.observable();

        payeeModel.getPayeeLimit().done(function(data) {
            self.limitFetched(true);

            if (data.limitPackageDTO && data.limitPackageDTO.targetLimitLinkages.length > 0) {
                for (let i = 0; i < data.limitPackageDTO.targetLimitLinkages.length; i++) {
                    if (data.limitPackageDTO.targetLimitLinkages[i].target.type.id === "PAYEE" && data.limitPackageDTO.targetLimitLinkages[i].target.value === self.payeeData.id && data.limitPackageDTO.targetLimitLinkages[i].effectiveDate <= Params.baseModel.getDate()) {
                        if (data.limitPackageDTO.targetLimitLinkages[i].expiryDate) {
                            if (data.limitPackageDTO.targetLimitLinkages[i].expiryDate > Params.baseModel.getDate()) {
                                self.dailyLimit(data.limitPackageDTO.targetLimitLinkages[i].limits[0].maxAmount.amount);
                                break;
                            }
                        } else {
                            self.dailyLimit(data.limitPackageDTO.targetLimitLinkages[i].limits[0].maxAmount.amount);
                            break;
                        }
                    } else if (data.limitPackageDTO.targetLimitLinkages[i].target.type.id === "PAYEE" && data.limitPackageDTO.targetLimitLinkages[i].target.value === self.payeeData.id && data.limitPackageDTO.targetLimitLinkages[i].effectiveDate > Params.baseModel.getDate()) {
                        self.limitsEffectiveTomorrowFlag(true);
                        self.limitsEffectiveTomorrow(data.limitPackageDTO.targetLimitLinkages[i].limits[0].maxAmount.amount);
                    }
                }

                self.limitPackage().exists = true;
                self.limitPackage().data = data;
            }
        });

        self.viewEffectiveTomorrow = function() {
            self.limitsEffectiveTomorrowDetailsFlag(true);
        };

        self.payeeDataLoaded = ko.observable(true);

        function initialRender() {
            if (self.payeeData.payeeType === "DEMANDDRAFT") {
                const fetchBranchAddressPromise = self.payeeData && self.payeeData.deliveryMode === "BRN" ? payeeModel.fetchBranchAddress(self.payeeData.branchCode) : Promise.resolve();

                Promise.all([payeeModel.fetchCourierAddress(), fetchBranchAddressPromise]).then(function(data) {
                    self.payeeDataLoaded(false);

                    self.payeeData.draftAddressDetails = {};

                    const addresses = data[0].party.addresses;

                    for (let i = 0; i < addresses.length; i++) {
                        self.addressMap()[addresses[i].type] = addresses[i].postalAddress;
                    }

                    if (self.payeeData.deliveryMode === "BRN") {
                        data[1].addressDTO[0].branchAddress.postalAddress.branchName = data[1].addressDTO[0].branchName;
                        self.payeeData.draftAddressDetails.postalAddress = data[1].addressDTO[0].branchAddress.postalAddress;
                        self.payeeData.draftAddressDetails.postalAddress.addressType = self.payments.payee.addressType.BRN;
                    } else if (self.payeeData.deliveryMode === "MAI") {
                        self.payeeData.draftAddressDetails.postalAddress = self.addressMap()[self.payeeData.addressType];
                        self.payeeData.draftAddressDetails.postalAddress.zipCode = self.payeeData.draftAddressDetails.postalAddress.postalCode ? self.payeeData.draftAddressDetails.postalAddress.postalCode : self.payeeData.draftAddressDetails.postalAddress.zipCode;
                        self.payeeData.draftAddressDetails.postalAddress.addressType = self.payments.payee.addressType.MAI;
                    } else if (self.payeeData.deliveryMode === "OTHADD") {
                        self.payeeData.draftAddressDetails.postalAddress = self.payeeData.address ? self.payeeData.address : {};
                        self.payeeData.draftAddressDetails.postalAddress.addressType = self.payments.payee.addressType.OTHADD;
                    }

                    self.payeeData.draftAddressDetails.postalAddress.modeofDelivery = self.payeeData.deliveryMode;
                    self.payeeData.draftAddressDetails.modeofDelivery = self.payeeData.deliveryMode;
                    ko.tasks.runEarly();
                    self.payeeDataLoaded(true);

                });

                self.payeeRelationType("demanddraft");
                self.payeeType("demandDraft");
            } else if (self.payeeData.payeeType === "INTERNAL") {
                self.payeeRelationType("bankaccount");
                self.payeeType("internal");
                self.type("internal");
                self.selectedComponent("internal-payee");
            } else if (self.payeeData.payeeType === "DOMESTIC") {
                self.payeeRelationType("bankaccount");
                self.payeeType("domestic");
                self.type("domestic");

                if (self.payeeData.domesticPayeeType === "INDIA") {
                    self.selectedComponent("domestic-payee");
                } else if (self.payeeData.domesticPayeeType === "UK") {
                    self.selectedComponent("uk-payee");
                } else {
                    self.selectedComponent("sepa-payee");
                }
            } else if (self.payeeData.payeeType === "INTERNATIONAL") {
                self.payeeRelationType("bankaccount");
                self.payeeType("international");
                self.type("international");
                self.selectedComponent("international-payee");
            } else if (self.payeeData.payeeType === "PEERTOPEER") {
                self.payeeRelationType("accpeertopeer");
                self.payeeType("peerToPeer");
            }

            if (self.payeeData.payeeType === "DEMANDDRAFT" && self.payeeData.demandDraftPayeeType === "DOM") {
                self.type("demandDraft");
                self.selectedComponent("domestic-demand-draft");
            } else if (self.payeeData.payeeType === "DEMANDDRAFT" && self.payeeData.demandDraftPayeeType === "INT") {
                self.type("demandDraft");
                self.selectedComponent("international-demand-draft");
            }
        }

        initialRender();

        self.payeeData.isStandingInstruction = false;

        self.transferObject({
            payeeId: self.payeeData.id,
            isStandingInstruction: false,
            payeeType: self.payeeType(),
            groupId: self.groupId()
        });

        self.isPayeeRelationTypeLoaded(true);

        self.getBranchAddress = function() {
            payeeModel.getBranchAddress(self.payeeData.branchCode).done(function(data) {
                self.branchName(data.addressDTO[0] ? data.addressDTO[0].branchName : "");
                self.addressDetails.postalAddress = data.addressDTO[0] ? data.addressDTO[0].branchAddress.postalAddress : "";

                if (data.addressDTO[0]) {
                    self.addressDetails.postalAddress.branchName = data.addressDTO[0].branchName;
                    self.addressDetails.postalAddress.branchCode = data.addressDTO[0].id;
                }

                self.stageOne(true);
            });
        };

        self.getMyAddress = function() {
            payeeModel.fetchCourierAddress().then(function(data) {
                if (data.party) {
                    for (let i = 0; i < data.party.addresses.length; i++) {
                        if (data.party.addresses[i].type === self.payeeData.addressType) {
                            self.addressDetails.postalAddress = data.party.addresses[i].postalAddress;
                            self.stageOne(true);
                            break;
                        }
                    }
                }
            });
        };

        if (self.payeeData.deliveryMode === "BRN") {
            self.getBranchAddress();
        } else if (self.payeeData.deliveryMode === "MAI") {
            self.getMyAddress();
        } else {
            self.stageOne(true);
        }

        self.cancelConfirmation = function() {
            self.stageOne(true);
            self.stageTwo(false);
        };

        self.deletePayee = function() {
            $("#delete-payee").trigger("openModal");
        };

        self.cancelDeletion = function() {
            self.stageOne(true);
            self.stageTwo(false);
            self.stageThree(false);
            self.stageFour(false);
            Params.dashboard.hideDetails();
        };

        self.closeModal = function() {
            $("#delete-payee").trigger("closeModal");
        };

        self.accessType = ko.observable("PUBLIC");

        self.accessTypes = [{
                id: "PRIVATE",
                label: self.payments.payee.NONSHARED
            },
            {
                id: "PUBLIC",
                label: self.payments.payee.SHARED
            }
        ];

        function getConfirmScreenDetailsArray() {
            let confirmScreenDetailsArray;

            if (self.payeeData.payeeType === "INTERNAL") {
                confirmScreenDetailsArray = [
                    [{
                            label: self.payments.payee.accounttype,
                            value: self.payments.payee.type[self.payeeData.payeeType]
                        },
                        {
                            label: self.payments.payee.accountname,
                            value: self.payeeData.accountName
                        },
                        {
                            label: self.payments.payee.accountnickname,
                            value: self.payeeData.nickName
                        }
                    ],
                    [{
                        label: self.payments.payee.accountnumber,
                        value: self.payeeData.accountNumber,
                        isInternalAccNo : true
                    }]
                ];
            } else if (self.payeeData.payeeType === "DOMESTIC") {
                confirmScreenDetailsArray = [
                    [{
                            label: self.payments.payee.accounttype,
                            value: self.payments.payee.type[self.payeeData.payeeType]
                        },
                        {
                            label: self.payments.payee.accountnumber,
                            value: self.payeeData.accountNumber
                        }
                    ],
                    [{
                            label: self.payments.payee.accountname,
                            value: self.payeeData.accountName
                        },
                        {
                            label: self.payments.payee.bankdetails,
                            value: [
                                self.payeeData.branchCode,
                                self.payeeData.bankName,
                                self.payeeData.bankCity,
                                self.payeeData.bankCountry
                            ]
                        }
                    ]
                ];
            } else if (self.payeeData.payeeType === "INTERNATIONAL") {
                confirmScreenDetailsArray = [
                    [{
                            label: self.payments.payee.accounttype,
                            value: self.payments.payee.type[self.payeeData.payeeType]
                        },
                        {
                            label: self.payments.payee.accountname,
                            value: self.payeeData.accountName
                        }
                    ],
                    [{
                        label: self.payments.payee.bankdetails,
                        value: [
                            self.payeeData.branchCode,
                            self.payeeData.bankName,
                            self.payeeData.bankCity,
                            self.payeeData.bankCountry
                        ]
                    }]
                ];
            } else if (self.payeeData.payeeType === "DEMANDDRAFT" && self.payeeData.demandDraftPayeeType === "DOM") {
                confirmScreenDetailsArray = [
                    [{
                            label: self.payments.payee.drafttype,
                            value: self.payments.payee.type[self.payeeData.demandDraftPayeeType]
                        },
                        {
                            label: self.payments.payee.draftfavouring,
                            value: self.payeeData.nickName
                        }
                    ],
                    [{
                        label: self.payments.payee.payAtCity,
                        value: self.payeeData.payAtCity
                    }]
                ];
            } else if (self.payeeData.payeeType === "DEMANDDRAFT" && self.payeeData.demandDraftPayeeType === "INT") {
                confirmScreenDetailsArray = [
                    [{
                            label: self.payments.payee.drafttype,
                            value: self.payments.payee.type[self.payeeData.demandDraftPayeeType]
                        },
                        {
                            label: self.payments.payee.draftfavouring,
                            value: self.payeeData.nickName
                        }
                    ],
                    [{
                            label: self.payments.payee.payAtCountry,
                            value: self.payeeData.countryCodeMap ? self.payeeData.countryCodeMap[self.payeeData.payAtCountry] : null
                        },
                        {
                            label: self.payments.payee.payAtCity,
                            value: self.payeeData.payAtCity
                        }
                    ]
                ];
            }

            return confirmScreenDetailsArray;
        }

        const configurationDetails = {};

        self.imageUploadFlag = ko.observable();

        payeeModel.getPayeeMaintenance().then(function(data) {
            for (let k = 0; k < data.configurationDetails.length; k++) {
                configurationDetails[data.configurationDetails[k].propertyId] = data.configurationDetails[k].propertyValue;
            }

            if (Params.dashboard.appData.segment === "CORP") { self.imageUploadFlag(configurationDetails.CORPORATE_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0); } else { self.imageUploadFlag(configurationDetails.RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0); }

            if (self.imageUploadFlag()) {
                payeeModel.retrieveImageTypeSuuport().then(function(data) {
                    if (data) {
                        self.fileTypeArray(data.allowedImageMIMEType.split(","));
                        self.maxFileSize(data.maxSize);
                    }
                });
            }
        });

        const payeeTaskCodesMap = {
            DEMANDDRAFT: "PC_N_DDDP",
            INTERNAL: "PC_N_DIP",
            DOMESTIC: "PC_N_DDP",
            INTERNATIONAL: "PC_N_DITNP",
            PEERTOPEER: "PC_N_DPTPP"
        };

        self.confirmDeletePayee = function() {
            payeeModel.deletePayee(self.payeeType()).done(function(data, status, jqXHR) {
                self.httpStatus = jqXHR.status;

                let deleteSuccessMessage, deleteStatusMessage;

                if (self.httpStatus && self.httpStatus !== 202) {
                    deleteSuccessMessage = self.payments.payee.confirmScreen.successMessage;
                    deleteStatusMessage = self.payments.common.completed;
                } else {
                    deleteSuccessMessage = self.payments.payee.confirmScreen.corpMaker;
                    deleteStatusMessage = self.payments.payee.confirmScreen.pendingApproval;
                }

                let deletePayee = "";

                if (self.payeeData.totalPayeeCount > 1) {
                    deletePayee = self.payments.payeeDeleteWithGroup;
                } else {
                    deletePayee = self.payments.payeeDelete;
                }

                Params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    hostReferenceNumber: data.externalReferenceId,
                    transactionName: deletePayee,
                    confirmScreenExtensions: {
                        successMessage: deleteSuccessMessage,
                        statusMessages: deleteStatusMessage,
                        isSet: true,
                        taskCode: payeeTaskCodesMap[self.payeeData.payeeType],
                        confirmScreenDetails: getConfirmScreenDetailsArray(),
                        template: "confirm-screen/payments-template"
                    }
                }, self);

                self.stageThree(false);
            });
        };

        self.cancel = function() {
            self.stageOne(false);
            self.stageTwo(false);
            self.stageThree(false);
            self.stageFour(false);
            Params.dashboard.hideDetails();
        };

        const originalAccessType = self.payeeData.payeeAccessType;

        self.cancelEdit = function() {
            self.stageOne(false);
            self.accessType(self.payeeData.payeeAccessType);
            self.isEdit(true);
            self.isVerify(false);
            self.stageTwo(true);
        };

        self.editPayeeDetails = function() {
            Params.dashboard.headerName(self.payments.editPayee);
            self.stageOne(false);
            self.accessType(self.payeeData.payeeAccessType);
            self.isEdit(true);
            self.isVerify(false);
            self.stageTwo(true);
        };

        self.cancelEditPayeeDetails = function() {
            Params.dashboard.headerName(self.payments.payee.payees);
            self.isEdit(false);
            self.isVerify(false);
            self.stageOne(true);
            self.stageTwo(false);
            self.payeeData.payeeAccessType = originalAccessType;
        };

        self.verifyEditPayeeDetails = function() {
            if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }

            self.stageOne(true);
            self.isEdit(false);
            self.payeeData.payeeAccessType = self.accessType();
            self.isVerify(true);
            self.stageTwo(false);
        };

        self.uploadImage = function() {
            if (self.file()) {
                const form = new FormData();

                form.append("file", self.file());
                form.append("moduleIdentifier", "PAYEE");
                form.append("isShared", "true");
                form.append("isThumbnail", "true");

                payeeModel.uploadImage(form).done(function(data) {
                    if (data && data.contentDTOList[0] && data.contentDTOList[0].contentId) {
                        self.contentId(data.contentDTOList[0].contentId.value);
                        self.confirmEditPayeeDetails();
                    }
                });
            } else {
                self.confirmEditPayeeDetails();
            }
        };

        self.confirmEditPayeeDetails = function() {
            let successMessage, statusMessages;

            if (self.contentId()) { self.editPayeeModel.contentId(self.contentId()); }

            if (self.accessType() === "PUBLIC") { self.editPayeeModel.shared(true); } else if (self.accessType() === "PRIVATE") { self.editPayeeModel.shared(false); }

            const payload = ko.toJSON(self.editPayeeModel);

            payeeModel.editPayee(payload).done(function(data, status, jqXHR) {
                self.httpStatus = jqXHR.status;

                if (self.httpStatus && self.httpStatus !== 202) {
                    successMessage = self.payments.payee.confirmScreen.updateSuccessMessage;
                    statusMessages = self.payments.common.completed;
                } else {
                    successMessage = self.payments.payee.confirmScreen.corpMaker;
                    statusMessages = self.payments.payee.confirmScreen.pendingApproval;
                }

                self.stageOne(false);

                Params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    hostReferenceNumber: data.externalReferenceId,
                    transactionName: self.payments.editPayee,
                    confirmScreenExtensions: {
                        successMessage: successMessage,
                        statusMessages: statusMessages,
                        isSet: true,
                        confirmScreenDetails: getConfirmScreenDetailsArray(),
                        template: "confirm-screen/payments-template"
                    }
                }, self);
            });
        };
    };
});