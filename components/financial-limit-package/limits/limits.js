define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/limit-package-mapping",
    "ojs/ojinputtext",
    "ojs/ojnavigationlist",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker",
    "ojs/ojselectcombobox"
], function (oj, ko, $, resourceBundle) {
    "use strict";

    return function (rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);

        const tempIndex = rootParams.index();

        self.nls = resourceBundle;
        self.selectedTransactionForPackage = ko.observable();
        self.selectedTransactionGroupForPackage = ko.observable();
        self.editable = rootParams.editable;
        self.minDate = ko.observable();
        self.templateFlag = ko.observable(self.templateLoadingFlag());
        self.transactionGroupListData = ko.observableArray(self.transactionGroupList());

        const position = rootParams.index();

        self.targetId = ko.observable();

        if (self.params.data) {
            if (ko.isObservable(self.params.data.targetLimitLinkages()[position].target.type.id)) {
                self.targetId(self.params.data.targetLimitLinkages()[position].target.type.id());
            } else {
                self.targetId(self.params.data.targetLimitLinkages()[position].target.type.id);
            }

        }

        self.supportedTransactionFlag = ko.observable(false);
        self.supportedTransactionData = ko.observableArray();

        const packageMode = rootParams.mode;

        self.dateDisable = ko.observable(true);

        self.disableDate = function () {
            return self.params.action === "EDIT" ? (self.selectedTransactionForPackage() === undefined) || (new Date(self.dateValueForTransaction()) < rootParams.baseModel.getDate()) : (self.selectedTransactionForPackage() === undefined) && (new Date(self.dateValueForTransaction()) < rootParams.baseModel.getDate());
        };

        self.disableDateTranGroup = function () {
            return self.params.action === "EDIT" ? (self.selectedTransactionGroupForPackage() === undefined) || (new Date(self.dateValueForTransaction()) < rootParams.baseModel.getDate()) : (self.selectedTransactionGroupForPackage() === undefined) && (new Date(self.dateValueForTransaction()) < rootParams.baseModel.getDate());
        };

        self.flag = ko.observable(true);
        self.flagTransactionGroup = ko.observable(false);
        rootParams.baseModel.registerComponent("transaction-group-read", "transaction-group");

        const today = rootParams.baseModel.getDate(),
            tomorrow = rootParams.baseModel.getDate();

        tomorrow.setDate(rootParams.baseModel.getDate().getDate() + 1);

        let indexTransaction = -1;

        if (self.params.action === "editAfterSave" || self.params.action === "EDIT" || self.params.action === "cloneAfterEdit") {
            indexTransaction = rootParams.index();
        }

        self.done = function () {
            $("#supportedTransactionModalId").trigger("closeModal");
            self.flagTransactionGroup(false);
            ko.tasks.runEarly();
        };

        self.closeDialog = function () {
            self.flagTransactionGroup(false);
            ko.tasks.runEarly();
            $("#supportedTransactionModalId").hide();
        };

        self.supportedTransaction = function () {
            self.flagTransactionGroup(true);
            ko.tasks.runEarly();
            $("#supportedTransactionModalId").trigger("openModal");
        };

        self.showLimitsForTransaction = function (index) {
            self.dateDisable(false);
            self.createPackageData().targetLimitLinkages()[index].target.value(self.selectedTransactionForPackage());

            if (self.selectedTransactionForPackage()) {
                let my_label;
                const getTransactionName = function (data) {
                    data.forEach(function (v) {
                        if (v.value === self.selectedTransactionForPackage()) {
                            my_label = v.label;
                        } else if (v.children) {
                            getTransactionName(v.children);
                        }
                    });
                };

                getTransactionName(self.taskCodeList());
                self.createPackageData().targetLimitLinkages()[index].target.name(my_label);

                if (indexTransaction < 0 || self.params.action === "editAfterSave" || self.params.action === "EDIT" || self.params.action === "cloneAfterEdit") {
                    if (!ko.isObservable(self.duplicateLinkage)) {
                        self.duplicateLinkage = ko.observableArray(self.duplicateLinkage);
                    }

                    self.duplicateLinkage().push({
                        transName: self.selectedTransactionForPackage(),
                        transDate: self.dateValueForTransaction(),
                        transExpiry: self.expiryDateValueForTransaction()
                    });

                    indexTransaction = self.duplicateLinkage().length - 1;
                } else if (self.duplicateLinkage()[indexTransaction].transDate && packageMode() === "CREATE") {
                    const searchDate = self.duplicateLinkage().filter(function (item) {
                        return item.transName === self.selectedTransactionForPackage() && item.transDate === self.dateValueForTransaction();
                    });

                    if (searchDate.length > 0) {
                        self.selectedTransactionForPackage.removeAll();
                        $("#deleteDateDialog").trigger("openModal");
                    } else {
                        self.duplicateLinkage()[indexTransaction] = {
                            transName: self.selectedTransactionForPackage(),
                            transDate: self.dateValueForTransaction(),
                            transExpiry: self.expiryDateValueForTransaction()
                        };
                    }
                } else {
                    self.duplicateLinkage()[indexTransaction] = {
                        transName: self.selectedTransactionForPackage(),
                        transDate: self.dateValueForTransaction(),
                        transExpiry: self.expiryDateValueForTransaction()
                    };
                }
            }
        };

        self.showLimitsForTransactionGroup = function (index) {
            self.dateDisable(false);
            self.createPackageData().targetLimitLinkages()[index].target.value(self.selectedTransactionGroupForPackage());

            if (self.selectedTransactionGroupForPackage()) {
                let my_label;
                const getTransactionGroupName = function (data) {
                    data.forEach(function (v) {
                        if (v.value === self.selectedTransactionGroupForPackage()) {
                            my_label = v.label;
                        }
                    });
                };

                getTransactionGroupName(self.transactionGroupList());
                self.createPackageData().targetLimitLinkages()[index].target.name(my_label);

                if (indexTransaction < 0 || self.params.action === "editAfterSave" || self.params.action === "EDIT" || self.params.action === "cloneAfterEdit") {
                    self.duplicateLinkage.push({
                        transName: self.selectedTransactionGroupForPackage(),
                        transDate: self.dateValueForTransaction(),
                        transExpiry: self.expiryDateValueForTransaction()
                    });

                    indexTransaction = self.duplicateLinkage().length - 1;
                } else if (self.duplicateLinkage()[indexTransaction].transDate && (packageMode() === "CREATE")) {
                    const searchDate = self.duplicateLinkage().filter(function (item) {
                        return item.transName === self.selectedTransactionGroupForPackage() && item.transDate === self.dateValueForTransaction();
                    });

                    if (searchDate.length > 0) {
                        self.selectedTransactionGroupForPackage.removeAll();
                        $("#deleteDateDialog").trigger("openModal");
                    } else {
                        self.duplicateLinkage()[indexTransaction] = {
                            transName: self.selectedTransactionGroupForPackage(),
                            transDate: self.dateValueForTransaction(),
                            transExpiry: self.expiryDateValueForTransaction()
                        };
                    }
                } else {
                    self.duplicateLinkage()[indexTransaction] = {
                        transName: self.selectedTransactionGroupForPackage(),
                        transDate: self.dateValueForTransaction(),
                        transExpiry: self.expiryDateValueForTransaction()
                    };
                }
            }
        };

        self.minExpDate = ko.observable();

        self.closeDateDialog = function () {
            $("#deleteDateDialog").hide();
        };

        const d = rootParams.baseModel.getDate();

        self.existingTransaction = ko.observable(false);
        self.dateValueForTransaction = ko.observable();
        self.expiryDateValueForTransaction = ko.observable();

        self.dateValueForTransaction.subscribe(function (newValue) {
            let searchDate;

            if (self.dateValueForTransaction() !== null) {
                self.duplicateLinkage()[indexTransaction].transDate = newValue.substring(0, 10);
                self.createPackageData().targetLimitLinkages()[indexTransaction].effectiveDate(self.dateValueForTransaction());

                searchDate = self.duplicateLinkage().filter(function (item) {
                    return item.transName === self.duplicateLinkage()[indexTransaction].transName && item.transDate === newValue;
                });

                if (searchDate.length > 1 && (packageMode() === "CREATE")) {
                    self.dateValueForTransaction(null);
                    self.duplicateLinkage()[indexTransaction].transDate = null;
                    $("#deleteDateDialog").trigger("openModal");
                }

                const tempDate = new Date(newValue.substring(0, 10));

                if (self.effectiveSameDayFlag() === "Y") {
                    if (today.setHours(0, 0, 0, 0) < new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate()).setHours(0, 0, 0, 0)) {
                        self.minExpDate(oj.IntlConverterUtils.dateToLocalIso(new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate() + 1)));
                    } else if (today.setHours(0, 0, 0, 0) === new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate()).setHours(0, 0, 0, 0)) {
                        self.minExpDate(oj.IntlConverterUtils.dateToLocalIso(today));
                    } else {
                        self.minExpDate(oj.IntlConverterUtils.dateToLocalIso(today));
                    }
                } else if (self.effectiveSameDayFlag() === "N") {
                    self.minExpDate(oj.IntlConverterUtils.dateToLocalIso(tomorrow >= new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate() + 1) ? tomorrow : new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate() + 1)));
                }
            }
        });

        self.expiryDateValueForTransaction.subscribe(function (newValue) {
            if (self.expiryDateValueForTransaction() !== null && newValue !== null) {
                self.duplicateLinkage()[indexTransaction].transExpiry = newValue.substring(0, 10);
                self.createPackageData().targetLimitLinkages()[indexTransaction].expiryDate(self.expiryDateValueForTransaction());
            } else {
                self.duplicateLinkage()[indexTransaction].transExpiry = null;
                self.expiryDateValueForTransaction(null);
                self.createPackageData().targetLimitLinkages()[tempIndex].expiryDate(null);
            }
        });

        if (self.effectiveSameDayFlag() === "Y" || self.params.effectiveSameDayFlag === "Y") {
            self.minDate(oj.IntlConverterUtils.dateToLocalIso(new Date(d.getFullYear(), d.getMonth(), d.getDate())));
        } else {
            self.minDate(oj.IntlConverterUtils.dateToLocalIso(new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)));
        }

        rootParams.baseModel.registerElement("action-widget");
        rootParams.baseModel.registerComponent("cumulative-limit", "financial-limit-package");
        rootParams.baseModel.registerComponent("transaction-limit", "financial-limit-package");
        rootParams.baseModel.registerComponent("cooling-period-limit", "financial-limit-package");
        rootParams.baseModel.registerElement("account-input");
        rootParams.baseModel.registerElement("modal-window");
        rootParams.baseModel.registerComponent("package-create", "financial-limit-package");
        self.selectedTransactionForLimit = ko.observable();
        self.additionalDetails = ko.observable();
        self.accountNumber = ko.observable();

        if (!ko.isObservable(self.createPackageData().targetLimitLinkages()[tempIndex].effectiveDate)) {
            self.createPackageData().targetLimitLinkages()[tempIndex].effectiveDate = ko.observable(self.createPackageData().targetLimitLinkages()[tempIndex].effectiveDate);
        }

        if (!ko.isObservable(self.createPackageData().targetLimitLinkages()[tempIndex].expiryDate)) {
            self.createPackageData().targetLimitLinkages()[tempIndex].expiryDate = ko.observable(self.createPackageData().targetLimitLinkages()[tempIndex].expiryDate);
        }

        if (!ko.isObservable(self.createPackageData().targetLimitLinkages()[tempIndex].target.type.id)) {
            self.createPackageData().targetLimitLinkages()[tempIndex].target.type.id = ko.observable(self.createPackageData().targetLimitLinkages()[tempIndex].target.type.id);
        }

        if (!ko.isObservable(self.createPackageData().targetLimitLinkages()[tempIndex].target.value)) {
            self.createPackageData().targetLimitLinkages()[tempIndex].target.value = ko.observable(self.createPackageData().targetLimitLinkages()[tempIndex].target.value);
        }

        for (let k = 0; k < self.createPackageData().targetLimitLinkages()[tempIndex].limits().length; k++) {
            if (!ko.isObservable(self.createPackageData().targetLimitLinkages()[tempIndex].limits()[k].limitType)) {
                self.createPackageData().targetLimitLinkages()[tempIndex].limits()[k].limitType = ko.observable(self.createPackageData().targetLimitLinkages()[tempIndex].limits()[k].limitType);
            }
        }

        if (self.createPackageData().targetLimitLinkages()[tempIndex].effectiveDate()) {
            indexTransaction = tempIndex;
            self.dateValueForTransaction(self.createPackageData().targetLimitLinkages()[tempIndex].effectiveDate());

            if (self.createPackageData().targetLimitLinkages()[tempIndex].expiryDate()) {
                self.expiryDateValueForTransaction(self.createPackageData().targetLimitLinkages()[tempIndex].expiryDate());
            }

            if (self.createPackageData().targetLimitLinkages()[tempIndex].target.type.id() === "TASK") {
                self.selectedTransactionForPackage(self.createPackageData().targetLimitLinkages()[tempIndex].target.value());
                self.templateFlag("transaction");
            } else if (self.createPackageData().targetLimitLinkages()[tempIndex].target.type.id() === "TASK_GROUP") {
                self.selectedTransactionGroupForPackage(self.createPackageData().targetLimitLinkages()[tempIndex].target.value());
                self.templateFlag("transactionGroup");
            }
        }

        if (self.params.action !== "CREATE" && self.params.action !== "CLONE" && self.params.originalPackageExpiry[tempIndex] && new Date(self.params.originalPackageExpiry[tempIndex]).setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0)) {
            self.existingTransaction(true);
        }
    };
});