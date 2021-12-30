define([

    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/review-limit-package",
    "ojs/ojinputtext",
    "ojs/ojnavigationlist"
], function (ko, $, componentModel, resourceBundle) {
    "use strict";

    return function (rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.changeParameter = ko.observable("Y");

        if (self.params.mode === "approval") {
            self.changeParameter("Y");
        }

        self.nls = resourceBundle;
        rootParams.dashboard.headerName(self.nls.pageHeader);
        self.showPackageDetails = ko.observable(false);
        self.showConfirmScreen = ko.observable(false);
        self.showDeleteConfirmation = ko.observable(false);
        self.accessPointDescription = ko.observable();
        self.createPackageData = ko.observable();
        self.flag = self.params.flag ? ko.observable(self.params.flag) : ko.observable(false);
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerElement("modal-window");
        rootParams.baseModel.registerElement("action-header");
        self.reviewTransactionName = [];
        self.reviewTransactionName.header = self.nls.review_limit_package.review;
        self.reviewTransactionName.reviewHeader = self.nls.review_limit_package.confirmScreenheader;
        self.limitPackageData = null;
        self.returnAfterUpdate = ko.observable(false);
        self.originalPackageExpiry = ko.observableArray();

        if (self.params.originalPackageExpiry) {
            self.originalPackageExpiry(self.params.originalPackageExpiry);
        }

        self.isCorpAdmin = ko.observable();

        const partyId = {};

        partyId.value = rootParams.dashboard.userData.userProfile.partyId.value;
        partyId.displayValue = rootParams.dashboard.userData.userProfile.partyId.displayValue;

        if (partyId.value) {
            self.isCorpAdmin = true;
        } else {
            self.isCorpAdmin = false;
        }

        function getTransactionName(temp) {
            if (!ko.isObservable(self.limitPackageData.targetLimitLinkages[temp].target.value)) {
                self.limitPackageData.targetLimitLinkages[temp].target.value = ko.observable(self.limitPackageData.targetLimitLinkages[temp].target.value);
            }

            if (self.limitPackageData.targetLimitLinkages[temp] && self.limitPackageData.targetLimitLinkages[temp].target.type.id === "TASK" && !self.limitPackageData.targetLimitLinkages[temp].target.name && self.limitPackageData.targetLimitLinkages[temp].target.value) {
                componentModel.getTransactionName(self.limitPackageData.targetLimitLinkages[temp].target.value()).done(function (data) {
                    if (data.task) {
                        self.limitPackageData.targetLimitLinkages[temp].target.name = ko.observable(data.task.name);
                    }

                    temp++;

                    if (temp < self.limitPackageData.targetLimitLinkages.length) {
                        getTransactionName(temp);
                    } else {
                        self.showPackageDetails(true);
                    }
                });
            } else if (self.limitPackageData.targetLimitLinkages[temp] && self.limitPackageData.targetLimitLinkages[temp].target.type.id === "TASK_GROUP" && !self.limitPackageData.targetLimitLinkages[temp].target.name && self.limitPackageData.targetLimitLinkages[temp].target.value) {
                componentModel.getTransactionGroupName(self.limitPackageData.targetLimitLinkages[temp].target.value()).done(function (data) {
                    if (data.taskGroupDTO) {
                        self.limitPackageData.targetLimitLinkages[temp].target.name = ko.observable(data.taskGroupDTO.name);
                    }

                    temp++;

                    if (temp < self.limitPackageData.targetLimitLinkages.length) {
                        getTransactionName(temp);
                    } else {
                        self.showPackageDetails(true);
                    }
                });
            } else {
                temp++;

                if (temp < self.limitPackageData.targetLimitLinkages.length) {
                    getTransactionName(temp);
                } else {
                    self.showPackageDetails(true);
                }
            }
        }

        function getAccessPoint() {
            if (!ko.isObservable(self.limitPackageData.accessPointGroupType)) {
                self.limitPackageData.accessPointGroupType = ko.observable(self.limitPackageData.accessPointGroupType);
            }

            if (self.limitPackageData.accessPointGroupType() === "SINGLE") {
                componentModel.fetchAccessPoint().done(function (data) {
                    for (let i = 0; i < data.accessPointListDTO.length; i++) {
                        if (self.limitPackageData.accessPointValue === data.accessPointListDTO[i].id) {
                            self.accessPointDescription(data.accessPointListDTO[i].description);
                            break;
                        }
                    }
                });
            } else if (self.limitPackageData.accessPointGroupType() === "GROUP") {
                componentModel.fetchAccessPointGroup().done(function (data) {
                    for (let i = 0; i < data.accessPointGroupListDTO.length; i++) {
                        if (self.limitPackageData.accessPointValue === data.accessPointGroupListDTO[i].accessPointGroupId) {
                            self.accessPointDescription(data.accessPointGroupListDTO[i].description);
                            break;
                        }
                    }
                });
            } else {
                self.accessPointDescription(self.nls.review_limit_package.global);
            }
        }

        self.roleListArrayValue = ko.observableArray();
        self.roleListArray = ko.observable();

        if (self.params.action === "VIEW") {
            componentModel.fetchPackageDetails(self.params.packageId).done(function (data) {
                self.limitPackageData = data.limitPackageDTO;

                if (!ko.isObservable(self.limitPackageData.assignableToList)) {
                    self.limitPackageData.assignableToList = ko.observableArray(self.limitPackageData.assignableToList);
                }

                for (let i = 0; i < self.limitPackageData.assignableToList().length; i++) {
                    self.roleListArrayValue()[i] = self.limitPackageData.assignableToList()[i].key.value;
                }

                self.roleListArray(self.roleListArrayValue().join());
                getTransactionName(0);
                getAccessPoint();
            });
        } else if (self.params.action === "CREATE" || self.params.action === "EDIT" || self.params.action === "editAfterSave" || self.params.mode === "approval" || self.params.action === "CLONE" || self.params.action === "cloneAfterEdit") {
            self.limitPackageData = self.params.data;
            self.limitPackageData.targetLimitLinkages = ko.toJS(self.limitPackageData.targetLimitLinkages);

            if (!ko.isObservable(self.limitPackageData.accessPointGroupType)) {
                self.limitPackageData.accessPointGroupType = ko.observable(self.limitPackageData.accessPointGroupType);
            }

            if (!ko.isObservable(self.limitPackageData.assignableToList)) {
                self.limitPackageData.assignableToList = ko.observableArray(self.limitPackageData.assignableToList);
            }

            for (let i = 0; i < self.limitPackageData.assignableToList().length; i++) {
                self.roleListArrayValue()[i] = self.limitPackageData.assignableToList()[i].key.value;
            }

            self.roleListArray(self.roleListArrayValue().join());
            getTransactionName(0);
            getAccessPoint();
        }

        self.confirmDelete = function () {
            $("#deleteDialog").trigger("openModal");
        };

        self.closeDeleteDialog = function () {
            $("#deleteDialog").hide();
        };

        self.cancel = function () {
            $("#cancelDialogBox").trigger("openModal");
        };

        self.closeDialogBox = function () {
            $("#cancelDialogBox").hide();
        };

        self.deleteLimitPackage = function () {
            componentModel.deletePackage(self.params.packageId).done(function (data, status, jqXhr) {
                $("#deleteDialog").hide();

                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.nls.review_limit_package.deletePackage
                });
            }).fail(function () {
                $("#deleteDialog").hide();
            });
        };

        self.editLimitPackage = function () {
            const action = self.params.action === "CREATE" ? "CREATE" : "EDIT";

            rootParams.dashboard.loadComponent("limit-package", {
                action: action,
                data: self.limitPackageData,
                limitsData: self.params.limitsData,
                duplicateLinkage: self.params.duplicateLinkage,
                returnAfterUpdate: self.returnAfterUpdate(),
                originalPackageExpiry: self.originalPackageExpiry()
            });
        };

        self.cloneLimitPackage = function () {
            self.action = "cloneAfterEdit";

            const action = self.action;

            rootParams.dashboard.loadComponent("limit-package", {
                action: action,
                data: self.limitPackageData,
                limitsData: self.limitsData,
                duplicateLinkage: self.params.duplicateLinkage,
                returnAfterUpdate: self.returnAfterUpdate(),
                originalPackageExpiry: self.originalPackageExpiry()
            });
        };

        self.limitTypeArray = ko.observableArray();

        let getCoolingLimitObj = {};

        getCoolingLimitObj = {
            limitId: ko.observable(null),
            limitName: ko.observable(null),
            limitDescription: ko.observable(null),
            limitType: ko.observable("DUR"),
            durationLimitSlots: ko.observable(null),
            currency: ko.observable(null)
        };

        let getTransLimitObj = {};

        getTransLimitObj = {
            limitId: ko.observable(null),
            limitName: ko.observable(null),
            limitDescription: ko.observable(null),
            limitType: ko.observable("TXN"),
            amountRange: ko.observable(null),
            currency: ko.observable(null)
        };

        let getPeriodicDailyLimitObj = {};

        getPeriodicDailyLimitObj = {
            limitId: ko.observable(null),
            limitName: ko.observable(null),
            limitDescription: ko.observable(null),
            limitType: ko.observable("PER"),
            maxAmount: ko.observable(null),
            maxCount: ko.observable(null),
            periodicity: ko.observable("DAILY"),
            currency: ko.observable(null)
        };

        let getPeriodicMonthlyLimitObj = {};

        getPeriodicMonthlyLimitObj = {
            limitId: ko.observable(null),
            limitName: ko.observable(null),
            limitDescription: ko.observable(null),
            limitType: ko.observable("PER"),
            maxAmount: ko.observable(null),
            maxCount: ko.observable(null),
            periodicity: ko.observable("MONTHLY"),
            currency: ko.observable(null)
        };

        self.periodicityTypeArray = ko.observableArray();

        self.clone = function () {
            self.limitPackageData.targetLimitLinkages.forEach(function (v) {
                v.limits.forEach(function (lv) {
                    self.limitTypeArray.push(lv.limitType);

                    if (lv.limitType === "PER") {
                        self.periodicityTypeArray.push(lv.periodicity);
                    }
                });

                let searchDurLimit = 0,
                    searchTxnLimit = 0,
                    searchPerDailyLimit = 0,
                    searchPerMonthlyLimit = 0;

                for (let i = 0; i < self.limitTypeArray().length; i++) {
                    if (self.limitTypeArray()[i] === "DUR") {
                        searchDurLimit++;
                    }

                    if (self.limitTypeArray()[i] === "TXN") {
                        searchTxnLimit++;
                    }

                    if (self.limitTypeArray()[i] === "PER") {
                        $(self.periodicityTypeArray()).each(function (a) {
                            if (self.periodicityTypeArray()[a] === "DAILY") {
                                searchPerDailyLimit++;
                            }

                            if (self.periodicityTypeArray()[a] === "MONTHLY") {
                                searchPerMonthlyLimit++;
                            }
                        });
                    }
                }

                if (searchTxnLimit === 0) {
                    v.limits.push(getTransLimitObj);
                }

                if (searchDurLimit === 0) {
                    v.limits.push(getCoolingLimitObj);
                }

                if (searchPerDailyLimit === 0) {
                    v.limits.push(getPeriodicDailyLimitObj);
                }

                if (searchPerMonthlyLimit === 0) {
                    v.limits.push(getPeriodicMonthlyLimitObj);
                }
            });

            self.cloneLimitPackage();
        };

        rootParams.baseModel.registerComponent("limit-package-search", "financial-limit-package");

        self.showSearchScreen = function () {
            self.accessPointDescription("");
            rootParams.dashboard.loadComponent("limit-package-search", {});
        };

        self.backToEdit = function () {
            self.returnAfterUpdate(true);

            if (self.params.action === "VIEW" || self.params.action === "EDIT") {
                self.editLimitPackage();
            } else {
                self.limitPackageData.targetLimitLinkages.forEach(function (v) {
                    if (v.expiry) {
                        delete v.expiry;
                    }
                });

                $(".financialLimitPackage").trigger("openModal");
                $(".financialLimitPackage").show();

                const action = self.params.action === "EDIT" ? "EDIT" : "editAfterSave";

                rootParams.dashboard.loadComponent("limit-package", {
                    effectiveSameDayFlag: self.effectiveSameDayFlag,
                    action: action,
                    data: ko.toJS(self.limitPackageData),
                    duplicateLinkage: self.params.duplicateLinkage,
                    returnAfterUpdate: self.returnAfterUpdate(),
                    originalPackageExpiry: self.originalPackageExpiry()
                });
            }
        };

        self.editableCopy = null;

        self.confirmPackage = function () {
            if (!self.limitPackageData.targetLimitLinkages.length) {
                return;
            }

            self.limitPackageData.targetLimitLinkages.forEach(function (v) {

                for (let i = 0; i < v.limits.length; i++) {
                    if (v.limits[i].limitId === null) {
                        v.limits.splice(i, 1);
                    }
                }
            });

            if (self.params.action === "CREATE" || self.params.action === "editAfterSave" || self.params.action === "cloneAfterEdit") {
                self.limitPackageData.targetLimitLinkages.forEach(function (v) {
                    if (v.editable) {
                        self.editableCopy = v.editable;
                        delete v.editable;
                    }
                });

                componentModel.createNewPackage(JSON.stringify(ko.mapping.toJS(self.limitPackageData))).done(function (data, status, jqXhr) {

                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        transactionName: self.nls.review_limit_package.createNewPackage
                    });
                }).fail(function () {
                    self.limitPackageData.targetLimitLinkages.forEach(function (v) {
                        v.editable = self.editableCopy;
                    });
                });
            } else if (self.params.action === "EDIT") {
                let temp = 0;
                const d = rootParams.baseModel.getDate();

                d.setDate(d.getDate() + 1);

                for (temp = 0; temp < self.limitPackageData.targetLimitLinkages.length; temp++) {
                    const v = self.limitPackageData.targetLimitLinkages[temp];

                    if(!ko.isObservable(v.expiryDate)){
                        v.expiryDate = ko.observable(v.expiryDate);
                    }

                    if (v.expiryDate) {
                        if (!v.expiryDate()) {
                            delete v.expiryDate;
                        }
                    }

                    if (v.expiryDate && new Date(v.expiryDate()) < rootParams.baseModel.getDate()) {
                        self.limitPackageData.targetLimitLinkages.splice(temp, 1);
                        temp--;
                    }

                    if (!v.editable && v.expiry) {
                        v.expiryDate = v.expiryDate || ko.observable();
                        v.expiryDate(d);
                    }

                    delete v.editable;

                    if (v.expiry) {
                        delete v.expiry;
                    }
                }

                self.limitPackageData.targetLimitLinkages.forEach(function (v) {
                    if (!ko.isObservable(v.limits)) {
                        v.limits = ko.observableArray(v.limits);
                    }

                    $(v.limits()).each(function (lk, lv) {
                        if (!ko.isObservable(lv.limitId)) {
                            lv.limitId = ko.observable(lv.limitId);
                        }

                        if (!lv.limitId()) {
                            v.limits().splice(lk, 1);
                        }
                    });
                });

                const tempData = JSON.parse(ko.mapping.toJSON(self.limitPackageData));

                componentModel.updatePackage(JSON.stringify(tempData)).done(function (data, status, jqXhr) {
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        transactionName: self.nls.review_limit_package.editPackage
                    });
                });
            }
        };

        self.closeSPopup = function () {
            $("#disclaimer-container").fadeOut("slow");
        };
    };
});