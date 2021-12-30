define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/payments-payee-list",
    "ojs/ojavatar",
    "ojs/ojvalidationgroup"
], function(oj, ko, $, PayeeViewEditModel, ResourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this,
            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(PayeeViewEditModel.getNewModel());

                return KoModel;
            };

        ko.utils.extend(self, rootParams.rootModel);
        self.payments = ResourceBundle.payments;
        self.editPayeeModel = getNewKoModel().editPayeeModel;
        self.payeeContentId = ko.observable();
        self.payeeImageAvailable = ko.observable(false);
        self.selectedComponent = ko.observable();
        self.type = ko.observable();
        self.payeeLimitModel = getNewKoModel().payeeLimitModel;
        self.removeLimit = ko.observableArray();
        self.limitSetMessage = ko.observable();
        self.setLimitClicked = ko.observable(false);
        self.setMonthlyLimitClicked = ko.observable(false);
        self.groupValid = ko.observable();
        self.newLimitAmount = ko.observable();
        self.newMonthlyLimitAmount = ko.observable();
        self.tommDailyLimitAmount = ko.observable();
        self.tommMonthlyLimitAmount = ko.observable();
        self.effectiveSameDayFlag = ko.observable();
        self.limitCurrency = ko.observable();
        self.imageUploadFlag = ko.observable();
        self.payeeLimitsMap = ko.observable();
        self.showActivitySuccessMsg = ko.observable(false);
        self.addressMap = ko.observable({});
        ko.utils.extend(self, ko.mapping.fromJS(rootParams.rootModel.params));
        self.payeeAccountTypeList = ko.observableArray(rootParams.rootModel.params ? rootParams.rootModel.params.payeeAccountTypeList : []);
        self.limitPackage = ko.observable(rootParams.rootModel.params ? rootParams.rootModel.params.limitPackage : null);
        self.payeeData = ko.observable(rootParams.rootModel.params ? rootParams.rootModel.params.payeeData : null);

        self.limitExist = !!self.newLimitAmount();
        self.monthlyLimitExist = !!self.newMonthlyLimitAmount();

        rootParams.baseModel.registerElement([
            "modal-window",
            "confirm-screen",
            "amount-input",
            "internal-account-input"
        ]);

        rootParams.baseModel.registerComponent("payments-money-transfer", "payments");
        rootParams.baseModel.registerComponent("issue-demand-draft", "payments");

        if (self.payeeData().contentId && self.payeeData().contentId.value) {
            self.payeeImageAvailable(true);
        }

        self.backButtonHandler = rootParams.backButtonHandler;
        rootParams.dashboard.headerName(self.payments.payee.view);
        rootParams.baseModel.registerComponent("bank-account-payee", "payee");
        rootParams.baseModel.registerComponent("demand-draft-payee", "payee");
        rootParams.baseModel.registerComponent("peer-to-peer-payee", "payee");

        self.payeeDataLoaded = ko.observable(true);

        function initialRender() {

            if (self.payeeData().demandDraftDeliveryDTO) {

                const fetchBranchAddressPromise = self.payeeData().demandDraftDeliveryDTO && self.payeeData().demandDraftDeliveryDTO.deliveryMode === "BRN" ? PayeeViewEditModel.fetchBranchAddress(self.payeeData().demandDraftDeliveryDTO.branch) : Promise.resolve();

                Promise.all([PayeeViewEditModel.fetchCourierAddress(), fetchBranchAddressPromise]).then(function(data) {
                    self.payeeDataLoaded(false);

                    self.payeeData().draftAddressDetails = {};

                    const addresses = data[0].party.addresses;

                    for (let i = 0; i < addresses.length; i++) {
                        self.addressMap()[addresses[i].type] = addresses[i].postalAddress;
                    }

                    if (self.payeeData().demandDraftDeliveryDTO.deliveryMode === "BRN") {
                        data[1].addressDTO[0].branchAddress.postalAddress.branchName = data[1].addressDTO[0].branchName;
                        self.payeeData().draftAddressDetails.postalAddress = data[1].addressDTO[0].branchAddress.postalAddress;
                        self.payeeData().draftAddressDetails.postalAddress.addressType = self.payments.payee.addressType.BRN;
                    } else if (self.payeeData().demandDraftDeliveryDTO.deliveryMode === "MAI") {
                        self.payeeData().draftAddressDetails.postalAddress = self.addressMap()[self.payeeData().demandDraftDeliveryDTO.addressType];
                        self.payeeData().draftAddressDetails.postalAddress.addressType = self.payments.payee.addressType.MAI;
                    } else if (self.payeeData().demandDraftDeliveryDTO.deliveryMode === "OTHADD") {
                        self.payeeData().draftAddressDetails.postalAddress = self.payeeData().address ? self.payeeData().address : {};
                        self.payeeData().draftAddressDetails.postalAddress.addressType = self.payments.payee.addressType.OTHADD;
                    }

                    self.payeeData().draftAddressDetails.postalAddress.modeofDelivery = self.payeeData().demandDraftDeliveryDTO.deliveryMode;
                    self.payeeData().draftAddressDetails.modeofDelivery = self.payeeData().demandDraftDeliveryDTO.deliveryMode;
                    ko.tasks.runEarly();
                    self.payeeDataLoaded(true);

                });
            }

            if (self.payeeData().payeeType === "INTERNAL") {
                self.type("internal");
                self.selectedComponent("internal-payee");
            } else if (self.payeeData().payeeType === "INTERNATIONAL") {
                self.type("international");
                self.selectedComponent("international-payee");
            } else if (self.payeeData().payeeType === "DOMESTIC") {
                self.type("domestic");

                if (self.payeeData().domesticPayeeType === "INDIA") {
                    self.selectedComponent("domestic-payee");
                } else if (self.payeeData().domesticPayeeType === "UK") {
                    self.selectedComponent("uk-payee");
                } else {
                    self.selectedComponent("sepa-payee");
                }
            }

            if (self.payeeData().payeeType === "DEMANDDRAFT" && self.payeeData().demandDraftPayeeType === "DOM") {
                self.type("demandDraft");
                self.selectedComponent("domestic-demand-draft");
            } else if (self.payeeData().payeeType === "DEMANDDRAFT" && self.payeeData().demandDraftPayeeType === "INT") {
                self.type("demandDraft");
                self.selectedComponent("international-demand-draft");
            }
        }

        initialRender();

        PayeeViewEditModel.fetchEffectiveTodayDetails().then(function(data) {
            if (data.isEffectiveSameDay === "Y") { self.effectiveSameDayFlag(true); }
        });

        PayeeViewEditModel.assignedLimitPackages().then(function(data) {
            if (data.limitPackageDTOList[0].targetLimitLinkages.length > 0) { self.limitCurrency(data.limitPackageDTOList[0].targetLimitLinkages[0].limits[0].currency); }
        });

        self.removeLimits = function() {
            $("#remove-limits").trigger("openModal");
        };

        self.removeLimitCloseHandler = function() {
            $("#delete-payee").hide();
            self.removeLimit.removeAll();
        };

        self.done = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("removeLimitTracker"))) {
                return;
            }

            if (self.limitPackage() !== null && self.limitPackage().data !== null) {
                const limitData = self.limitPackage().data;

                if (limitData.limitPackageDTOList && limitData.limitPackageDTOList.length > 0) {
                    for (let k = 0; k < limitData.limitPackageDTOList.length; k++) {
                        if (limitData.limitPackageDTOList[k].targetLimitLinkages && limitData.limitPackageDTOList[k].targetLimitLinkages.length > 0) {
                            for (let i = 0; i < limitData.limitPackageDTOList[k].targetLimitLinkages.length; i++) {
                                if (ko.utils.unwrapObservable(limitData.limitPackageDTOList[k].targetLimitLinkages[i].target.type.id) === "PAYEE") {
                                                let removeLimitPayload;

                                                limitData.limitPackageDTOList[k].targetLimitLinkages = [];
                                                limitData.limitPackageDTOList[k].targetLimitLinkages.push(getNewKoModel().payeeLimitModel.targetLimitLinkages()[0]);
                                                removeLimitPayload = ko.mapping.fromJS(limitData.limitPackageDTOList[k]);
                                                removeLimitPayload.targetLimitLinkages()[limitData.limitPackageDTOList[k].targetLimitLinkages.length - 1].target.value(self.payeeData().id);

                                                if (self.effectiveSameDayFlag()) {
                                                    removeLimitPayload.targetLimitLinkages()[limitData.limitPackageDTOList[k].targetLimitLinkages.length - 1].expiryDate = oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate());
                                                } else {
                                                    const date = rootParams.baseModel.getDate();

                                                    date.setDate(date.getDate() + 1);
                                                    removeLimitPayload.targetLimitLinkages()[limitData.limitPackageDTOList[k].targetLimitLinkages.length - 1].expiryDate = oj.IntlConverterUtils.dateToLocalIso(date);
                                                }

                                                removeLimitPayload.targetLimitLinkages()[limitData.limitPackageDTOList[k].targetLimitLinkages.length - 1].effectiveDate = ko.utils.unwrapObservable(limitData.limitPackageDTOList[k].targetLimitLinkages[0].effectiveDate);

                                                const removeDailyLimitModel = getNewKoModel().limitModel,
                                                    removeMonthlyLimitModel = getNewKoModel().limitModel;

                                                if (self.newLimitAmount() > 0) {
                                                    removeDailyLimitModel.maxAmount.currency(self.limitCurrency());
                                                    removeDailyLimitModel.maxAmount.amount(self.newLimitAmount());
                                                    removeDailyLimitModel.periodicity("DAILY");
                                                    removeLimitPayload.targetLimitLinkages()[limitData.limitPackageDTOList[k].targetLimitLinkages.length - 1].limits.push(removeDailyLimitModel);
                                                }

                                                if (self.newMonthlyLimitAmount() > 0) {
                                                    removeMonthlyLimitModel.maxAmount.currency(self.limitCurrency());
                                                    removeMonthlyLimitModel.maxAmount.amount(self.newMonthlyLimitAmount());
                                                    removeMonthlyLimitModel.periodicity("MONTHLY");
                                                    removeLimitPayload.targetLimitLinkages()[limitData.limitPackageDTOList[k].targetLimitLinkages.length - 1].limits.push(removeMonthlyLimitModel);
                                                }

                                                if (self.removeLimit().length === 1) {
                                                    if (self.removeLimit()[0] === self.payments.payee.labels.dailylimit && self.newMonthlyLimitAmount() > 0) {
                                                        removeLimitPayload.targetLimitLinkages.push(getNewKoModel().payeeLimitModel.targetLimitLinkages()[0]);
                                                        removeLimitPayload.targetLimitLinkages()[removeLimitPayload.targetLimitLinkages().length - 1].target.value(self.payeeData().id);

                                                        const newMonthlyLimitModel = getNewKoModel().limitModel;

                                                        newMonthlyLimitModel.maxAmount.currency(self.limitCurrency());
                                                        newMonthlyLimitModel.maxAmount.amount(self.newMonthlyLimitAmount());
                                                        newMonthlyLimitModel.periodicity("MONTHLY");
                                                        removeLimitPayload.targetLimitLinkages()[removeLimitPayload.targetLimitLinkages().length - 1].limits.push(newMonthlyLimitModel);
                                                    } else if (self.removeLimit()[0] === self.payments.payee.labels.monthlylimit && self.newLimitAmount() > 0) {
                                                        removeLimitPayload.targetLimitLinkages.push(getNewKoModel().payeeLimitModel.targetLimitLinkages()[0]);
                                                        removeLimitPayload.targetLimitLinkages()[removeLimitPayload.targetLimitLinkages().length - 1].target.value(self.payeeData().id);

                                                        const newDailyLimitModel = getNewKoModel().limitModel;

                                                        newDailyLimitModel.maxAmount.currency(self.limitCurrency());
                                                        newDailyLimitModel.maxAmount.amount(self.newLimitAmount());
                                                        newDailyLimitModel.periodicity("DAILY");
                                                        removeLimitPayload.targetLimitLinkages()[removeLimitPayload.targetLimitLinkages().length - 1].limits.push(newDailyLimitModel);
                                                    } else {
                                                        removeLimitPayload.targetLimitLinkages.push(getNewKoModel().payeeLimitModel.targetLimitLinkages()[0]);
                                                        removeLimitPayload.targetLimitLinkages()[removeLimitPayload.targetLimitLinkages().length - 1].target.value(self.payeeData().id);
                                                    }
                                                }

                                                if (self.removeLimit().length === 2) {
                                                    removeLimitPayload.targetLimitLinkages.push(getNewKoModel().payeeLimitModel.targetLimitLinkages()[0]);
                                                    removeLimitPayload.targetLimitLinkages()[removeLimitPayload.targetLimitLinkages().length - 1].target.value(self.payeeData().id);
                                                }

                                                removeLimitPayload = ko.toJSON(ko.mapping.toJS(removeLimitPayload));

                                                PayeeViewEditModel.putPayeeLimit(removeLimitPayload).then(function(data, status) {

                                                    self.limitSetMessage(self.effectiveSameDayFlag() ? self.payments.payee.message.limitRemove : self.payments.payee.message.limitRemoveTom);
                                                    self.showActivitySuccessMsg(true);

                                                    if (self.removeLimit().length === 1) {
                                                        if (self.removeLimit()[0] === self.payments.payee.labels.monthlylimit) { self.newMonthlyLimitAmount(""); }

                                                        if (self.removeLimit()[0] === self.payments.payee.labels.dailylimit) { self.newLimitAmount(""); }
                                                    } else if (self.removeLimit().length === 2) {
                                                        self.newMonthlyLimitAmount("");
                                                        self.newLimitAmount("");
                                                    }

                                                    self.removeLimit.removeAll();

                                                    if (rootParams.dashboard.appData.segment === "RETAIL") {
                                                        self.showActivitySuccessMsg(false);

                                                        rootParams.dashboard.loadComponent("confirm-screen", {
                                                            transactionResponse: data,
                                                            confirmScreenExtensions: {
                                                                template: "confirm-screen/payments-template",
                                                                successMessage: self.limitSetMessage(),
                                                                statusMessages: self.payments.common.success,
                                                                isSet: true
                                                            }
                                                        });
                                                    }
                                                });
                                }
                            }
                        }
                    }
                }
            }
        };

        self.setLimit = function() {
            self.cancelMonthlyLimit();
            self.setLimitClicked(true);
        };

        self.setMonthlyLimit = function() {
            self.cancelDailyLimit();
            self.setMonthlyLimitClicked(true);
        };

        self.cancelDailyLimit = function() {
            self.newLimitAmount(self.payeeData().limitDetails.DAILY.maxAmount.amount);
            self.setLimitClicked(false);
        };

        self.cancelMonthlyLimit = function() {
            self.newMonthlyLimitAmount(self.payeeData().limitDetails.MONTHLY.maxAmount.amount);
            self.setMonthlyLimitClicked(false);
        };

        self.confirmEditPayeeDetails = function(data, periodicity) {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) { return; }

            let payload;

            if (rootParams.dashboard.appData.segment !== "CORP") {
                if (self.limitExist || self.monthlyLimitExist) {
                    self.limitPackage().data.limitPackageDTOList[0].targetLimitLinkages = [];
                    self.limitPackage().data.limitPackageDTOList[0].targetLimitLinkages.push(getNewKoModel().payeeLimitModel.targetLimitLinkages()[0]);
                    payload = ko.mapping.fromJS(self.limitPackage().data.limitPackageDTOList[0]);
                    payload.targetLimitLinkages()[self.limitPackage().data.limitPackageDTOList[0].targetLimitLinkages.length - 1].target.value(data.id);

                    const dailyLimitModel = getNewKoModel().limitModel,
                        monthlyLimitModel = getNewKoModel().limitModel;

                    if (self.setLimitClicked() && self.newLimitAmount() > 0 && periodicity === "DAILY") {
                        dailyLimitModel.maxAmount.currency(self.limitCurrency());
                        dailyLimitModel.maxAmount.amount(self.newLimitAmount());
                        dailyLimitModel.periodicity("DAILY");
                        payload.targetLimitLinkages()[self.limitPackage().data.limitPackageDTOList[0].targetLimitLinkages.length - 1].limits.push(dailyLimitModel);

                        if (self.payeeData().limitDetails && self.payeeData().limitDetails.MONTHLY.maxAmount.amount && (self.newMonthlyLimitAmount() > 0 || self.tommMonthlyLimitAmount() > 0)) {
                            monthlyLimitModel.maxAmount.currency(self.limitCurrency());

                            if (self.effectiveSameDayFlag()) { monthlyLimitModel.maxAmount.amount(self.newMonthlyLimitAmount()); } else { monthlyLimitModel.maxAmount.amount(self.tommMonthlyLimitAmount() ? self.tommMonthlyLimitAmount() : self.newMonthlyLimitAmount()); }

                            monthlyLimitModel.periodicity("MONTHLY");
                            payload.targetLimitLinkages()[self.limitPackage().data.limitPackageDTOList[0].targetLimitLinkages.length - 1].limits.push(monthlyLimitModel);
                        }
                    }

                    if (self.setMonthlyLimitClicked() && self.newMonthlyLimitAmount() > 0 && periodicity === "MONTHLY") {
                        monthlyLimitModel.maxAmount.currency(self.limitCurrency());
                        monthlyLimitModel.maxAmount.amount(self.newMonthlyLimitAmount());
                        monthlyLimitModel.periodicity("MONTHLY");
                        payload.targetLimitLinkages()[self.limitPackage().data.limitPackageDTOList[0].targetLimitLinkages.length - 1].limits.push(monthlyLimitModel);

                        if (self.payeeData().limitDetails && self.payeeData().limitDetails.DAILY.maxAmount.amount && (self.newLimitAmount() > 0 || self.tommDailyLimitAmount() > 0)) {
                            dailyLimitModel.maxAmount.currency(self.limitCurrency());

                            if (self.effectiveSameDayFlag()) { dailyLimitModel.maxAmount.amount(self.newLimitAmount()); } else { dailyLimitModel.maxAmount.amount(self.tommDailyLimitAmount() ? self.tommDailyLimitAmount() : self.newLimitAmount()); }

                            dailyLimitModel.periodicity("DAILY");
                            payload.targetLimitLinkages()[self.limitPackage().data.limitPackageDTOList[0].targetLimitLinkages.length - 1].limits.push(dailyLimitModel);
                        }
                    }

                    payload = ko.toJSON(ko.mapping.toJS(payload));

                    PayeeViewEditModel.putPayeeLimit(payload).then(function() {

                        if (periodicity === "DAILY" && self.newLimitAmount() > 0) {
                            self.payeeData().limitDetails.DAILY.maxAmount.amount = self.newLimitAmount();
                            self.payeeData().limitDetails.DAILY.maxAmount.currency = self.limitCurrency();

                            if (self.effectiveSameDayFlag()) {
                                self.payeeData().limitDetails.DAILY.isEffectiveFromTomorrow = false;
                            }

                            self.setLimitClicked(false);
                        }

                        if (periodicity === "MONTHLY" && self.newMonthlyLimitAmount() > 0) {
                            self.payeeData().limitDetails.MONTHLY.maxAmount.amount = self.newMonthlyLimitAmount();
                            self.payeeData().limitDetails.MONTHLY.maxAmount.currency = self.limitCurrency();

                            if (self.effectiveSameDayFlag()) {
                                self.payeeData().limitDetails.MONTHLY.isEffectiveFromTomorrow = false;
                            }

                            self.setMonthlyLimitClicked(false);
                        }

                        self.limitSetMessage(self.effectiveSameDayFlag() ? self.payments.payee.message.limitset : self.payments.payee.message.limitSetTom);
                        self.showActivitySuccessMsg(true);

                        setTimeout(function() {
                            self.showActivitySuccessMsg(false);
                        }, 4000);
                    }).reject(function() {
                        self.limitPackage().data.limitPackageDTOList[0].targetLimitLinkages.pop();
                    });
                } else {
                    self.payeeLimitModel.targetLimitLinkages()[0].target.value(data.id);

                    if (self.setLimitClicked() && self.newLimitAmount() > 0 && periodicity === "DAILY") {
                        const postDailyLimitModel = getNewKoModel().limitModel;

                        postDailyLimitModel.maxAmount.currency(self.limitCurrency());
                        postDailyLimitModel.maxAmount.amount(self.newLimitAmount());
                        postDailyLimitModel.periodicity("DAILY");
                        self.payeeLimitModel.targetLimitLinkages()[0].limits.push(postDailyLimitModel);
                    }

                    if (self.setMonthlyLimitClicked() && self.newMonthlyLimitAmount() > 0 && periodicity === "MONTHLY") {
                        const postMonthlyLimitModel = getNewKoModel().limitModel;

                        postMonthlyLimitModel.maxAmount.currency(self.limitCurrency());
                        postMonthlyLimitModel.maxAmount.amount(self.newMonthlyLimitAmount());
                        postMonthlyLimitModel.periodicity("MONTHLY");
                        self.payeeLimitModel.targetLimitLinkages()[0].limits.push(postMonthlyLimitModel);
                    }

                    self.payeeLimitModel.currency(self.limitCurrency());
                    payload = ko.toJSON(self.payeeLimitModel);

                    PayeeViewEditModel.postPayeeLimit(payload).then(function() {

                        if (periodicity === "DAILY" && self.newLimitAmount() > 0) {
                            self.payeeData().limitDetails.DAILY.maxAmount.amount = self.newLimitAmount();
                            self.payeeData().limitDetails.DAILY.maxAmount.currency = self.limitCurrency();

                            if (self.effectiveSameDayFlag()) {
                                self.payeeData().limitDetails.DAILY.isEffectiveFromTomorrow = false;
                            }

                            self.setLimitClicked(false);
                            self.limitExist = true;
                        }

                        if (periodicity === "MONTHLY" && self.newMonthlyLimitAmount() > 0) {
                            self.payeeData().limitDetails.MONTHLY.maxAmount.amount = self.newMonthlyLimitAmount();
                            self.payeeData().limitDetails.MONTHLY.maxAmount.currency = self.limitCurrency();

                            if (self.effectiveSameDayFlag()) {
                                self.payeeData().limitDetails.MONTHLY.isEffectiveFromTomorrow = false;
                            }

                            self.setMonthlyLimitClicked(false);
                            self.monthlyLimitExist = true;
                        }

                        self.limitSetMessage(self.effectiveSameDayFlag() ? self.payments.payee.message.limitset : self.payments.payee.message.limitSetTom);
                        self.showActivitySuccessMsg(true);

                        setTimeout(function() {
                            self.showActivitySuccessMsg(false);
                        }, 4000);
                    });
                }
            }
        };
    };
});