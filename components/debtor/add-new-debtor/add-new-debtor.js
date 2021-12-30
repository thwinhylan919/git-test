define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/add-new-debtor",
    "ojs/ojknockout",
    "ojs/ojvalidationgroup",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojbutton"
], function(oj, ko, $, newDebtorModel, ResourceBundle) {
    "use strict";

    return function(Params) {
        const self = this,
            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(newDebtorModel.getNewModel());

                return KoModel;
            };

        if (Params.rootModel.params.isSuccess) { ko.utils.extend(self, Params.rootModel); }

        self.debtor = getNewKoModel().debtorModel;
        self.debtorName = getNewKoModel().debtorName;
        self.bankDetailsCode = ko.observable();

        if (!Params.rootModel.params.isSuccess) { ko.utils.extend(self, Params.rootModel); }

        self.validationTracker = Params.validator;
        self.validationTracker = ko.observable();
        self.debtors = ResourceBundle.debtors;
        self.common = ResourceBundle.common;
        self.resource = ResourceBundle;
        Params.dashboard.headerName(self.debtors.initiateScreenHeader);
        self.additionalBankDetails = ko.observable();
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        self.stageThree = ko.observable(false);
        self.name = ko.observable();
        self.authKey = ko.observable();
        self.invalidOtpEntered = ko.observable(false);
        self.showDebtorDetails = ko.observable(false);
        self.componentName = ko.observable("debtor-details");
        self.payerId = ko.observable();
        self.enableButton = ko.observable(false);
        self.clearingCodeType = ko.observable("SWI");
        self.validationTracker = ko.observable();
        self.file = ko.observable();
        self.contentId = ko.observable();
        self.preview = ko.observable();
        self.fileId = ko.observable("input");
        self.imageId = ko.observable("target");
        self.fileTypeArray = ko.observableArray();
        self.maxFileSize = ko.observable();

        Params.baseModel.registerElement([
            "confirm-screen",
            "bank-look-up"
        ]);

        Params.baseModel.registerComponent("debtor-money-request", "debtor");
        Params.baseModel.registerComponent("debtor-group-list", "debtor");
        Params.baseModel.registerComponent("review-add-new-debtor", "debtor");
        Params.baseModel.registerComponent("image-upload", "goals");

        self.addDebtor = function() {
            if (!Params.baseModel.showComponentValidationErrors(document.getElementById("debtorTracker"))) {
                return;
            }

            const debtorName = ko.toJSON(self.debtorName);

            newDebtorModel.getDebtorGroupName(debtorName).done(function(data) {
                self.debtor.groupId(data.payerGroup.groupId);

                if (self.contentId()) { self.debtor.contentId(self.contentId()); }

                self.debtor.sepaDomesticPayer.bankDetails.code = self.bankDetailsCode();

                const debtor = ko.toJSON(self.debtor);

                if (self.debtor.groupId !== null) {
                    newDebtorModel.createNewPayer(debtor, data.payerGroup.groupId).done(function(data2) {
                        self.payerId(data2.domesticPayer.id);
                        self.stageOne(false);

                        Params.dashboard.loadComponent("review-add-new-debtor", {
                            payerId: self.payerId(),
                            debtorName :self.debtorName,
                            debtor : self.debtor,
                            header: Params.dashboard.headerName(),
                            groupId: self.debtor.groupId(),
                            contentId : self.contentId,
                            bankDetailsCode :self.bankDetailsCode,
                            imageUploadFlag : self.imageUploadFlag,
                           confirmAddDebtor :self.confirmAddDebtor
                        });
                    }).fail(function() {
                        self.deletePayerOnFail();
                    });
                }
            });
        };

        const configurationDetails = {};

        self.imageUploadFlag = ko.observable();

        newDebtorModel.getPayeeMaintenance().then(function(data) {
            for (let k = 0; k < data.configurationDetails.length; k++) {
                configurationDetails[data.configurationDetails[k].propertyId] = data.configurationDetails[k].propertyValue;
            }

            if (Params.dashboard.appData.segment !== "CORP") { self.imageUploadFlag(configurationDetails.RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED === "Y"); }

            if (self.imageUploadFlag()) {
                newDebtorModel.retrieveImageTypeSuuport().then(function(data) {
                    if (data) {
                        self.fileTypeArray(data.allowedImageMIMEType.split(","));
                        self.maxFileSize(data.maxSize);
                    }
                });
            }
        });

        self.uploadImage = function() {
            if (self.file()) {
                const form = new FormData();

                form.append("file", self.file());
                form.append("moduleIdentifier", "PAYEE");
                form.append("isShared", "true");
                form.append("isThumbnail", "true");

                newDebtorModel.uploadImage(form).done(function(data) {
                    if (data && data.contentDTOList[0] && data.contentDTOList[0].contentId) {
                        self.contentId(data.contentDTOList[0].contentId.value);
                        self.debtorName.contentId(self.contentId());
                        self.addDebtor();
                    }
                });
            } else {
                self.addDebtor();
            }
        };

        self.cancelAddDebtor = function() {
            history.back();
        };

        self.cancelStageTwo = function() {

            newDebtorModel.deleteDebtor(self.payerId(), self.debtor.groupId()).done(function() {
                newDebtorModel.deleteDebtorGroup(self.debtor.groupId()).done(function() {
                    self.stageOne(true);
                    self.stageTwo(false);
                });
            });
        };

        self.deletePayerOnFail = function() {
            newDebtorModel.deleteDebtorGroup(self.debtor.groupId()).done(function() {
                self.enableButton(false);
                self.stageOne(true);
                self.stageTwo(false);
            });
        };

        self.cancelStageThree = function() {
            newDebtorModel.deleteDebtor(self.payerId(), self.debtor.groupId()).done(function() {
                newDebtorModel.deleteDebtorGroup(self.debtor.groupId()).done(function() {
                    self.stageOne(true);
                    self.stageTwo(false);
                    self.stageThree(false);
                });
            });
        };

        self.confirmAddDebtor = function() {
            newDebtorModel.confirmAddDebtor(self.payerId(), self.debtor.groupId()).done(function(data, status, jqXHR) {
                self.baseURL = "payments/payerGroup/" + self.debtor.groupId() + "/payers/domestic/" + self.payerId();

                 const confirmScreenDetailsArray = [
                    [{
                        label: self.resource.debtors.debtorIban,
                        value: self.debtor.sepaDomesticPayer.iban
                    },
                    {
                        label: self.resource.debtors.bankBICCode,
                        value: self.debtor.sepaDomesticPayer.bankDetails.code
                    },
                    {
                        label: self.resource.debtors.nickname,
                        value: self.debtor.nickName
                    },
                    {
                        label: self.resource.debtors.debtorName,
                        value: self.debtorName.name
                    }
                    ]

                ];

Params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    hostReferenceNumber: data.externalReferenceId,
                    template: "confirm-screen/payments-template",
                    transactionName: self.debtors.confirmAddDebtor,
                    confirmScreenExtensions:{
                        confirmScreenDetails: confirmScreenDetailsArray
                    },
                    debtor: true
                });
            }).fail(function() {
                self.deletePayerOnFail();
            });
        };

        let error;

        self.validateCode = [{
            validate: function(value) {
                if (value.length < 1) {
                    error = true;
                } else if (value.length > 20 || !/^[a-zA-Z0-9]+$/.test(value)) {
                    error = true;
                    throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.debtors.invalidError));
                }
            }
        }];

        self.verifyCode = function() {
            if (!error) {
                newDebtorModel.getBankDetailsBIC(self.bankDetailsCode()).done(function(data) {
                    self.additionalBankDetails(data);
                });
            }
        };

        self.resetCode = function() {
            self.bankDetailsCode(null);
            self.additionalBankDetails(null);
        };

        self.openLookup = function() {
            $("#menuButtonDialog").trigger("openModal");
        };

        self.confirmAddDebtorWithAuth = function(data, status, jqXHR) {
            if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }

            if (data.tokenValid) {
                self.stageThree(false);

                Params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    hostReferenceNumber: data.externalReferenceId,
                    transactionName: self.debtors.confirmAddDebtor,
                    template: "confirm-screen/payments-template"
                });
            }
        };

        self.cancelAdd = function() {
            newDebtorModel.deleteDebtor(self.payerId(), self.debtor.groupId()).done(function() {
                newDebtorModel.deleteDebtorGroup(self.debtor.groupId()).done(function() {
                    self.stageOne(true);
                    self.stageTwo(false);
                    self.stageThree(false);
                });
            });
        };
    };
});