define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/limit-package",
    "ojs/ojinputtext",
    "ojs/ojknockout-validation",
    "ojs/ojnavigationlist",
    "ojs/ojvalidationgroup"
], function (oj, ko, $, componentModel, resourceBundle) {
    "use strict";

    return function (rootParams) {
        const self = this;

        self.selectedAccessPoint = ko.observable();
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("modal-window");
        rootParams.baseModel.registerElement("action-widget");
        self.selectedCurrency = ko.observable();

        if (self.params && self.params.data && self.params.data.currency) {
            self.currency = self.params.data.currency;
        }

        self.limitPackageCloneId = ko.observable();
        self.limitPackageCloneDesc = ko.observable();
        self.transactionId = ko.observable("TASK");
        self.transactionGroupId = ko.observable("TASK_GROUP");
        self.nls = resourceBundle;
        self.showEnterpriseRole = ko.observable(false);
        rootParams.baseModel.registerComponent("limits", "financial-limit-package");
        rootParams.baseModel.registerComponent("package-create", "financial-limit-package");
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerComponent("review-limit-package", "financial-limit-package");
        self.templateLoadingFlag = ko.observable("transaction");
        self.showAccessPoint = ko.observable(false);
        self.showAccessPointGroup = ko.observable(false);
        self.accessPointDescription = ko.observable();
        self.taskCodeList = ko.observableArray();
        self.taskCodeListFetch = ko.observable(false);
        self.groupValid = ko.observable();
        self.transactionGroupList = ko.observableArray();
        self.transactionGroupListFetch = ko.observable(false);
        self.showResult = ko.observable(false);
        self.limitPackageInput = ko.observable(true);
        self.validationTracker = ko.observable();
        self.showConfirm = ko.observable(true);
        self.isNewLimitGroup = ko.observable(true);
        self.showCoolingLimitSearchSection = ko.observable(false);
        self.showTransactionLimitsSearch = ko.observable(false);
        self.showCummulativeSearchSection = ko.observable(false);
        self.gapDetected = ko.observable(false);
        self.abruptEndDetected = ko.observable(false);
        self.userOkWithAbruptEndDetected = ko.observable(false);
        self.userOkWithGapDetected = ko.observable(false);
        self.httpStatus = ko.observable();
        self.transactionStatus = ko.observable();
        self.packageMode = ko.observable("CREATE");
        self.effectiveSameDayFlag = ko.observable();
        self.changeParameter = ko.observable();

        self.groupData = ko.observableArray([{
                label: "INTERNAL",
                children: []
            },
            {
                label: "EXTERNAL",
                children: []
            }
        ]);

        self.accessPointType = ko.observable("SINGLE");

        let today = rootParams.baseModel.getDate();

        self.limitsData = ko.observable({
            LimitTransactions: ko.observable(),
            enterpriseRoles: ko.observable(),
            accessPoint: ko.observable(),
            accessPointGroup: ko.observable(),
            accessPointType: ko.observable(),
            coolingLimits: ko.observable(),
            transactionLimits: ko.observable(),
            cummulativeLimitsDaily: ko.observableArray(),
            cummulativeLimitsMonthly: ko.observableArray(),
            currencies: ko.observable()
        });

        self.back = function () {
            self.showCoolingLimitSearchSection(false);
            self.showTransactionLimitsSearch(false);
            self.showCummulativeSearchSection(false);
            rootParams.dashboard.loadComponent("limit-package-search", {});
        };

        self.cancel = function () {
            $("#cancelDialog").trigger("openModal");
        };

        self.closeDialogBox = function () {
            $("#cancelDialog").hide();
        };

        const getPackageModel = function () {
            const KoModel = componentModel.getPackageModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.taxonomy = rootParams.dashboard.getTaxonomyDefinition("com.ofss.digx.app.finlimit.dto.limitpackage.LimitPackageDTO");

        componentModel.fetchEffectiveTodayDetails().done(function (data) {
            self.effectiveSameDayFlag(data.isEffectiveSameDay);
        });

        componentModel.fetchSystemConfigurationDetails().then(function (data) {
            self.changeParameter(data.configResponseList[0].propertyValue);

            if (self.changeParameter() === "N") {
                self.accessPointType("GLOBAL");
            }
        });

        if (!self.params.returnAfterUpdate && self.params.action !== "CREATE") {
            for (let i = 0; i < self.params.data.targetLimitLinkages.length; i++) {
                if (self.params.data.targetLimitLinkages[i].expiryDate) {
                    self.params.originalPackageExpiry.push(self.params.data.targetLimitLinkages[i].expiryDate);
                } else {
                    self.params.originalPackageExpiry.push(ko.observable());
                }
            }
        }

        if (self.params.action === "editAfterSave" || self.params.action === "EDIT" || self.params.action === "cloneAfterEdit") {
            if (self.params.action === "editAfterSave") {
                rootParams.visibility = true;

                if (!ko.isObservable(self.currency)) {
                    self.currency = ko.observable(self.currency);
                }

                self.selectedCurrency(self.currency());

                componentModel.fetchCoolingLimits(self.selectedCurrency()).done(function (data) {
                    self.limitsData().coolingLimits(data.limitDTOs);
                    self.showCoolingLimitSearchSection(true);
                });

                componentModel.fetchTransactionLimits(self.selectedCurrency()).done(function (data) {
                    self.limitsData().transactionLimits(data.limitDTOs);
                    self.showTransactionLimitsSearch(true);
                });

                componentModel.fetchCummulativeLimits(self.selectedCurrency()).done(function (data) {
                    self.limitsData().cummulativeLimitsMonthly.removeAll();
                    self.limitsData().cummulativeLimitsDaily.removeAll();

                    if (data.limitDTOs) {
                        ko.utils.arrayForEach(data.limitDTOs, function (limit) {
                            if (limit.periodicity === "MONTHLY") {
                                self.limitsData().cummulativeLimitsMonthly.push(limit);
                            } else {
                                self.limitsData().cummulativeLimitsDaily.push(limit);
                            }
                        });
                    }

                    self.showCummulativeSearchSection(true);
                });

                componentModel.fetchEffectiveTodayDetails().done(function (data) {
                    self.effectiveSameDayFlag(data.isEffectiveSameDay);
                });
            }

            if (!ko.isObservable(self.currency)) {
                self.currency = ko.observable(self.currency);
            }

            self.selectedCurrency(self.currency());
            self.createPackageData = ko.observable(self.params.data);

            if (ko.isObservable(self.params.data.targetLimitLinkages)) {
                self.createPackageData().targetLimitLinkages = self.params.data.targetLimitLinkages;
            } else {
                self.createPackageData().targetLimitLinkages = ko.observableArray(self.params.data.targetLimitLinkages);
            }

            if (ko.isObservable(self.params.data.assignableToList)) {
                self.createPackageData().assignableToList = self.params.data.assignableToList;
            } else {
                self.createPackageData().assignableToList = ko.observableArray(self.params.data.assignableToList);
            }

            for (let k = 0; k < self.createPackageData().targetLimitLinkages().length; k++) {
                if (!ko.isObservable(self.params.data.targetLimitLinkages()[k].limits)) {
                    self.createPackageData().targetLimitLinkages()[k].limits = ko.observableArray(self.params.data.targetLimitLinkages()[k].limits);
                }
            }

            self.accessPointType(self.createPackageData().accessPointGroupType);
            self.selectedAccessPoint(self.createPackageData().accessPointValue);
            self.duplicateLinkage = ko.observable(self.params.duplicateLinkage);
        } else {
            self.duplicateLinkage = ko.observableArray();
            self.createPackageData = ko.observable(getPackageModel());
        }

        self.closeDateDialog = function () {
            $("#deleteDateDialog").hide();
        };

        self.closeDateDialogTransactionGroup = function () {
            $("#deleteDateDialogTransactionGroup").hide();
        };

        self.closegapDetected = function () {
            $("#gapDetected").hide();
        };

        self.closeabruptEndDetected = function () {
            $("#abruptEndDetected").hide();
        };

        self.callReviewScreen = function () {
            $(".financialLimitPackage").hide();

            const action = self.params.action ? self.params.action : "CREATE";

            rootParams.dashboard.loadComponent("review-limit-package", {
                action: action,
                flag: true,
                data: self.createPackageData(),
                duplicateLinkage: self.duplicateLinkage,
                originalPackageExpiry: self.params.originalPackageExpiry
            });
        };

        self.userOkWithAbruptEnd = function () {
            self.userOkWithAbruptEndDetected(true);
            $("#abruptEndDetected").hide();
            self.abruptEndDetected(false);

            if (!self.abruptEndDetected() && !self.gapDetected()) {
                self.callReviewScreen();
            } else if (self.abruptEndDetected() && self.userOkWithAbruptEndDetected() && !self.gapDetected()) {
                self.callReviewScreen();
            } else if (self.gapDetected() && self.userOkWithGapDetected() && !self.abruptEndDetected()) {
                self.callReviewScreen();
            } else if (self.gapDetected() && self.userOkWithGapDetected() && self.abruptEndDetected() && self.userOkWithAbruptEndDetected()) {
                self.callReviewScreen();
            }
        };

        self.userOkWithGap = function () {
            self.userOkWithGapDetected(true);
            self.gapDetected(false);
            $("#gapDetected").hide();

            if (!self.abruptEndDetected() && !self.gapDetected()) {
                self.callReviewScreen();
            } else if (self.abruptEndDetected() && self.userOkWithAbruptEndDetected() && !self.gapDetected()) {
                self.callReviewScreen();
            } else if (self.gapDetected() && self.userOkWithGapDetected() && !self.abruptEndDetected()) {
                self.callReviewScreen();
            } else if (self.gapDetected() && self.userOkWithGapDetected() && self.abruptEndDetected() && self.userOkWithAbruptEndDetected()) {
                self.callReviewScreen();
            }
        };

        function fetchChildLimitTasks(task) {
            const taskCodeList = [];

            for (let i = 0; i < task.childTasks.length; i++) {
                const currentTask = task.childTasks[i],
                    taskObject = {};

                taskObject.label = currentTask.name;

                if (currentTask.aspects.length > 0) {
                    for (let j = 0; j < currentTask.aspects.length; j++) {
                        if (currentTask.aspects[j].taskAspect === "limit" && currentTask.aspects[j].enabled) {
                            taskObject.value = currentTask.id;
                        }
                    }
                }

                if (currentTask.childTasks) {
                    taskObject.value = "";
                    taskObject.children = fetchChildLimitTasks(currentTask);
                }

                taskCodeList.push(taskObject);
            }

            return taskCodeList;
        }

        function fetchTransGroups(task) {
            const transactionGroupList = [];

            for (let i = 0; i < task.length; i++) {
                const currentTask = task[i],
                    taskObject = {};

                taskObject.label = currentTask.name;

                if (currentTask.taskAspect === "limit") {
                    taskObject.value = currentTask.id;
                }

                transactionGroupList.push(taskObject);
            }

            return transactionGroupList;
        }

        let dataTaskList = null;

        componentModel.fetchLimitTransactions().done(function (data) {
            dataTaskList = data.taskList;

            for (let k = 0; k < dataTaskList.length; k++) {
                const fetchedTasks = fetchChildLimitTasks(dataTaskList[k]);

                for (let j = 0; j < fetchedTasks.length; j++) {
                    self.taskCodeList().push(fetchedTasks[j]);
                }

                self.taskCodeList().sort(function (left, right) {
                    return left.name === right.name ? 0 : left.name < right.name ? -1 : 1;
                });

                self.taskCodeListFetch(true);
            }
        });

        componentModel.fetchTransactionGroup().done(function (data) {
            const fetchedTransGrp = fetchTransGroups(data.taskGroupDTOlist);

            for (let j = 0; j < fetchedTransGrp.length; j++) {
                self.transactionGroupList().push(fetchedTransGrp[j]);
            }

            self.transactionGroupList().sort(function (left, right) {
                return left.name === right.name ? 0 : left.name < right.name ? -1 : 1;
            });

            self.transactionGroupListFetch(true);
        });

        componentModel.fetchEnterpriseRoles().done(function (data) {
            self.showEnterpriseRole(false);
            self.limitsData().enterpriseRoles(data.enterpriseRoleDTOs);
            self.showEnterpriseRole(true);
        });

        componentModel.fetchAccessPoint().done(function (data) {
            self.limitsData().accessPoint(data.accessPointListDTO);

            for (let i = 0; i < data.accessPointListDTO.length; i++) {
                if (data.accessPointListDTO[i].type === "INT") {
                    self.groupData()[0].children.push({
                        value: data.accessPointListDTO[i].id,
                        label: data.accessPointListDTO[i].description
                    });
                } else if (data.accessPointListDTO[i].type === "EXT") {
                    self.groupData()[1].children.push({
                        value: data.accessPointListDTO[i].id,
                        label: data.accessPointListDTO[i].description
                    });
                }
            }

            self.showAccessPoint(true);
        });

        componentModel.fetchAccessPointGroup().done(function (data) {
            self.limitsData().accessPointGroup(data.accessPointGroupListDTO);
            self.showAccessPointGroup(true);
        });

        self.showCurrencies = ko.observable(false);

        componentModel.fetchCurrencies().done(function (data) {
            self.limitsData().currencies(data.currencyList);
            self.showCurrencies(true);
        });

        const getTargetLinkageModel = function () {
            const KoModel = componentModel.getTargetLinkageModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.addTask = function () {
            self.templateLoadingFlag("transaction");

            let size = self.createPackageData().targetLimitLinkages().length - 1;

            if (self.createPackageData().targetLimitLinkages().length > 0 && self.createPackageData().targetLimitLinkages()[size].target.value() === null && self.createPackageData().targetLimitLinkages()[size].target.name() === null) {
                self.createPackageData().targetLimitLinkages.splice(size, 1);
                size--;
            }

            self.createPackageData().targetLimitLinkages.push(getTargetLinkageModel());
            size++;
            self.createPackageData().targetLimitLinkages()[size].target.type.id("TASK");
            self.createPackageData().targetLimitLinkages()[size].target.type.name("TASK");
        };

        self.addTransactionGroup = function () {
            self.templateLoadingFlag("transactionGroup");

            let size = self.createPackageData().targetLimitLinkages().length - 1;

            if (self.createPackageData().targetLimitLinkages().length > 0 && self.createPackageData().targetLimitLinkages()[size].target.value() === null && self.createPackageData().targetLimitLinkages()[size].target.name() === null) {
                self.createPackageData().targetLimitLinkages.splice(size, 1);
                size--;
            }

            self.createPackageData().targetLimitLinkages.push(getTargetLinkageModel());
            size++;
            self.createPackageData().targetLimitLinkages()[size].target.type.id("TASK_GROUP");
            self.createPackageData().targetLimitLinkages()[size].target.type.name("TASK_GROUP");
        };

        self.removeTransactionFromPackage = function (index, data) {
            if (!ko.isObservable(data.editable)) {
                data.editable = ko.observable(data.editable);
            }

            if (!data.editable()) {
                self.createPackageData().targetLimitLinkages()[index].expiry = "today";

                const t = $(".financialLimitPackage .transactionLimitBox");

                $(t[index]).addClass("deleteLinakge");
            } else if (self.createPackageData().targetLimitLinkages().length > 1) {
                self.createPackageData().targetLimitLinkages.splice(index, 1);

                if (self.duplicateLinkage !== null) {
                    self.duplicateLinkage.splice(index, 1);
                }
            }
        };

        self.undoTransactionFromPackage = function (index) {
            const t = $(".financialLimitPackage .transactionLimitBox");

            $(t[index]).removeClass("deleteLinakge");
            delete self.createPackageData().targetLimitLinkages()[index].expiry;
        };

        self.httpStatus = ko.observable();

        self.createNewPackage = function () {
            const tracker = document.getElementById("tracker");

            if (tracker && tracker.valid !== "valid") {
                tracker.showMessages();
                tracker.focusOn("@firstInvalidShown");

                return;
            }

            if (self.params.action === "cloneAfterEdit") {
                self.createPackageData().key.id(self.limitPackageCloneId());
                self.createPackageData().description(self.limitPackageCloneDesc());
            }

            for (let i = 0; i < self.createPackageData().targetLimitLinkages().length; i++) {
                let flag = false;

                for (let j = 0; j < self.createPackageData().targetLimitLinkages()[i].limits().length; j++) {
                    if (!ko.isObservable(self.createPackageData().targetLimitLinkages()[i].limits()[j].limitId)) {
                        self.createPackageData().targetLimitLinkages()[i].limits()[j].limitId = ko.observable(self.createPackageData().targetLimitLinkages()[i].limits()[j].limitId);
                    }

                    if (self.createPackageData().targetLimitLinkages()[i].limits()[j].limitType() === "PER" && self.createPackageData().targetLimitLinkages()[i].limits()[j].limitId() !== null) {
                        flag = true;
                    }
                }

                if (flag === false) {
                    rootParams.baseModel.showMessages(null, [self.nls.limit_package.cumulative_msg], "ERROR");

                    return;
                }
            }

            self.callReviewScreen();
        };

        self.periodicLimitCheck = function () {
            let i;

            for (i = 0; i < self.createPackageData().targetLimitLinkages().length; i++) {
                let flag = false;

                for (let j = 0; j < self.createPackageData().targetLimitLinkages()[i].limits().length; j++) {
                    if (!ko.isObservable(self.createPackageData().targetLimitLinkages()[i].limits()[j].limitId)) {
                        self.createPackageData().targetLimitLinkages()[i].limits()[j].limitId = ko.observable(self.createPackageData().targetLimitLinkages()[i].limits()[j].limitId);
                    }

                    if (self.createPackageData().targetLimitLinkages()[i].limits()[j].limitType() === "PER" && self.createPackageData().targetLimitLinkages()[i].limits()[j].limitId() !== null) {
                        flag = true;
                    }
                }

                if (flag === false) {
                    rootParams.baseModel.showMessages(null, [self.nls.limit_package.cumulative_msg], "ERROR");

                    return false;
                }
            }

            return true;
        };

        self.functionCall = function () {
            for (let i = 0; i < self.duplicateLinkage().length; i++) {
                let limitAvialable = false,
                    tempExpiryDate;

                for (let j = 0; j < self.duplicateLinkage().length; j++) {
                    if (self.duplicateLinkage()[i].transName === self.duplicateLinkage()[j].transName && j !== i) {
                        if (self.duplicateLinkage()[i].transExpiry) {
                            tempExpiryDate = new Date(self.duplicateLinkage()[i].transExpiry.substring(0, 4) + "-" + self.duplicateLinkage()[i].transExpiry.substring(4, 6) + "-" + self.duplicateLinkage()[i].transExpiry.substring(6)).setHours(0, 0, 0);
                        }

                        const tempEffectiveDate = new Date(self.duplicateLinkage()[j].transDate.substring(0, 4) + "-" + self.duplicateLinkage()[j].transDate.substring(4, 6) + "-" + self.duplicateLinkage()[j].transDate.substring(6)).setHours(0, 0, 0),
                            curTxnEffectiveDate = new Date(self.duplicateLinkage()[i].transDate.substring(0, 4) + "-" + self.duplicateLinkage()[i].transDate.substring(4, 6) + "-" + self.duplicateLinkage()[i].transDate.substring(6)).setHours(0, 0, 0);

                        if (curTxnEffectiveDate >= today.setHours(0, 0, 0)) {
                            limitAvialable = true;
                        } else
                        if (self.duplicateLinkage()[i].transExpiry && tempEffectiveDate >= tempExpiryDate) {
                            limitAvialable = true;
                            break;
                        }
                    }
                }

                if (!limitAvialable && self.duplicateLinkage()[i].transExpiry) {
                    $("#abruptEndDetected").trigger("openModal");
                    self.abruptEndDetected(true);
                }
            }
        };

        self.cloneMode = function () {
            self.packageMode("cloneAfterEdit");

            if (!ko.isObservable(self.currency)) {
                self.currency = ko.observable(self.currency);
            }

            self.selectedCurrency(self.currency());
            self.cummulativeLimitSelected = true;
            self.coolingLimitSelected = true;
            self.transactionLimitSelected = true;

            let isDuplicateLinkageEmpty = false;

            if (self.duplicateLinkage === undefined) {
                self.duplicateLinkage = ko.observableArray();
                isDuplicateLinkageEmpty = true;
            }

            $(self.createPackageData().targetLimitLinkages()).each(function (k) {
                if (self.createPackageData().targetLimitLinkages()[k].editable === undefined || self.createPackageData().targetLimitLinkages()[k].editable === null) {
                    self.createPackageData().targetLimitLinkages()[k].editable = ko.observable();
                }

                if (!ko.isObservable(self.createPackageData().targetLimitLinkages()[k].effectiveDate)) {
                    self.createPackageData().targetLimitLinkages()[k].effectiveDate = ko.observable(self.createPackageData().targetLimitLinkages()[k].effectiveDate);
                }

                if (self.createPackageData().targetLimitLinkages()[k].effectiveDate() !== null && new Date(self.createPackageData().targetLimitLinkages()[k].effectiveDate()) <= rootParams.baseModel.getDate()) {
                    self.createPackageData().targetLimitLinkages()[k].effectiveDate(rootParams.baseModel.getDate());
                }

                self.createPackageData().targetLimitLinkages()[k].effectiveDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.createPackageData().targetLimitLinkages()[k].effectiveDate())));

                if (!self.createPackageData().targetLimitLinkages()[k].expiryDate) {
                    self.createPackageData().targetLimitLinkages()[k].expiryDate = ko.observable();
                }else if (!ko.isObservable(self.createPackageData().targetLimitLinkages()[k].expiryDate)) {
                    self.createPackageData().targetLimitLinkages()[k].expiryDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(self.createPackageData().targetLimitLinkages()[k].expiryDate)));
                }else if (self.createPackageData().targetLimitLinkages()[k].expiryDate()) {
                    self.createPackageData().targetLimitLinkages()[k].expiryDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.createPackageData().targetLimitLinkages()[k].expiryDate())));
                }

                if (isDuplicateLinkageEmpty) {
                    self.duplicateLinkage.push({
                        transName: self.createPackageData().targetLimitLinkages()[k].target.value(),
                        transDate: self.createPackageData().targetLimitLinkages()[k].effectiveDate().substring(0, 10),
                        transExpiry: self.createPackageData().targetLimitLinkages()[k].expiryDate() ? self.createPackageData().targetLimitLinkages()[k].expiryDate().substring(0, 10) : null
                    });
                }
            });

            if (!ko.isObservable(self.createPackageData().currency)) {
                self.createPackageData().currency = ko.observable(self.createPackageData().currency);
            }

            if (!ko.isObservable(self.createPackageData().key.id)) {
                self.createPackageData().key.id = ko.observable(self.createPackageData().key.id);
            }

            if (!ko.isObservable(self.createPackageData().description)) {
                self.createPackageData().description = ko.observable(self.createPackageData().description);
            }

            if (!ko.isObservable(self.createPackageData().accessPointValue)) {
                self.createPackageData().accessPointValue = ko.observable(self.createPackageData().accessPointValue);
            }

            self.createPackageData().currency(self.selectedCurrency());
            self.createPackageData().key.id(self.limitPackageCloneId());
            self.createPackageData().description(self.limitPackageCloneDesc());
            self.createPackageData().accessPointValue(self.selectedAccessPoint());
            ko.tasks.runEarly();

            componentModel.fetchCoolingLimits(self.selectedCurrency()).done(function (data) {
                self.limitsData().coolingLimits(data.limitDTOs);
                self.showCoolingLimitSearchSection(true);
            });

            componentModel.fetchTransactionLimits(self.selectedCurrency()).done(function (data) {
                self.limitsData().transactionLimits(data.limitDTOs);
                self.showTransactionLimitsSearch(true);
            });

            componentModel.fetchCummulativeLimits(self.selectedCurrency()).done(function (data) {
                if (data.limitDTOs) {
                    self.limitsData().cummulativeLimitsMonthly.removeAll();
                    self.limitsData().cummulativeLimitsDaily.removeAll();

                    ko.utils.arrayForEach(data.limitDTOs, function (limit) {
                        if (limit.periodicity === "MONTHLY") {
                            self.limitsData().cummulativeLimitsMonthly.push(limit);
                        } else {
                            self.limitsData().cummulativeLimitsDaily.push(limit);
                        }
                    });
                }

                self.showCummulativeSearchSection(true);
            });
        };

        if (self.params.action === "cloneAfterEdit") {
            self.cloneMode();
        }

        self.editMode = function () {
            self.packageMode("EDIT");
            self.isNewLimitGroup(false);

            if (!ko.isObservable(self.currency)) {
                self.currency = ko.observable(self.currency);
            }

            self.selectedCurrency(self.currency());
            self.cummulativeLimitSelected = true;
            self.coolingLimitSelected = true;
            self.transactionLimitSelected = true;

            let isDuplicateLinkageEmpty = false;

            if (!ko.isObservable(self.duplicateLinkage)) {
                self.duplicateLinkage = ko.observable(self.duplicateLinkage);
            }

            if (self.duplicateLinkage() === undefined) {
                self.duplicateLinkage = ko.observableArray();
                isDuplicateLinkageEmpty = true;
            }

            $(self.createPackageData().targetLimitLinkages()).each(function (k) {
                if (self.createPackageData().targetLimitLinkages()[k].editable === undefined || self.createPackageData().targetLimitLinkages()[k].editable === null) {
                    self.createPackageData().targetLimitLinkages()[k].editable = ko.observable();
                }

                if (!ko.isObservable(self.createPackageData().targetLimitLinkages()[k].effectiveDate)) {
                    self.createPackageData().targetLimitLinkages()[k].effectiveDate = ko.observable(self.createPackageData().targetLimitLinkages()[k].effectiveDate);
                }

                if (!ko.isObservable(self.createPackageData().targetLimitLinkages()[k].target.value)) {
                    self.createPackageData().targetLimitLinkages()[k].target.value = ko.observable(self.createPackageData().targetLimitLinkages()[k].target.value);
                }

                if (!ko.isObservable(self.createPackageData().targetLimitLinkages()[k].editable)) {
                    self.createPackageData().targetLimitLinkages()[k].editable = ko.observable(self.createPackageData().targetLimitLinkages()[k].editable);
                }

                if (self.createPackageData().targetLimitLinkages()[k].effectiveDate() !== null && new Date(self.createPackageData().targetLimitLinkages()[k].effectiveDate()) <= rootParams.baseModel.getDate()) {
                    self.createPackageData().targetLimitLinkages()[k].editable(false);
                }

                self.createPackageData().targetLimitLinkages()[k].effectiveDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.createPackageData().targetLimitLinkages()[k].effectiveDate())));

                if (!self.createPackageData().targetLimitLinkages()[k].expiryDate) {
                    self.createPackageData().targetLimitLinkages()[k].expiryDate = ko.observable();
                } else if (!ko.isObservable(self.createPackageData().targetLimitLinkages()[k].expiryDate)) {
                    self.createPackageData().targetLimitLinkages()[k].expiryDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(self.createPackageData().targetLimitLinkages()[k].expiryDate)));
                } else if (self.createPackageData().targetLimitLinkages()[k].expiryDate()) {
                    self.createPackageData().targetLimitLinkages()[k].expiryDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.createPackageData().targetLimitLinkages()[k].expiryDate())));
                }

                if (isDuplicateLinkageEmpty) {
                    self.duplicateLinkage.push({
                        transName: self.createPackageData().targetLimitLinkages()[k].target.value(),
                        transDate: self.createPackageData().targetLimitLinkages()[k].effectiveDate().substring(0, 10),
                        transExpiry: self.createPackageData().targetLimitLinkages()[k].expiryDate() ? self.createPackageData().targetLimitLinkages()[k].expiryDate().substring(0, 10) : null
                    });
                }
            });

            if (!ko.isObservable(self.createPackageData().currency)) {
                self.createPackageData().currency = ko.observable(self.createPackageData().currency);
            }

            self.createPackageData().currency(self.selectedCurrency());
            ko.tasks.runEarly();

            componentModel.fetchCoolingLimits(self.selectedCurrency()).done(function (data) {
                self.limitsData().coolingLimits(data.limitDTOs);
                self.showCoolingLimitSearchSection(true);
            });

            componentModel.fetchTransactionLimits(self.selectedCurrency()).done(function (data) {
                self.limitsData().transactionLimits(data.limitDTOs);
                self.showTransactionLimitsSearch(true);
            });

            componentModel.fetchCummulativeLimits(self.selectedCurrency()).done(function (data) {
                if (data.limitDTOs) {
                    self.limitsData().cummulativeLimitsMonthly.removeAll();
                    self.limitsData().cummulativeLimitsDaily.removeAll();

                    ko.utils.arrayForEach(data.limitDTOs, function (limit) {
                        if (limit.periodicity === "MONTHLY") {
                            self.limitsData().cummulativeLimitsMonthly.push(limit);
                        } else {
                            self.limitsData().cummulativeLimitsDaily.push(limit);
                        }
                    });
                }

                self.showCummulativeSearchSection(true);
            });
        };

        self.abruptEndOrGapCheck = function () {
            for (let i = 0; i < self.duplicateLinkage().length - 1; i++) {
                if (self.duplicateLinkage()[i].transName !== self.duplicateLinkage()[i + 1].transName) {
                    if (!self.userOkWithAbruptEndDetected() && self.duplicateLinkage()[i + 1].transExpiry) {
                        $("#abruptEndDetected").trigger("openModal");
                        self.abruptEndDetected(true);
                        break;
                    }
                } else if (!self.userOkWithGapDetected() && self.duplicateLinkage()[i].transDate - self.duplicateLinkage()[i + 1].transExpiry !== 0) {
                    $("#gapDetected").trigger("openModal");
                    self.gapDetected(true);
                    break;
                }
            }
        };

        let duplicateLinkageCopy = null;

        self.updatePackage = function () {
            if(!self.periodicLimitCheck()){return;}

            for (let i = 0; i < self.duplicateLinkage().length; i++) {
                if (self.duplicateLinkage()[i].transExpiry) {
                    self.duplicateLinkage()[i].transExpiry = self.duplicateLinkage()[i].transExpiry.replace(/-/g, "");
                }

                self.duplicateLinkage()[i].transDate = self.duplicateLinkage()[i].transDate.replace(/-/g, "");
            }

            duplicateLinkageCopy = ko.toJS(ko.mapping.fromJS(self.duplicateLinkage()));
            self.gapDetected(false);
            self.abruptEndDetected(false);

            self.duplicateLinkage().sort(function (a, b) {
                if (a.transName < b.transName) {
                    return -1;
                }

                if (a.transName > b.transName) {
                    return 1;
                }

                return 0;
            });

            let swapped;

            do {
                swapped = false;

                for (let i = 0; i < self.duplicateLinkage().length - 1; i++) {
                    if (self.duplicateLinkage()[i].transName === self.duplicateLinkage()[i + 1].transName && self.duplicateLinkage()[i].transDate < self.duplicateLinkage()[i + 1].transDate) {
                        const temp = self.duplicateLinkage()[i];

                        self.duplicateLinkage()[i] = self.duplicateLinkage()[i + 1];
                        self.duplicateLinkage()[i + 1] = temp;
                        swapped = true;
                    }
                }
            } while (swapped);

            if (self.effectiveSameDayFlag() !== "Y" && self.params.effectiveSameDayFlag !== "Y") {
                today = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
            }

            if (!self.userOkWithAbruptEndDetected()) {
                self.functionCall();
            }

            self.abruptEndOrGapCheck();
            self.duplicateLinkage(duplicateLinkageCopy);

            if (!self.abruptEndDetected() && !self.gapDetected()) {
                self.callReviewScreen();
            } else if (self.abruptEndDetected() && self.userOkWithAbruptEndDetected() && !self.gapDetected()) {
                self.callReviewScreen();
            } else if (self.gapDetected() && self.userOkWithGapDetected() && !self.abruptEndDetected()) {
                self.callReviewScreen();
            } else if (self.gapDetected() && self.userOkWithGapDetected() && self.abruptEndDetected() && self.userOkWithAbruptEndDetected()) {
                self.callReviewScreen();
            }
        };

        if (self.params.action === "EDIT") {
            self.editMode();
        }

        const selectedCurrencyDispose = self.selectedCurrency.subscribe(function () {
                self.createPackageData().currency(self.selectedCurrency());
            }),
            selectedAccessPointDispose = self.selectedAccessPoint.subscribe(function () {
                if (self.accessPointType() === "SINGLE") {
                    for (let i = 0; i < self.limitsData().accessPoint().length; i++) {
                        if (self.limitsData().accessPoint()[i].id === self.selectedAccessPoint()) {
                            self.createPackageData().accessPointValue(self.limitsData().accessPoint()[i].id);
                            self.accessPointDescription(self.limitsData().accessPoint()[i].description);
                            break;
                        }
                    }
                } else if (self.accessPointType() === "GROUP") {
                    for (let j = 0; j < self.limitsData().accessPointGroup().length; j++) {
                        if (self.limitsData().accessPointGroup()[j].accessPointGroupId === self.selectedAccessPoint()) {
                            self.createPackageData().accessPointValue(self.selectedAccessPoint());
                            self.accessPointDescription(self.limitsData().accessPointGroup()[j].description);
                            break;
                        }
                    }
                }

                self.createPackageData().accessPointGroupType(self.accessPointType());
            }),
            selectedConsolidatedDispose = self.accessPointType.subscribe(function () {
                if (self.accessPointType() === "GLOBAL") {
                    self.createPackageData().accessPointValue(self.accessPointType());
                    self.createPackageData().accessPointGroupType(self.accessPointType());
                }
            });

        self.transactionLimitsFlag = ko.computed(function () {
            return self.showCummulativeSearchSection() && self.showTransactionLimitsSearch() && self.showCoolingLimitSearchSection();
        }, this);

        self.currencyOptionChangeHandler = function (event) {
            self.selectedCurrency(event.detail.value.toString());
            self.showCummulativeSearchSection(false);
            self.showCoolingLimitSearchSection(false);
            self.showTransactionLimitsSearch(false);
            ko.tasks.runEarly();

            componentModel.fetchCoolingLimits(self.selectedCurrency()).done(function (data) {
                self.limitsData().coolingLimits(data.limitDTOs);
                self.showCoolingLimitSearchSection(true);
            });

            componentModel.fetchTransactionLimits(self.selectedCurrency()).done(function (data) {
                self.limitsData().transactionLimits(data.limitDTOs);
                self.showTransactionLimitsSearch(true);
            });

            componentModel.fetchCummulativeLimits(self.selectedCurrency()).done(function (data) {
                self.limitsData().cummulativeLimitsMonthly.removeAll();
                self.limitsData().cummulativeLimitsDaily.removeAll();

                if (data.limitDTOs) {
                    ko.utils.arrayForEach(data.limitDTOs, function (limit) {
                        if (limit.periodicity === "MONTHLY") {
                            self.limitsData().cummulativeLimitsMonthly.push(limit);
                        } else {
                            self.limitsData().cummulativeLimitsDaily.push(limit);
                        }
                    });
                }

                self.showCummulativeSearchSection(true);
            });

            componentModel.fetchEffectiveTodayDetails().done(function (data) {
                self.effectiveSameDayFlag(data.isEffectiveSameDay);
            });

            self.createPackageData().targetLimitLinkages.splice(0, self.createPackageData().targetLimitLinkages().length);
            self.duplicateLinkage.splice(0, self.duplicateLinkage().length);
            self.addTask();
        };

        self.dispose = function () {
            self.transactionLimitsFlag.dispose();
            selectedCurrencyDispose.dispose();
            selectedAccessPointDispose.dispose();
            selectedConsolidatedDispose.dispose();
        };
    };
});