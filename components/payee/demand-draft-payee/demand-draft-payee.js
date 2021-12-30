define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "ojL10n!resources/nls/demand-draft-payee",
    "ojs/ojinputnumber",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojselectcombobox",
    "ojs/ojbutton",
    "ojs/ojknockout-validation",
    "ojs/ojtable",
    "ojs/ojavatar",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojvalidationgroup"
], function(oj, ko, addPayeeModel, ResourceBundle) {
    "use strict";

    return function(Params) {
        const self = this;
        let isPayeeGroupCreated = false,
            i = 0,
            j = 0;
        const limitsMap = {},
            payeeLimitsMap = {},
            payeeLimitsMap2 = {},
            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(addPayeeModel.getNewModel());

                return KoModel;
            };

        self.payments = ResourceBundle.payments;
        self.common = ResourceBundle.payments.common;
        self.currentRelationType = ko.observable("DD");
        self.currentAccountType = ko.observable("DOMESTIC");
        self.payeeName = ko.observable();
        self.payeeId = ko.observable();
        self.payeeNickName = ko.observable();
        self.addressDescription = ko.observable();
        self.payeeGroupId = ko.observable(null);
        self.selectedCountry = ko.observable();
        self.payeeGroupPayload = getNewKoModel().payeeGroup;
        self.internationalDDPayeePayload = getNewKoModel().internationalDDPayeeModel;
        self.domesticDDPayeePayload = getNewKoModel().domesticDDPayeeModel;
        self.payeeLimitModel = getNewKoModel().payeeLimitModel;
        self.accessType = ko.observable("PRIVATE");
        self.file = ko.observable();
        self.contentId = ko.observable();
        self.preview = ko.observable();
        self.defaultPreview = ko.observable();
        self.fileId = ko.observable("input");
        self.imageId = ko.observable("target");
        self.isImageExist = ko.observable();
        self.isComponentLoaded = ko.observable();
        self.selectedComponent = ko.observable("domestic-demand-draft");
        self.type = ko.observable();
        self.file = ko.observable();
        self.fileTypeArray = ko.observableArray();
        self.maxFileSize = ko.observable();
        self.payeeImageAvailable = ko.observable();
        ko.utils.extend(self, Params.rootModel.previousState ? ko.mapping.fromJS(Params.rootModel.previousState) : Params.rootModel.params.fromAdhoc || Params.rootModel.params.isEdit ? ko.mapping.fromJS(Params.rootModel.params) : Params.rootModel);
        self.model = ko.observable(Params.rootModel.previousState ? Params.rootModel.previousState.model : null);
        self.addressDetails = getNewKoModel().addressDetails;
        self.payments = ResourceBundle.payments;

        if (Params.rootModel.previousState || Params.rootModel.params.fromAdhoc || Params.rootModel.params.isEdit) {
            if (Params.rootModel.previousState && Params.rootModel.previousState.modeofDelivery === "OTHADD") {
                ko.utils.extend(self.addressDetails, ko.mapping.fromJS(Params.rootModel.previousState.addressDetails));
            } else {
                const addressDetails = (Params.rootModel.previousState && Params.rootModel.previousState.addressDetails) || (Params.rootModel.params && Params.rootModel.params.addressDetails);

                self.addressDetails.addressTypeDescription(addressDetails.modeofDelivery === "MAI" ? addressDetails.addressTypeDescription : "");
                self.addressDetails.addressType(addressDetails.addressType ? addressDetails.addressType : "");
                self.addressDetails.modeofDelivery(addressDetails.modeofDelivery);
                self.addressDetails.postalAddress.line1(addressDetails.postalAddress.line1);
                self.addressDetails.postalAddress.line2(addressDetails.postalAddress.line2);
                self.addressDetails.postalAddress.line3(addressDetails.postalAddress.line3);
                self.addressDetails.postalAddress.line4(addressDetails.postalAddress.line4);
                self.addressDetails.postalAddress.line5(addressDetails.postalAddress.line5);
                self.addressDetails.postalAddress.line6(addressDetails.postalAddress.line6);
                self.addressDetails.postalAddress.line7(addressDetails.postalAddress.line7);
                self.addressDetails.postalAddress.line8(addressDetails.postalAddress.line8);
                self.addressDetails.postalAddress.line9(addressDetails.postalAddress.line9);
                self.addressDetails.postalAddress.line10(addressDetails.postalAddress.line10);
                self.addressDetails.postalAddress.city(addressDetails.postalAddress.city);
                self.addressDetails.postalAddress.state(addressDetails.postalAddress.state);
                self.addressDetails.postalAddress.zipCode(addressDetails.postalAddress.zipCode);
                self.addressDetails.postalAddress.country(addressDetails.postalAddress.country);
                self.addressDetails.postalAddress.branch(addressDetails.postalAddress.branch);
                self.addressDetails.postalAddress.branchName(addressDetails.postalAddress.branchName);
            }
        }

        self.payeeData = ko.toJS(Params.rootModel.params);
        Params.dashboard.headerName(Params.rootModel.params && !Params.rootModel.params.isEdit ? self.payments.addrecipient_header : self.payments.editrecipient_header);

        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        self.stageTwoPointTwo = ko.observable(false);
        self.stageFour = ko.observable(false);
        self.stageFive = ko.observable(false);
        self.authKey = ko.observable();
        self.invalidOtpEntered = ko.observable(false);
        self.stageThree = ko.observable(false);
        self.shared = ko.observable();
        self.validationTracker = ko.observable();
        self.isNew = ko.observable(true);
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

        self.limitPackage = ko.observable({
            exists: false,
            data: null
        });

        self.CoolingPeriodDataSource = ko.observable();
        self.isCollingPeriodSlot = ko.observable(false);

        self.createLimitsMessage = function(taskcode) {
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

        Params.baseModel.registerComponent("image-upload", "goals");

        if (!Params.rootModel.previousState && self.payeeData.payeeGroupId) {
            self.payeeName(self.payeeData.payeeName);
            self.payeeGroupId(self.payeeData.payeeGroupId);
            self.preview(ko.utils.unwrapObservable(self.payeeData.preview));
            self.isNew(false);
        }

        addPayeeModel.init();

        addPayeeModel.fetchEffectiveTodayDetails().done(function(data) {
            if (data.isEffectiveSameDay === "Y") { self.effectiveSameDayFlag(true); }
        });

        addPayeeModel.assignedLimitPackages().done(function(assigned) {
            if (assigned.limitPackageDTOList && assigned.limitPackageDTOList.length > 0) { self.limitCurrency(assigned.limitPackageDTOList[0].targetLimitLinkages[0].limits[0].currency); }

            if (assigned.limitPackageDTOList && assigned.limitPackageDTOList[0].targetLimitLinkages && assigned.limitPackageDTOList[0].targetLimitLinkages.length > 0) {
                for (j = 0; j < assigned.limitPackageDTOList[0].targetLimitLinkages.length; j++) {
                    for (let k = 0; k < assigned.limitPackageDTOList[0].targetLimitLinkages[j].limits.length; k++) {
                        if (assigned.limitPackageDTOList[0].targetLimitLinkages[j].limits[k].limitType === "DUR") {
                            limitsMap[assigned.limitPackageDTOList[0].targetLimitLinkages[j].target.value] = assigned.limitPackageDTOList[0].targetLimitLinkages[j].limits[k];
                        }
                    }
                }

 if(Params.rootModel && Params.rootModel.params && Params.rootModel.params.isEdit){
               if(Params.rootModel.params.currentRelationType === "DD" && Params.rootModel.params.currentAccountType === "INTERNATIONAL")
                    {self.createLimitsMessage("PC_F_ID");}
                else if(Params.rootModel.params.currentRelationType === "DD" && Params.rootModel.params.currentAccountType === "DOMESTIC")
                    {self.createLimitsMessage("PC_F_DOMDRAFT");}

        }
        else
                {self.createLimitsMessage("PC_F_DOMDRAFT");}
            }
        });

        const activePayload = {
            DOMESTIC: self.domesticDDPayeePayload,
            INTERNATIONAL: self.internationalDDPayeePayload
        };

        function initializeModel() {
            if (Params.rootModel.previousState || (Params.rootModel.params && Params.rootModel.params.isEdit)) {
                self.model(activePayload[self.currentAccountType()]);
                self.model().contentId = self.contentId;
            }
        }

        initializeModel();

        function payeeLoadImage(contentId) {
            addPayeeModel.retrieveImage(contentId).then(function(data) {
                self.imageUploadFlag(false);
                ko.tasks.runEarly();

                if (data && data.contentDTOList[0]) {
                    self.preview("data:image/gif;base64," + data.contentDTOList[0].content);
                }

                self.imageUploadFlag(true);
            });
        }

        function groupLoadImage(contentId) {
            addPayeeModel.retrieveImage(contentId).then(function(data) {
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
                addPayeeModel.getPayeeDetails(self.payeeId(), self.payeeGroupId()).then(function(response) {
                    if (response.demandDraftPayeeDTO.contentId) {
                        payeeLoadImage(response.demandDraftPayeeDTO.contentId.value);

                        self.contentId(response.demandDraftPayeeDTO.contentId.value);
                        self.payeeImageAvailable(true);
                    }
                });
            }

            if (Params.dashboard.appData.segment !== "CORP") {
                addPayeeModel.getGroupDetails(self.payeeGroupId()).then(function(data) {
                    if (data.payeeGroup.contentId) {
                        groupLoadImage(data.payeeGroup.contentId.value);
                    }
                });
            }
        }

        const configurationDetails = {};

        self.imageUploadFlag = ko.observable();

        addPayeeModel.getPayeeMaintenance().then(function(data) {
            for (let k = 0; k < data.configurationDetails.length; k++) {
                configurationDetails[data.configurationDetails[k].propertyId] = data.configurationDetails[k].propertyValue;
            }

            if (Params.dashboard.appData.segment === "CORP") { self.imageUploadFlag(configurationDetails.CORPORATE_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0); } else { self.imageUploadFlag(configurationDetails.RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0); }

            if (self.imageUploadFlag()) {
                addPayeeModel.retrieveImageTypeSuuport().then(function(data) {
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

        self.imageCallBackHandler = function(data) {
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
            const payeeNameValidationFailed = !Params.baseModel.showComponentValidationErrors(document.getElementById("dd-payee-name-tracker")),
                ddPayeeValidationFailed = !Params.baseModel.showComponentValidationErrors(document.getElementById("dd-payee-tracker"));

            if (payeeNameValidationFailed || ddPayeeValidationFailed) {
                return true;
            }
        }

        let editPayeePayload;

        function updatePayeeDetails() {
            if (createPayeeGroupValidations()) {
                return;
            }

            editPayeePayload = self.addRecipient();
            self.model(editPayeePayload);

            if (editPayeePayload) {
                addPayeeModel.validateRequest(self.payeeId(), self.payeeGroupId(), ko.toJSON(editPayeePayload)).then(function() {
                    self.invokeReadPayee();
                });
            }
        }

        self.uploadImage = function() {
            if (self.file()) {
                const form = new FormData();

                form.append("file", self.file());
                form.append("moduleIdentifier", "PAYEE");
                form.append("isThumbnail", "true");
                form.append("isShared", "true");

                addPayeeModel.uploadImage(form).done(function(data) {
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

        function getPayeeLimits() {
            addPayeeModel.getPayeeLimit().done(function(data) {
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

                                        if (!data.limitPackageDTOList[k].targetLimitLinkages[i].expiryDate && new Date(data.limitPackageDTOList[k].targetLimitLinkages[i].effectiveDate) > Params.baseModel.getDate()) {
                                            if (!payeeLimitsMap2[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value]) { payeeLimitsMap2[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value] = {}; }

                                            for (let f = 0; f < data.limitPackageDTOList[k].targetLimitLinkages[i].limits.length; f++) {
                                                payeeLimitsMap2[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value][data.limitPackageDTOList[k].targetLimitLinkages[i].limits[f].periodicity] = {
                                                    periodicity: data.limitPackageDTOList[k].targetLimitLinkages[i].limits[f].periodicity,
                                                    maxAmount: data.limitPackageDTOList[k].targetLimitLinkages[i].limits[f].maxAmount,
                                                    effectiveDate: data.limitPackageDTOList[k].targetLimitLinkages[i].effectiveDate,
                                                    expiryDate: data.limitPackageDTOList[k].targetLimitLinkages[i].expiryDate,
                                                    isEffectiveFromTomorrow: new Date(data.limitPackageDTOList[k].targetLimitLinkages[i].effectiveDate) > Params.baseModel.getDate()
                                                };

                                                payeeLimitsMap2[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value][data.limitPackageDTOList[k].targetLimitLinkages[i].limits[f].periodicity].maxAmount.amount = ko.observable(payeeLimitsMap2[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value][data.limitPackageDTOList[k].targetLimitLinkages[i].limits[f].periodicity].maxAmount.amount);
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

        self.componentList = [{
                id: "international-demand-draft"
            },
            {
                id: "domestic-demand-draft"
            }
        ];

        for (i = 0; i < self.componentList.length; i++) {
            Params.baseModel.registerComponent(self.componentList[i].id, "payee");
        }

        self.componentList = [{
            id: "issue-demand-draft"
        }];

        for (j = 0; j < self.componentList.length; j++) {
            Params.baseModel.registerComponent(self.componentList[j].id, "payments");
        }

        Params.baseModel.registerElement("confirm-screen");
        Params.baseModel.registerComponent("review-demand-draft-payee", "payee");
        Params.baseModel.registerComponent("otp-verification", "payments");

        self.accessTypes = [{
                id: "PRIVATE",
                label: self.payments.payee.NONSHARED
            },
            {
                id: "PUBLIC",
                label: self.payments.payee.SHARED
            }
        ];

        self.transferObject = ko.observable();

        function refreshPayload() {
            if (self.currentAccountType() === "INTERNATIONAL") {
                self.internationalDDPayeePayload.nickName(null);
                self.internationalDDPayeePayload.payAtCity(null);
                self.internationalDDPayeePayload.payAtCountry(null);
            } else {
                self.domesticDDPayeePayload.nickName(null);
                self.domesticDDPayeePayload.payAtCity(null);
            }

            self.addressDetails.modeofDelivery("");
            self.addressDetails.postalAddress.line1("");
            self.addressDetails.postalAddress.line2("");
            self.addressDetails.postalAddress.line3("");
            self.addressDetails.postalAddress.line4("");
            self.addressDetails.postalAddress.line5("");
            self.addressDetails.postalAddress.line6("");
            self.addressDetails.postalAddress.line7("");
            self.addressDetails.postalAddress.line8("");
            self.addressDetails.postalAddress.line9("");
            self.addressDetails.postalAddress.line10("");
            self.addressDetails.postalAddress.city("");
            self.addressDetails.postalAddress.state("");
            self.addressDetails.postalAddress.zipCode("");
            self.addressDetails.postalAddress.country("");
            self.addressDetails.postalAddress.branch("");
            self.addressDetails.postalAddress.branchName("");
            self.addressDetails.addressType("");
            self.addressDetails.addressTypeDescription("");
        }

        self.accountTypeChanged = function() {
            self.isComponentLoaded(false);
            self.isCollingPeriodSlot(false);

            if (self.currentRelationType() === "DD" && self.currentAccountType() === "INTERNATIONAL") {
                self.selectedComponent("international-demand-draft");
                refreshPayload();
                self.model(self.internationalDDPayeePayload);
                self.createLimitsMessage("PC_F_ID");
                self.type("demandDraft");
            } else if (self.currentRelationType() === "DD" && self.currentAccountType() === "DOMESTIC") {
                self.selectedComponent("domestic-demand-draft");
                refreshPayload();
                self.model(self.domesticDDPayeePayload);
                self.createLimitsMessage("PC_F_DOMDRAFT");
                self.type("demandDraft");
            }

            if (self.payeeData && !self.payeeData.payeeGroupId) {
                self.payeeName("");
            }

            ko.tasks.runEarly();
            self.isComponentLoaded(true);
        };

        function initialRender() {
            if (Params.rootModel.previousState || Params.rootModel.params.fromAdhoc || Params.rootModel.params.isEdit) {
                if (self.currentRelationType() === "DD" && self.currentAccountType() === "INTERNATIONAL") {
                    self.createLimitsMessage("PC_F_ID");
                } else if (self.currentRelationType() === "DD" && self.currentAccountType() === "DOMESTIC") {
                    self.createLimitsMessage("PC_F_DOMDRAFT");
                }

                let draftPayeeDetails = Params.rootModel.previousState ? Params.rootModel.previousState.model : self.adhocPayLoad || Params.rootModel.params.draftPayeeData;

                if (Params.rootModel.params && draftPayeeDetails) {
                    draftPayeeDetails = ko.mapping.fromJS(draftPayeeDetails);

                    if (self.currentAccountType() === "INTERNATIONAL") {
                        ko.utils.extend(self.internationalDDPayeePayload.demandDraftDeliveryDTO, draftPayeeDetails.demandDraftDeliveryDTO);
                        self.internationalDDPayeePayload.demandDraftPayeeType = draftPayeeDetails.demandDraftPayeeType;
                        self.internationalDDPayeePayload.payAtCity = draftPayeeDetails.payAtCity;
                        self.internationalDDPayeePayload.payAtCountry = draftPayeeDetails.payAtCountry;
                        ko.utils.extend(self.internationalDDPayeePayload.address, draftPayeeDetails.otherAddress);
                        self.internationalDDPayeePayload.nickName = draftPayeeDetails.nickName;
                        self.internationalDDPayeePayload.name = draftPayeeDetails.name;
                        self.model(self.internationalDDPayeePayload);

                    } else if (self.currentAccountType() === "DOMESTIC") {
                        ko.utils.extend(self.domesticDDPayeePayload.demandDraftDeliveryDTO, draftPayeeDetails.demandDraftDeliveryDTO);
                        self.domesticDDPayeePayload.demandDraftPayeeType = draftPayeeDetails.demandDraftPayeeType;
                        self.domesticDDPayeePayload.payAtCity = draftPayeeDetails.payAtCity;
                        ko.utils.extend(self.domesticDDPayeePayload.address, draftPayeeDetails.otherAddress);
                        self.domesticDDPayeePayload.nickName = draftPayeeDetails.nickName;
                        self.domesticDDPayeePayload.name = draftPayeeDetails.name;
                        self.model(self.domesticDDPayeePayload);
                    }

                    self.type("demandDraft");
                }

                self.isComponentLoaded(true);
            } else {
                self.accountTypeChanged();
            }
        }

        initialRender();

        self.cancelRecipient = function() {
            self.stageOne(true);
            self.stageTwo(false);
            self.stageThree(false);
            self.currentRelationType("");

            if (self.payeeData === null) {
                self.payeeName("");
            }
        };

        self.cancelConfirmation = function() {
            addPayeeModel.deletePayee(self.payeeGroupId(), self.payeeId(), self.type()).done(function() {
                isPayeeGroupCreated = false;
            });
        };

        self.addRecipient = function() {
            if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }

            if (self.accessType() === "PUBLIC") {
                self.shared(true);
            }

            if (self.accessType() === "PRIVATE") {
                self.shared(false);
            }

            if (self.currentRelationType() === "DD" && self.currentAccountType() === "INTERNATIONAL") {
                self.internationalDDPayeePayload.name = self.payeeName;
                self.internationalDDPayeePayload.nickName = self.model().nickName;
                self.payeeNickName = self.internationalDDPayeePayload.nickName;

                if (Params.dashboard.appData.segment === "CORP") {
                    self.internationalDDPayeePayload.shared(self.shared());
                } else {
                    self.internationalDDPayeePayload.shared();
                }

                self.internationalDDPayeePayload.demandDraftDeliveryDTO.deliveryMode(self.addressDetails.modeofDelivery());

                if (self.internationalDDPayeePayload.demandDraftDeliveryDTO.deliveryMode() === "MAI") {
                    self.internationalDDPayeePayload.demandDraftDeliveryDTO.mailModeType("REM");
                    self.internationalDDPayeePayload.demandDraftDeliveryDTO.addressType(self.addressDetails.addressType());
                } else if (self.internationalDDPayeePayload.demandDraftDeliveryDTO.deliveryMode() === "OTHADD") {
                    self.internationalDDPayeePayload.address.line1(self.addressDetails.postalAddress.line1());
                    self.internationalDDPayeePayload.address.line2(self.addressDetails.postalAddress.line2());
                    self.internationalDDPayeePayload.address.city(self.addressDetails.postalAddress.city());
                    self.internationalDDPayeePayload.address.state(self.addressDetails.postalAddress.state());
                    self.internationalDDPayeePayload.address.zipCode(self.addressDetails.postalAddress.zipCode());
                    self.internationalDDPayeePayload.address.country(self.addressDetails.postalAddress.country());
                } else {
                    self.internationalDDPayeePayload.demandDraftDeliveryDTO.branch(self.addressDetails.postalAddress.branch());
                }

                const internationalDDPayeePayload = ko.toJSON(self.internationalDDPayeePayload);

                if (Params.rootModel.params && Params.rootModel.params.isEdit) {
                    return self.internationalDDPayeePayload;
                }

                addPayeeModel.addPayee(self.payeeGroupId(), self.type(), internationalDDPayeePayload).done(function(data) {
                    self.payeeId(data.demandDraftPayeeDTO.id);
                    self.invokeReadPayee();
                }).fail(function() {
                    self.deletePayeeGroup();
                });
            } else if (self.currentRelationType() === "DD" && self.currentAccountType() === "DOMESTIC") {
                self.domesticDDPayeePayload.name = self.payeeName;
                self.domesticDDPayeePayload.nickName = self.model().nickName;
                self.payeeNickName = self.domesticDDPayeePayload.nickName;

                if (Params.dashboard.appData.segment === "CORP") {
                    self.domesticDDPayeePayload.shared(self.shared());
                } else {
                    self.domesticDDPayeePayload.shared();
                }

                self.domesticDDPayeePayload.demandDraftDeliveryDTO.deliveryMode(self.addressDetails.modeofDelivery());

                if (self.domesticDDPayeePayload.demandDraftDeliveryDTO.deliveryMode() === "MAI") {
                    self.domesticDDPayeePayload.demandDraftDeliveryDTO.deliveryMode("MAI");
                    self.domesticDDPayeePayload.demandDraftDeliveryDTO.mailModeType("REM");
                    self.domesticDDPayeePayload.demandDraftDeliveryDTO.addressType(self.addressDetails.addressType());
                } else if (self.domesticDDPayeePayload.demandDraftDeliveryDTO.deliveryMode() === "OTHADD") {
                    self.domesticDDPayeePayload.address.line1(self.addressDetails.postalAddress.line1());
                    self.domesticDDPayeePayload.address.line2(self.addressDetails.postalAddress.line2());
                    self.domesticDDPayeePayload.address.city(self.addressDetails.postalAddress.city());
                    self.domesticDDPayeePayload.address.state(self.addressDetails.postalAddress.state());
                    self.domesticDDPayeePayload.address.zipCode(self.addressDetails.postalAddress.zipCode());
                } else {
                    self.domesticDDPayeePayload.demandDraftDeliveryDTO.branch(self.addressDetails.postalAddress.branch());
                }

                const domesticDDPayeePayload = ko.toJSON(self.domesticDDPayeePayload);

                if (Params.rootModel.params && Params.rootModel.params.isEdit) {
                    return self.domesticDDPayeePayload;
                }

                addPayeeModel.addPayee(self.payeeGroupId(), self.type(), domesticDDPayeePayload).done(function(data) {
                    self.payeeId(data.demandDraftPayeeDTO.id);
                    self.invokeReadPayee();
                }).fail(function() {
                    self.deletePayeeGroup();
                });
            }
        };

        self.createPayeeGroup = function() {
            if (createPayeeGroupValidations()) {
                return;
            }

            if (self.accessType() === "PUBLIC") {
                self.shared(true);
            }

            if (self.accessType() === "PRIVATE") {
                self.shared(false);
            }

            if (Params.dashboard.appData.segment !== "CORP" && (!self.isNew() || isPayeeGroupCreated)) {
                isPayeeGroupCreated = true;
                activePayload[self.currentAccountType()].contentId(self.contentId());
                self.addRecipient();

                return;
            } else if (Params.dashboard.appData.segment === "CORP") {
                activePayload[self.currentAccountType()].contentId(self.contentId());
            }

            self.payeeGroupPayload.name(self.payeeName());
            self.payeeGroupPayload.contentId(self.contentId());

            const payload = ko.toJSON(self.payeeGroupPayload);

            addPayeeModel.createPayeeGroup(payload).done(function(data) {
                isPayeeGroupCreated = true;
                self.payeeGroupId(data.payeeGroup.groupId);
                self.addRecipient();
            });
        };

        self.deletePayeeGroup = function() {
            if (self.isNew()) {
                addPayeeModel.deletePayeeGroup(self.payeeGroupId()).done(function() {
                    self.stageOne(true);
                    self.stageTwo(false);
                    self.stageTwoPointTwo(false);
                    self.stageThree(false);
                    self.isComponentLoaded(true);
                    isPayeeGroupCreated = false;
                });
            } else {
                self.stageOne(true);
                self.stageTwo(false);
                self.stageTwoPointTwo(false);
                self.stageThree(false);
                self.isComponentLoaded(true);
            }
        };

        self.invokeReadPayee = function() {
            self.stageOne(false);

            const params = {
                reviewMode: true,
                payeeId: self.payeeId,
                header: Params.dashboard.headerName(),
                payeeGroupId: self.payeeGroupId,
                payeeType: "demandDraft",
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
                payeeNickName: self.payeeNickName,
                accessType: self.accessType,
                bankDetailsCode: self.bankDetailsCode,
                bankName: self.bankName,
                bankAddress: self.bankAddress,
                country: self.country,
                city: self.city,
                network: self.network,
                paymentType: self.paymentType,
                limitPackage: self.limitPackage,
                payeeLimitsMap: self.payeeLimitsMap,
                selectedComponent: self.selectedComponent,
                addressDetails: self.addressDetails,
                model: self.model
            };

            Params.dashboard.loadComponent("review-demand-draft-payee", ko.mapping.toJS(params));
        };

        self.tempcurrency = ko.observable("GBP");

        addPayeeModel.fetchBankConfiguration().done(function(data) {
            self.tempcurrency(data.bankConfigurationDTO.localCurrency);
        });

        Params.baseModel.registerComponent("warning-message-dialog", "payee");

        self.cancel = function() {
            Params.dashboard.switchModule(true);
        };

        self.cancelDemandDraft = function() {
            Params.dashboard.hideDetails();
            self.stageOne(true);
        };
    };
});