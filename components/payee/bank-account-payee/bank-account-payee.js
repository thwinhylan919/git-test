define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/bank-account-payee",
    "ojs/ojinputnumber",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojselectcombobox",
    "ojs/ojcheckboxset",
    "ojs/ojbutton",
    "ojs/ojknockout-validation",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojvalidationgroup"
], function (oj, ko, $, addPayeeModel, ResourceBundle) {
    "use strict";

    return function (Params) {
        const self = this;
        let i = 0,
            j = 0;
        const limitsMap = {},
            payeeLimitsMap = {};
        let isPayeeGroupCreated = false;
        const getNewKoModel = function () {
            const KoModel = ko.mapping.fromJS(addPayeeModel.getNewModel());

            return KoModel;
        };

        self.payments = ResourceBundle.payments;
        self.selectedComponent = ko.observable("internal-payee");
        self.currentRelationType = ko.observable("ACC");
        self.currentAccountType = ko.observable("INTERNAL");
        self.accountNumber = ko.observable();
        self.ConfirmaccountNumber = ko.observable();
        self.payeeName = ko.observable();
        self.payeeId = ko.observable();
        self.payeeNickName = ko.observable();
        self.sepaType = ko.observable();
        self.AdhocFlag = ko.observable(false);
        self.paymentType = ko.observable();
        self.accountName = ko.observable();
        self.network = ko.observable();
        self.bankDetailsCode = ko.observable();
        self.bankName = ko.observable();
        self.bankAddress = ko.observable();
        self.country = ko.observable();
        self.city = ko.observable();
        self.accessType = ko.observable("PRIVATE");
        self.payeeGroupId = ko.observable(null);
        self.isNew = ko.observable(true);
        self.region = ko.observable("INDIA");
        self.isPayeeAccountTypeLoaded = ko.observable(false);
        self.payeeAccountTypeList = ko.observableArray([]);
        self.typeOfAccount = ko.observable(null);
        self.typeOfAccountDescription = ko.observable(null);
        self.contentId = ko.observable();
        self.preview = ko.observable();
        self.defaultPreview = ko.observable();
        self.isImageExist = ko.observable(false);
        self.fileId = ko.observable("input");
        self.imageId = ko.observable("target");
        self.payeeImageAvailable = ko.observable();
        self.validateDTO = ko.observable();
        ko.utils.extend(self, Params.rootModel.previousState ? ko.mapping.fromJS(Params.rootModel.previousState) : Params.rootModel.params.fromAdhoc || Params.rootModel.params.isEdit ? ko.mapping.fromJS(Params.rootModel.params) : Params.rootModel);
        self.file = ko.observable();

        if (Params.rootModel.params) {
            self.payeeData = {
                payeeName: Params.rootModel.params.payeeName,
                dailyLimit:  Params.rootModel.params.newLimitAmount,
                monthlyLimit:   Params.rootModel.params.newMonthlyLimitAmount,
                payeeGroupId: Params.rootModel.params.payeeGroupId,
                preview: Params.rootModel.params.preview
            };

            self.fromAdhocTransferUpi = ko.observable(Params.rootModel.params.fromAdhocTransferUpi);
        }

        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        self.stageFour = ko.observable(false);
        self.stageFive = ko.observable(false);
        self.stageTwoPointTwo = ko.observable(false);
        self.authKey = ko.observable();
        self.invalidOtpEntered = ko.observable(false);
        self.payments = ResourceBundle.payments;
        Params.dashboard.headerName(Params.rootModel.params && !Params.rootModel.params.isEdit ? self.payments.addrecipient_header : self.payments.editrecipient_header);
        self.shared = ko.observable();
        self.model = ko.observable(Params.rootModel.previousState ? Params.rootModel.previousState.model : null);
        self.payeeAccountType = typeof self.payeeAccountType === "function" ? self.payeeAccountType : ko.observable();
        self.isComponentLoaded = ko.observable(true);
        self.refreshLookup = ko.observable(true);
        self.additionalBankDetails = ko.observable(null);
        self.payeeGroupPayload = getNewKoModel().payeeGroup;
        self.internalPayeePayload = getNewKoModel().internalPayeeModel;
        self.domesticIndiaAccBasedPayeePayload = getNewKoModel().domesticIndiaAccBasedPayeeModel;
        self.domesticUKAccBasedPayeePayload = getNewKoModel().domesticUKAccBasedPayeeModel;
        self.domesticSepaAccBasedPayeePayload = getNewKoModel().domesticSepaAccBasedPayeeModel;
        self.internationalAccBasedPayeePayload = getNewKoModel().internationalAccBasedPayeeModel;

        if (self.currentAccountType() === "INTERNATIONAL") {
            if (Params.rootModel.previousState && Params.rootModel.previousState.address) {
                self.internationalAccBasedPayeePayload.address = Params.rootModel.previousState.address;
            } else if ((Params.rootModel.params.fromAdhoc || Params.rootModel.params.isEdit) && Params.rootModel.params.address) {
                self.internationalAccBasedPayeePayload.address = Params.rootModel.params.address;
            }
        }

        self.payeeLimitModel = getNewKoModel().payeeLimitModel;
        self.setLimitClicked = ko.observable(false);
        self.setMonthlyLimitClicked = ko.observable(false);
        self.newLimitAmount = ko.observable();
        self.newMonthlyLimitAmount = ko.observable();
        self.tommDailyLimitAmount = ko.observable();
        self.tommMonthlyLimitAmount = ko.observable();
        self.effectiveSameDayFlag = ko.observable(false);
        self.showActivitySuccessMsg = ko.observable(false);
        self.limitCurrency = ko.observable();
        self.confirmScreenDetails = ko.observable();
        self.limitSetMessage = ko.observable();
        self.fileTypeArray = ko.observableArray();
        self.maxFileSize = ko.observable();
        self.newLimitAmount(self.payeeData.dailyLimit);
        self.newMonthlyLimitAmount(self.payeeData.monthlyLimit);

       self.limitPackage = ko.observable({
            exists: false,
            data: null
        });

        self.countryCodeMap = {};
        Params.baseModel.registerComponent("image-upload", "goals");

        const validateDTOList = !(Params.rootModel.params && Params.rootModel.params.isEdit) ? {
            INTERNAL: "com.ofss.digx.app.payment.dto.payee.InternalPayeeCreateRequestDTO",
            DOMESTIC: "com.ofss.digx.app.payment.dto.payee.DomesticPayeeCreateRequestDTO",
            INTERNATIONAL: "com.ofss.digx.app.payment.dto.payee.InternationalPayeeCreateRequestDTO"
        } : {
                INTERNAL: "com.ofss.digx.app.payment.dto.payee.InternalPayeeUpdateRequestDTO",
                DOMESTIC: "com.ofss.digx.app.payment.dto.payee.DomesticPayeeUpdateRequestDTO",
                INTERNATIONAL: "com.ofss.digx.app.payment.dto.payee.InternationalPayeeUpdateRequestDTO"
            };

        self.validateDTO(Params.dashboard.getTaxonomyDefinition(validateDTOList[self.currentAccountType()]));

        if (!Params.rootModel.previousState && self.payeeData.payeeGroupId) {
            self.payeeName(self.payeeData.payeeName);
            self.payeeGroupId(self.payeeData.payeeGroupId);
            self.preview(ko.utils.unwrapObservable(self.payeeData.preview));
            self.isNew(false);
        }

        addPayeeModel.init();

        addPayeeModel.fetchCountryCode().then(function (data) {
            const enumRepresentations = data.enumRepresentations;

            if (enumRepresentations !== null) {
                for (let j = 0; j < enumRepresentations[0].data.length; j++) {
                    self.countryCodeMap[enumRepresentations[0].data[j].code] = enumRepresentations[0].data[j].description;
                }
            }
        });

        self.CoolingPeriodDataSource = ko.observable();
        self.isCollingPeriodSlot = ko.observable(false);

        self.createLimitsMessage = function (taskcode) {
            const limitObject = limitsMap[taskcode];

            self.CoolingPeriodList = ko.observableArray();

            if (limitObject) {
                for (let l = 0; l < limitObject.durationLimitSlots.length; l++) {
                    let duration = 0;

                    self.isCollingPeriodSlot(true);

                    if (limitObject.durationLimitSlots[l].endDuration.days === 0 && limitObject.durationLimitSlots[l].endDuration.hours === 0 && limitObject.durationLimitSlots[l].endDuration.minutes !== 0) {
                        duration = Params.baseModel.format(self.payments.payee.coolingPeriod.minutes, {
                            minutes: limitObject.durationLimitSlots[l].endDuration.minutes
                        });
                    } else if (limitObject.durationLimitSlots[l].endDuration.days === 0 && limitObject.durationLimitSlots[l].endDuration.hours !== 0 && limitObject.durationLimitSlots[l].endDuration.minutes === 0) {
                        duration = Params.baseModel.format(self.payments.payee.coolingPeriod.hours, {
                            hours: limitObject.durationLimitSlots[l].endDuration.hours
                        });
                    } else if (limitObject.durationLimitSlots[l].endDuration.days !== 0 && limitObject.durationLimitSlots[l].endDuration.hours === 0 && limitObject.durationLimitSlots[l].endDuration.minutes === 0) {
                        duration = Params.baseModel.format(self.payments.payee.coolingPeriod.days, {
                            days: limitObject.durationLimitSlots[l].endDuration.days
                        });
                    } else if (limitObject.durationLimitSlots[l].endDuration.days !== 0 && limitObject.durationLimitSlots[l].endDuration.hours !== 0 && limitObject.durationLimitSlots[l].endDuration.minutes === 0) {
                        duration = Params.baseModel.format(self.payments.payee.coolingPeriod.daysHours, {
                            days: limitObject.durationLimitSlots[l].endDuration.days,
                            hours: limitObject.durationLimitSlots[l].endDuration.hours
                        });
                    } else if (limitObject.durationLimitSlots[l].endDuration.days !== 0 && limitObject.durationLimitSlots[l].endDuration.hours === 0 && limitObject.durationLimitSlots[l].endDuration.minutes !== 0) {
                        duration = Params.baseModel.format(self.payments.payee.coolingPeriod.daysMinutes, {
                            days: limitObject.durationLimitSlots[l].endDuration.days,
                            minutes: limitObject.durationLimitSlots[l].endDuration.minutes
                        });
                    } else if (limitObject.durationLimitSlots[l].endDuration.days === 0 && limitObject.durationLimitSlots[l].endDuration.hours !== 0 && limitObject.durationLimitSlots[l].endDuration.minutes !== 0) {
                        duration = Params.baseModel.format(self.payments.payee.coolingPeriod.hoursMinutes, {
                            hours: limitObject.durationLimitSlots[l].endDuration.hours,
                            minutes: limitObject.durationLimitSlots[l].endDuration.minutes
                        });
                    } else if (limitObject.durationLimitSlots[l].endDuration.days !== 0 && limitObject.durationLimitSlots[l].endDuration.hours !== 0 && limitObject.durationLimitSlots[l].endDuration.minutes !== 0) {
                        duration = Params.baseModel.format(self.payments.payee.coolingPeriod.daysHoursMinutes, {
                            days: limitObject.durationLimitSlots[l].endDuration.days,
                            hours: limitObject.durationLimitSlots[l].endDuration.hours,
                            minutes: limitObject.durationLimitSlots[l].endDuration.minutes
                        });
                    }

                    self.CoolingPeriodList.push({
                        duration: duration,
                        amount: {
                            amountVal: limitObject.durationLimitSlots[l].amount.amount,
                            amountCurrency: limitObject.durationLimitSlots[l].amount.currency
                        }
                    });
                }

                self.CoolingPeriodDataSource(new oj.ArrayTableDataSource(self.CoolingPeriodList() || []));
            }
        };

        addPayeeModel.assignedLimitPackages().then(function (assigned) {
            if (assigned.limitPackageDTOList[0].targetLimitLinkages.length > 0) {
                self.limitCurrency(assigned.limitPackageDTOList[0].targetLimitLinkages[0].limits[0].currency);
            }

            if (assigned.limitPackageDTOList && assigned.limitPackageDTOList[0].targetLimitLinkages && assigned.limitPackageDTOList[0].targetLimitLinkages.length > 0) {
                for (j = 0; j < assigned.limitPackageDTOList[0].targetLimitLinkages.length; j++) {
                    for (let k = 0; k < assigned.limitPackageDTOList[0].targetLimitLinkages[j].limits.length; k++) {
                        if (assigned.limitPackageDTOList[0].targetLimitLinkages[j].limits[k].limitType === "DUR") {
                            limitsMap[assigned.limitPackageDTOList[0].targetLimitLinkages[j].target.value] = assigned.limitPackageDTOList[0].targetLimitLinkages[j].limits[k];
                        }
                    }
                }

                if (Params.rootModel && Params.rootModel.params && Params.rootModel.params.isEdit) {
                    if (Params.rootModel.params.currentAccountType === "INTERNAL") { self.createLimitsMessage("PC_F_INTRNL"); }
                    else if (Params.rootModel.params.currentAccountType === "INTERNATIONAL") { self.createLimitsMessage("PC_F_IT"); }
                    else if (Params.rootModel.params.currentAccountType === "DOMESTIC" && Params.rootModel.params.region === "UK") { self.createLimitsMessage("PC_F_UK_URG"); }
                    else if (Params.rootModel.params.currentAccountType === "DOMESTIC" && Params.rootModel.params.region === "SEPA") { self.createLimitsMessage("PC_F_SEPA_CARD"); }
                    else if (Params.rootModel.params.currentAccountType === "DOMESTIC" && Params.rootModel.params.region === "INDIA") { self.createLimitsMessage("PC_F_DOM_NEFT"); }
                }
                else { self.createLimitsMessage("PC_F_INTRNL"); }
            }
        });

        const activePayload = {
            INTERNAL: self.internalPayeePayload,
            DOMESTIC: {
                INDIA: self.domesticIndiaAccBasedPayeePayload,
                UK: self.domesticUKAccBasedPayeePayload,
                SEPA: self.domesticSepaAccBasedPayeePayload
            },
            INTERNATIONAL: self.internationalAccBasedPayeePayload
        },
            currentPayeeType = {
                internal: "internalPayee",
                domestic: "domesticPayee",
                international: "internationalPayee",
                domType: {
                    INDIA: "indiaDomesticPayee",
                    UK: "ukDomesticPayee",
                    SEPA: "sepaDomesticPayee"
                }
            };

        self.validateField = function (field) {
            if (self.currentAccountType() === "DOMESTIC") {
                return field !== "nickName" ? currentPayeeType.domestic + "." + currentPayeeType.domType[self.region()] + "." + field : "domesticPayee.nickName";
            } else if (self.currentAccountType() !== "DOMESTIC") {
                return currentPayeeType[self.currentAccountType().toLowerCase()] + "." + field;
            }
        };

        function loadPayeeAccountTypeList(region) {
            if (region !== "INDIA") { return; }

            addPayeeModel.getPayeeAccountType(region).then(function (data) {
                self.payeeAccountTypeList(data.enumRepresentations[0].data);
                self.isPayeeAccountTypeLoaded(true);
            });
        }

        function initializeModel() {
            if ((Params.rootModel.previousState || (Params.rootModel.params && Params.rootModel.params.isEdit)) && self.currentAccountType() === "DOMESTIC") {
                self.model(activePayload[self.currentAccountType()][self.region()]);
                self.model()[currentPayeeType.domType[self.region()]].contentId = self.contentId;
                loadPayeeAccountTypeList(self.region());
            } else if ((Params.rootModel.previousState || (Params.rootModel.params && Params.rootModel.params.isEdit)) && self.currentAccountType() !== "DOMESTIC") {
                self.model(activePayload[self.currentAccountType()]);
                self.model().contentId = self.contentId;
            }
        }

        initializeModel();

        function payeeLoadImage(contentId) {
            addPayeeModel.retrieveImage(contentId).then(function (data) {
                self.imageUploadFlag(false);
                ko.tasks.runEarly();

                if (data && data.contentDTOList[0]) {
                    self.preview("data:image/gif;base64," + data.contentDTOList[0].content);
                }

                self.imageUploadFlag(true);
            });
        }

        function groupLoadImage(contentId) {
            addPayeeModel.retrieveImage(contentId).then(function (data) {
                self.imageUploadFlag(false);
                ko.tasks.runEarly();

                if (data && data.contentDTOList[0]) {
                    self.defaultPreview("data:image/gif;base64," + data.contentDTOList[0].content);
                }

                self.imageUploadFlag(true);
            });
        }

        function readPayeeAndGroupDetails() {
            if (Params.rootModel.params && !Params.rootModel.params.fromAdhoc && Params.rootModel.params.isEdit) {
                addPayeeModel.getPayeeDetails(self.payeeId(), self.payeeGroupId(), self.payeeAccountType()).then(function (response) {
                    if (self.currentAccountType() === "DOMESTIC" && response[currentPayeeType[self.payeeAccountType()]][currentPayeeType.domType[self.region()]].contentId) {
                        payeeLoadImage(response[currentPayeeType[self.payeeAccountType()]][currentPayeeType.domType[self.region()]].contentId.value);

                        self.contentId(response[currentPayeeType[self.payeeAccountType()]][currentPayeeType.domType[self.region()]].contentId.value);
                        self.payeeImageAvailable(true);
                    } else if (response[currentPayeeType[self.payeeAccountType()]].contentId) {
                        payeeLoadImage(response[currentPayeeType[self.payeeAccountType()]].contentId.value);

                        self.contentId(response[currentPayeeType[self.payeeAccountType()]].contentId.value);
                        self.payeeImageAvailable(true);
                    }
                });
            }

            if (Params.dashboard.appData.segment !== "CORP") {
                addPayeeModel.getGroupDetails(self.payeeGroupId()).then(function (data) {
                    if (data.payeeGroup.contentId) {
                        groupLoadImage(data.payeeGroup.contentId.value);
                    }
                });
            }
        }

        const configurationDetails = {};

        self.imageUploadFlag = ko.observable();

        addPayeeModel.getPayeeMaintenance().then(function (data) {
            for (let k = 0; k < data.configurationDetails.length; k++) {
                configurationDetails[data.configurationDetails[k].propertyId] = data.configurationDetails[k].propertyValue;
            }

            if (Params.dashboard.appData.segment === "CORP") { self.imageUploadFlag(configurationDetails.CORPORATE_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0); } else { self.imageUploadFlag(configurationDetails.RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0); }

            if (self.imageUploadFlag()) {
                addPayeeModel.retrieveImageTypeSuuport().then(function (data) {
                    if (data) {
                        self.fileTypeArray(data.allowedImageMIMEType.split(","));
                        self.maxFileSize(data.maxSize);
                    }
                });
            }

            if (self.payeeGroupId() && self.imageUploadFlag() && !Params.rootModel.previousState) {
                readPayeeAndGroupDetails();
            }
        });

        self.imageCallBackHandler = function (data) {
            if (data) {
                self.payeeImageAvailable(true);
            } else {
                self.imageUploadFlag(false);
                self.payeeImageAvailable(false);
                ko.tasks.runEarly();
                self.imageUploadFlag(true);
            }
        };

        function createPayeeGroupValidations() {
            const payeeFormValidationFailed = !Params.baseModel.showComponentValidationErrors(document.getElementById("tracker")),
                networkCodeValidationFailed = !Params.baseModel.showComponentValidationErrors(document.getElementById("verify-code-tracker") || document.getElementById("verify-swiftCode-tracker") || document.getElementById("verify-ncc-tracker") || document.getElementById("verify-bank-details-tracker") || document.getElementById("verify-sortcode-tracker") || document.getElementById("verify-bankCode-tracker")),
                payeeNameValidationFailed = !Params.baseModel.showComponentValidationErrors(document.getElementById("payee-name-tracker")),
                payeeNickNameValidationFailed = !Params.baseModel.showComponentValidationErrors(document.getElementById("payee-nickname-tracker"));
            let payeeAccountTypeFailed = false;

            if (document.getElementById("verify-accountType-tracker")) {
                payeeAccountTypeFailed = !Params.baseModel.showComponentValidationErrors(document.getElementById("verify-accountType-tracker"));
            }

            if (payeeFormValidationFailed || networkCodeValidationFailed || payeeNameValidationFailed || payeeNickNameValidationFailed || payeeAccountTypeFailed) {
                return true;
            }
        }

        let editPayeePayload;

        function updatePayeeDetails() {
            if (createPayeeGroupValidations()) {
                return;
            }

            editPayeePayload = self.addRecipient();

            if (editPayeePayload) {
                addPayeeModel.validateRequest(self.payeeId(), self.payeeGroupId(), self.currentAccountType().toLowerCase(), ko.toJSON(editPayeePayload)).then(function () {
                    self.readPayee();
                });
            }
        }

        self.uploadImage = function () {
            if (self.file()) {
                const form = new FormData();

                form.append("file", self.file());
                form.append("moduleIdentifier", "PAYEE");
                form.append("isThumbnail", "true");
                form.append("isShared", "true");

                addPayeeModel.uploadImage(form).done(function (data) {
                    if (data && data.contentDTOList[0] && data.contentDTOList[0].contentId) {
                        self.contentId(data.contentDTOList[0].contentId.value);

                        if (Params.rootModel.params && Params.rootModel.params.isEdit) {
                            updatePayeeDetails();
                        } else {
                            self.createPayeeGroup();
                        }
                    }
                });
            } else if (Params.rootModel.params && Params.rootModel.params.isEdit) {

                updatePayeeDetails();
            } else {
                self.createPayeeGroup();
            }
        };

        let cnfaccountValue,
            accountValue;

        self.confirmValue = ko.observable();

        function AccountNoValidator_fn(value) {
            accountValue = value;

            if (value) {
                if (cnfaccountValue) {
                    if (value === cnfaccountValue) {
                        document.getElementById("confirmAccNumber").validate();
                    } else { throw new oj.ValidatorError("ERROR", self.payments.payee.message.accountNoValidation); }
                } else if (self.confirmValue()) {
                    if (value !== self.confirmValue()) { throw new oj.ValidatorError("ERROR", self.payments.payee.message.accountNoValidation); }
                }
            }
        }

        function cnfAccountNoValidator_fn(value) {
            if ((self.accountNumber() && self.accountNumber() !== "") || value) {
                cnfaccountValue = value;

                if (accountValue !== cnfaccountValue) {
                    if (self.accountNumber() !== value) {
                        self.accountNumber("");
                        throw new oj.ValidatorError("ERROR", self.payments.payee.message.accountNoValidation);
                    }
                } else if (accountValue === cnfaccountValue) {
                    self.confirmValue(cnfaccountValue);
                    cnfaccountValue = "";
                    AccountNoValidator_fn(accountValue);
                    document.getElementById("accNumber").validate();
                }
            } else { throw new oj.ValidatorError("ERROR", self.payments.payee.message.validationMessage); }
        }

        self.accountNoValidator = ko.observableArray([]);

        self.accountNoValidator.push({
            validate: AccountNoValidator_fn
        });

        self.confirmAccountNoValidator = [{
            validate: cnfAccountNoValidator_fn
        }];

        self.restrictedEvent = function () {
            $("#accNumber").bind("copy paste cut", function (e) {
                e.preventDefault();
            });

            $("#confirmAccNumber").bind("copy paste cut", function (e) {
                e.preventDefault();
            });
        };

        function getPayeeLimits() {
            addPayeeModel.getPayeeLimit().done(function (data) {
                if (data.limitPackageDTOList && data.limitPackageDTOList.length > 0) {
                    for (let k = 0; k < data.limitPackageDTOList.length; k++) {
                        if (data.limitPackageDTOList[k].targetLimitLinkages && data.limitPackageDTOList[k].targetLimitLinkages.length > 0) {
                            for (let i = 0; i < data.limitPackageDTOList[k].targetLimitLinkages.length; i++) {
                                if (data.limitPackageDTOList[k].targetLimitLinkages[i].target.type.id === "PAYEE") {
                                    if (data.limitPackageDTOList[k].targetLimitLinkages[i].limits && data.limitPackageDTOList[k].targetLimitLinkages[i].limits[0].periodicity) {
                                        if ((!data.limitPackageDTOList[k].targetLimitLinkages[i].expiryDate || new Date(data.limitPackageDTOList[k].targetLimitLinkages[i].expiryDate) > Params.baseModel.getDate()) && !(new Date(data.limitPackageDTOList[k].targetLimitLinkages[i].effectiveDate) > Params.baseModel.getDate())) {
                                            if (!payeeLimitsMap[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value]) { payeeLimitsMap[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value] = {}; }

                                            for (let j = 0; j < data.limitPackageDTOList[k].targetLimitLinkages[i].limits.length; j++) {
                                                payeeLimitsMap[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value][data.limitPackageDTOList[k].targetLimitLinkages[i].limits[j].periodicity] = {
                                                    periodicity: data.limitPackageDTOList[k].targetLimitLinkages[i].limits[j].periodicity,
                                                    maxAmount: data.limitPackageDTOList[k].targetLimitLinkages[i].limits[j].maxAmount,
                                                    effectiveDate: data.limitPackageDTOList[k].targetLimitLinkages[i].effectiveDate,
                                                    expiryDate: data.limitPackageDTOList[k].targetLimitLinkages[i].expiryDate,
                                                    isEffectiveFromTomorrow: new Date(data.limitPackageDTOList[k].targetLimitLinkages[i].effectiveDate) > Params.baseModel.getDate()
                                                };

                                                payeeLimitsMap[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value][data.limitPackageDTOList[k].targetLimitLinkages[i].limits[j].periodicity].maxAmount.amount = ko.observable(payeeLimitsMap[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value][data.limitPackageDTOList[k].targetLimitLinkages[i].limits[j].periodicity].maxAmount.amount);

                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    self.limitPackage().data = data;
                }
            });
        }

        getPayeeLimits();

        function registerComponents(moduleComp) {
            for (i = 0; i < self.componentList.length; i++) {
                Params.baseModel.registerComponent(self.componentList[i].id, moduleComp);
            }
        }

        self.componentList = [{
            id: "internal-payee"
        },
        {
            id: "domestic-payee"
        },
        {
            id: "uk-payee"
        },
        {
            id: "sepa-payee"
        },
        {
            id: "international-payee"
        },
        {
            id: "payments-payee-list"
        },
        {
            id: "ifsc-lookup"
        }
        ];

        registerComponents("payee");

        self.componentList = [{
            id: "payments-money-transfer"
        }];

        self.accountTypes = [{
            id: "INTERNAL",
            text: self.payments.payee.accinternal
        }, {
            id: "DOMESTIC",
            text: self.payments.payee.accdomestic
        }, {
            id: "INTERNATIONAL",
            text: self.payments.payee.accinternational
        }];

        registerComponents("payments");

        Params.baseModel.registerElement("confirm-screen");
        self.model(self.model() || self.internalPayeePayload);
        self.payeeAccountType(self.payeeAccountType() || "internal");

        self.accountTypeChanged = function (event) {
            if (event) {
                self.currentAccountType(event.detail.value);
            }

            self.validateDTO(Params.dashboard.getTaxonomyDefinition(validateDTOList[self.currentAccountType()]));
            self.typeOfAccount(null);
            self.typeOfAccountDescription(null);
            self.isComponentLoaded(false);
            self.isCollingPeriodSlot(false);

            if (self.currentRelationType() === "ACC" && self.currentAccountType() === "INTERNAL") {
                self.selectedComponent("internal-payee");
                self.model(self.internalPayeePayload);
                self.accountNumber("");
                self.ConfirmaccountNumber("");
                self.payeeNickName("");
                self.accountName("");
                self.createLimitsMessage("PC_F_INTRNL");
                self.payeeAccountType("internal");
            } else if (self.region() === "INDIA" && self.currentRelationType() === "ACC" && self.currentAccountType() === "DOMESTIC") {
                self.selectedComponent("domestic-payee");
                self.model(self.domesticIndiaAccBasedPayeePayload);
                self.accountNumber("");
                self.ConfirmaccountNumber("");
                self.payeeNickName("");
                self.accountName("");
                self.bankDetailsCode("");
                self.createLimitsMessage("PC_F_DOM_NEFT");
                self.payeeAccountType("domestic");
                self.isPayeeAccountTypeLoaded(false);

                loadPayeeAccountTypeList(self.region());
            } else if (self.region() === "UK" && self.currentRelationType() === "ACC" && self.currentAccountType() === "DOMESTIC") {
                self.selectedComponent("uk-payee");
                self.model(self.domesticUKAccBasedPayeePayload);
                self.accountNumber("");
                self.ConfirmaccountNumber("");
                self.payeeNickName("");
                self.accountName("");
                self.bankDetailsCode("");
                self.createLimitsMessage("PC_F_UK_URG");
                self.payeeAccountType("domestic");
            } else if (self.region() === "SEPA" && self.currentRelationType() === "ACC" && self.currentAccountType() === "DOMESTIC") {
                self.selectedComponent("sepa-payee");
                self.accountNumber("");
                self.ConfirmaccountNumber("");
                self.payeeNickName("");
                self.model(self.domesticSepaAccBasedPayeePayload);
                self.createLimitsMessage("PC_F_SEPA_CARD");
                self.payeeAccountType("domestic");
            } else if (self.currentRelationType() === "ACC" && self.currentAccountType() === "INTERNATIONAL") {
                self.model(self.internationalAccBasedPayeePayload);
                self.selectedComponent("international-payee");
                self.accountNumber("");
                self.ConfirmaccountNumber("");
                self.payeeNickName("");
                self.accountName("");
                self.bankDetailsCode("");
                self.createLimitsMessage("PC_F_IT");
                self.payeeAccountType("international");
            }

            if (self.payeeData && !self.payeeData.payeeGroupId) {
                self.payeeName("");
            }

            ko.tasks.runEarly();
            self.additionalBankDetails(null);
            self.network("");
            self.isComponentLoaded(true);
        };

        Params.baseModel.registerComponent("warning-message-dialog", "payee");

        self.networkTypeChanged = function (event) {
            if (event.detail.value === "value" && event.detail.previousValue !== event.detail.value) {
                self.resetCode();

                if (event.detail.value === "NEFT") {
                    self.createLimitsMessage("PC_F_DOM_NEFT");
                } else if (event.detail.value === "RTGS") {
                    self.createLimitsMessage("PC_F_DOM_RTGS");
                } else if (event.detail.value === "IMPS") {
                    self.createLimitsMessage("PC_F_DOM_IMPS");
                } else if (event.detail.value === "CRT") {
                    self.createLimitsMessage("PC_F_SEPA_CREDIT");
                } else if (event.detail.value === "CAT") {
                    self.createLimitsMessage("PC_F_SEPA_CARD");
                }
            }
        };

        self.resetCode = function () {
            self.bankDetailsCode(null);
            self.additionalBankDetails(null);
            ko.tasks.runEarly();
        };

        self.cancel = function () {
            if (!self.stageOne()) {
                self.cancelConfirmation();
                history.back();
            } else {
                Params.dashboard.switchModule(true);
            }
        };

        self.cancelRecipient = function () {
            self.stageOne(true);
            self.stageTwo(false);
            self.currentRelationType("");

            if (self.payeeData === null) {
                self.payeeName("");
            }
        };

        self.cancelConfirmation = function () {
            if (self.payeeGroupId()) {
                addPayeeModel.readPayee(self.payeeGroupId(), self.payeeId(), self.payeeAccountType()).done(function (data) {
                    let status;

                    if (data.internalPayee) {
                        status = data.internalPayee.status;
                    } else if (data.domesticPayee) {
                        status = data.domesticPayee.status;
                    } else if (data.internationalPayee) {
                        status = data.internationalPayee.status;
                    }

                    if (status !== "ACT") {
                        addPayeeModel.deletePayee(self.payeeGroupId(), self.payeeId(), self.payeeAccountType()).done(function () {
                            isPayeeGroupCreated = false;
                        });
                    }
                });
            }
        };

        self.accessTypes = [{
            id: "PRIVATE",
            label: self.payments.payee.isShared.false
        },
        {
            id: "PUBLIC",
            label: self.payments.payee.isShared.true
        }
        ];

        function addInternalRecipient() {
            if (Params.dashboard.appData.segment === "CORP") {
                self.internalPayeePayload.shared(self.shared());
            }

            const accNumber = self.accountNumber();

            self.payeeAccountType("internal");
            self.internalPayeePayload.name = self.payeeName;
            self.internalPayeePayload.nickName = self.payeeNickName;
            self.internalPayeePayload.accountNumber(accNumber);
            self.internalPayeePayload.accountName = self.accountName;

            const internalPayeePayload = ko.toJSON(self.internalPayeePayload);

            if (Params.rootModel.params && Params.rootModel.params.isEdit) {
                return self.internalPayeePayload;
            }

            addPayeeModel.addPayee(self.payeeGroupId(), self.payeeAccountType(), internalPayeePayload).done(function (data) {
                self.payeeId(data.internalPayee.id);
                self.readPayee();
            }).fail(function () {
                self.deletePayeeGroup();
            });
        }

        function addIndiaDomRecipient() {
            if (Params.dashboard.appData.segment === "CORP") {
                self.domesticIndiaAccBasedPayeePayload.indiaDomesticPayee.shared(self.shared());
            } else {
                self.domesticIndiaAccBasedPayeePayload.indiaDomesticPayee.shared();
            }

            self.payeeAccountType("domestic");
            self.domesticIndiaAccBasedPayeePayload.indiaDomesticPayee.accountType = self.typeOfAccount;

            self.typeOfAccountDescription(ko.utils.arrayFirst(ko.mapping.toJS(self.payeeAccountTypeList()), function (element) {
                return element.code === self.typeOfAccount();
            }).description);

            self.domesticIndiaAccBasedPayeePayload.nickName = self.payeeNickName;
            self.domesticIndiaAccBasedPayeePayload.indiaDomesticPayee.name = self.payeeName;
            self.domesticIndiaAccBasedPayeePayload.indiaDomesticPayee.nickName = self.payeeNickName;
            self.domesticIndiaAccBasedPayeePayload.indiaDomesticPayee.accountNumber = self.accountNumber;
            self.domesticIndiaAccBasedPayeePayload.indiaDomesticPayee.accountName = self.accountName;
            self.domesticIndiaAccBasedPayeePayload.indiaDomesticPayee.bankDetails.code = self.bankDetailsCode;

            const domesticIndiaAccBasedPayeePayload = ko.toJSON(self.domesticIndiaAccBasedPayeePayload);

            if (Params.rootModel.params && Params.rootModel.params.isEdit) {
                return self.domesticIndiaAccBasedPayeePayload;
            }

            addPayeeModel.addPayee(self.payeeGroupId(), self.payeeAccountType(), domesticIndiaAccBasedPayeePayload).done(function (data) {
                self.payeeId(data.domesticPayee.id);
                self.readPayee();
            }).fail(function () {
                self.deletePayeeGroup();
            });
        }

        function addUkDomRecipient() {
            if (Params.dashboard.appData.segment === "CORP") {
                self.domesticUKAccBasedPayeePayload.ukDomesticPayee.shared(self.shared());
            } else {
                self.domesticUKAccBasedPayeePayload.ukDomesticPayee.shared();
            }

            self.domesticUKAccBasedPayeePayload.nickName = self.payeeNickName;
            self.domesticUKAccBasedPayeePayload.ukDomesticPayee.name = self.payeeName;
            self.domesticUKAccBasedPayeePayload.ukDomesticPayee.nickName = self.payeeNickName;
            self.domesticUKAccBasedPayeePayload.ukDomesticPayee.paymentType = self.paymentType();
            self.domesticUKAccBasedPayeePayload.ukDomesticPayee.network = self.network();
            self.domesticUKAccBasedPayeePayload.ukDomesticPayee.accountName = self.accountName;
            self.domesticUKAccBasedPayeePayload.ukDomesticPayee.accountNumber = self.accountNumber;
            self.domesticUKAccBasedPayeePayload.ukDomesticPayee.bankDetails.code = self.bankDetailsCode;

            const domesticUKAccBasedPayeePayload = ko.toJSON(self.domesticUKAccBasedPayeePayload);

            if (Params.rootModel.params && Params.rootModel.params.isEdit) {
                return self.domesticUKAccBasedPayeePayload;
            }

            addPayeeModel.addPayee(self.payeeGroupId(), self.payeeAccountType(), domesticUKAccBasedPayeePayload).done(function (data) {
                self.payeeId(data.domesticPayee.id);
                self.readPayee();
            }).fail(function () {
                self.deletePayeeGroup();
            });
        }

        function addSepaDomRecipient() {
            if (Params.dashboard.appData.segment === "CORP") {
                self.domesticSepaAccBasedPayeePayload.sepaDomesticPayee.shared(self.shared());
            } else {
                self.domesticSepaAccBasedPayeePayload.sepaDomesticPayee.shared();
            }

            self.domesticSepaAccBasedPayeePayload.nickName = self.payeeNickName;
            self.domesticSepaAccBasedPayeePayload.sepaDomesticPayee.name = self.payeeName;
            self.domesticSepaAccBasedPayeePayload.sepaDomesticPayee.nickName = self.payeeNickName;
            self.domesticSepaAccBasedPayeePayload.sepaDomesticPayee.iban = self.accountNumber;
            self.domesticSepaAccBasedPayeePayload.sepaDomesticPayee.accountName = self.accountName;
            self.domesticSepaAccBasedPayeePayload.sepaDomesticPayee.sepaType = self.sepaType();
            self.domesticSepaAccBasedPayeePayload.sepaDomesticPayee.bankDetails.code = self.bankDetailsCode;

            const domesticSepaAccBasedPayeePayload = ko.toJSON(self.domesticSepaAccBasedPayeePayload);

            if (Params.rootModel.params && Params.rootModel.params.isEdit) {
                return self.domesticSepaAccBasedPayeePayload;
            }

            addPayeeModel.addPayee(self.payeeGroupId(), self.payeeAccountType(), domesticSepaAccBasedPayeePayload).done(function (data) {
                self.payeeId(data.domesticPayee.id);
                self.readPayee();
            }).fail(function () {
                self.deletePayeeGroup();
            });
        }

        function addInternationalRecipient() {
            if (Params.dashboard.appData.segment === "CORP") {
                self.internationalAccBasedPayeePayload.shared(self.shared());
            } else {
                self.internationalAccBasedPayeePayload.shared();
            }

            self.payeeAccountType("international");
            self.internationalAccBasedPayeePayload.name = self.payeeName;
            self.internationalAccBasedPayeePayload.nickName = self.payeeNickName;
            self.internationalAccBasedPayeePayload.accountNumber = self.accountNumber;
            self.internationalAccBasedPayeePayload.accountName = self.accountName;
            self.internationalAccBasedPayeePayload.network = self.network();

            if (self.network() === "SPE") {
                self.internationalAccBasedPayeePayload.bankDetails.name = self.bankName;
                self.internationalAccBasedPayeePayload.bankDetails.address = self.bankAddress;
                self.internationalAccBasedPayeePayload.bankDetails.country = self.country();
                self.internationalAccBasedPayeePayload.bankDetails.city = self.city;
            }

            self.internationalAccBasedPayeePayload.bankDetails.code = self.bankDetailsCode;

            const internationalAccBasedPayeePayload = ko.toJSON(self.internationalAccBasedPayeePayload);

            if (Params.rootModel.params && Params.rootModel.params.isEdit) {
                return self.internationalAccBasedPayeePayload;
            }

            addPayeeModel.addPayee(self.payeeGroupId(), self.payeeAccountType(), internationalAccBasedPayeePayload).done(function (data) {
                self.payeeId(data.internationalPayee.id);
                self.readPayee();
            }).fail(function () {
                self.deletePayeeGroup();
            });
        }

        self.addRecipient = function () {
            if (!Params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }

            if (self.accessType() === "PUBLIC") {
                self.shared(true);
            }

            if (self.accessType() === "PRIVATE") {
                self.shared(false);
            }

            if (self.currentRelationType() === "ACC" && self.currentAccountType() === "INTERNAL") {
                return addInternalRecipient();
            } else if (self.region() === "INDIA" && self.currentRelationType() === "ACC" && self.currentAccountType() === "DOMESTIC") {
                return addIndiaDomRecipient();
            } else if (self.region() === "UK" && self.currentRelationType() === "ACC" && self.currentAccountType() === "DOMESTIC") {
                return addUkDomRecipient();
            } else if (self.region() === "SEPA" && self.currentRelationType() === "ACC" && self.currentAccountType() === "DOMESTIC") {
                return addSepaDomRecipient();
            } else if (self.currentRelationType() === "ACC" && self.currentAccountType() === "INTERNATIONAL") {
                return addInternationalRecipient();
            }
        };

        Params.baseModel.registerComponent("review-internal-payee", "payee");
        Params.baseModel.registerComponent("review-domestic-payee", "payee");
        Params.baseModel.registerComponent("review-international-payee", "payee");

        self.readPayee = function () {
            addPayeeModel.readPayee(self.payeeGroupId(), self.payeeId(), self.payeeAccountType()).then(function (data) {
                self.isComponentLoaded(false);

                const params = {
                    reviewMode: true,
                    payeeId: self.payeeId,
                    header: Params.dashboard.headerName(),
                    payeeGroupId: self.payeeGroupId,
                    payeeType: self.payeeAccountType,
                    address: self.currentAccountType() === "INTERNATIONAL" ? self.internationalAccBasedPayeePayload.address : null,
                    isEdit: Params.rootModel.params && Params.rootModel.params.isEdit,
                    editPayeePayload: Params.rootModel.params && Params.rootModel.params.isEdit ? editPayeePayload : null,
                    isNew: self.isNew,
                    currentAccountType: self.currentAccountType,
                    payeeName: self.payeeName,
                    contentId: self.contentId,
                    preview: self.preview,
                    defaultPreview: self.defaultPreview,
                    payeeImageAvailable: self.payeeImageAvailable,
                    payeeAccountType: self.payeeAccountType,
                    payeeAccountTypeList: self.payeeAccountTypeList,
                    typeOfAccount: self.typeOfAccount,
                    typeOfAccountDescription: self.typeOfAccountDescription,
                    payeeNickName: self.payeeNickName,
                    accessType: self.accessType,
                    accountNumber: self.accountNumber,
                    ConfirmaccountNumber: self.ConfirmaccountNumber,
                    accountName: self.accountName,
                    bankDetailsCode: self.bankDetailsCode,
                    bankName: self.bankName,
                    bankAddress: self.bankAddress,
                    sepaType: self.sepaType,
                    country: self.country,
                    city: self.city,
                    network: self.network,
                    paymentType: self.paymentType,
                    limitPackage: self.limitPackage,
                    payeeLimitsMap: self.payeeLimitsMap,
                    selectedComponent: self.selectedComponent,
                    region: self.region,
                    model: self.model
                };

                if (self.payeeAccountType() === "internal") {
                    self.model(ko.mapping.fromJS(data.internalPayee));

                    Params.dashboard.loadComponent("review-internal-payee", ko.mapping.toJS(params));
                } else if (self.payeeAccountType() === "domestic") {
                    self.model(ko.mapping.fromJS(data.domesticPayee));

                    Params.dashboard.loadComponent("review-domestic-payee", ko.mapping.toJS(params));
                } else if (self.payeeAccountType() === "international") {
                    self.model(ko.mapping.fromJS(data.internationalPayee));

                    Params.dashboard.loadComponent("review-international-payee", ko.mapping.toJS(params));
                }

                self.stageOne(false);
                self.stageTwo(true);
                self.isComponentLoaded(true);
            });
        };

        self.createPayeeGroup = function () {
            if (createPayeeGroupValidations()) {
                return;
            }

            if (Params.dashboard.appData.segment !== "CORP" && (!self.isNew() || isPayeeGroupCreated)) {
                isPayeeGroupCreated = true;

                if (self.currentAccountType() === "DOMESTIC") {
                    activePayload[self.currentAccountType()][self.region()][currentPayeeType.domType[self.region()]].contentId(self.contentId());
                } else {
                    activePayload[self.currentAccountType()].contentId(self.contentId());
                }

                self.addRecipient();

                return;
            } else if (Params.dashboard.appData.segment === "CORP") {
                if (self.currentAccountType() === "DOMESTIC") {
                    activePayload[self.currentAccountType()][self.region()][currentPayeeType.domType[self.region()]].contentId(self.contentId());
                } else {
                    activePayload[self.currentAccountType()].contentId(self.contentId());
                }
            }

            self.payeeGroupPayload.name(self.payeeName());
            self.payeeGroupPayload.contentId(self.contentId());

            const payload = ko.toJSON(self.payeeGroupPayload);

            addPayeeModel.createPayeeGroup(payload).done(function (data) {
                self.payeeGroupId(data.payeeGroup.groupId);
                isPayeeGroupCreated = true;
                self.addRecipient();
            });
        };

        self.deletePayeeGroup = function () {
            self.isComponentLoaded(false);

            if (self.isNew()) {
                addPayeeModel.deletePayeeGroup(self.payeeGroupId()).done(function () {
                    self.stageTwo(false);
                    self.stageTwoPointTwo(false);
                    self.accountTypeChanged();
                    self.stageOne(true);
                    self.isComponentLoaded(true);
                    isPayeeGroupCreated = false;
                });
            } else {
                self.stageTwo(false);
                self.stageTwoPointTwo(false);
                self.accountTypeChanged();
                self.stageOne(true);
                self.isComponentLoaded(true);
            }
        };

        self.additionalBankDetails.subscribe(function (newValue) {
            self.bankDetailsCode(newValue ? newValue.code : null);
        });

        self.tempcurrency = ko.observable("GBP");

        addPayeeModel.fetchBankConfiguration().done(function (data) {
            self.tempcurrency(data.bankConfigurationDTO.localCurrency);
            self.region(data.bankConfigurationDTO.region);
        });
    };
});