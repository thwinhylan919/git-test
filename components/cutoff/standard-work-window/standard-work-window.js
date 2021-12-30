define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/standard-work-window",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation",
    "ojs/ojselectcombobox",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojaccordion",
    "ojs/ojcollapsible",
    "ojs/ojdatetimepicker",
    "ojs/ojvalidationgroup"
], function(oj, ko, $, standardWorkWindowModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        let taskCode, startDate, userType, workWindowId;
        const self = this,
            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(standardWorkWindowModel.getNewModel());

                return KoModel;
            };

        self.effectiveDate = ko.observable();
        self.groupValid = ko.observable();
        self.editData = ko.observable();
        self.validationTracker = ko.observable();
        self.currentEffectiveDate = ko.observable();
        self.futureEffectiveDate = ko.observableArray();
        self.displayFutureUserType = ko.observableArray();
        self.displayCurrentUserType = ko.observable();
        self.currentRetailDatasource = ko.observable();
        self.futureDatasource = ko.observableArray();
        self.processingType = ko.observable();
        self.futureProcessingType = ko.observableArray();
        self.actionHeaderheading = ko.observable("");
        self.showDropDownTransactions = ko.observable(false);
        self.showDropDownuserTypeOptions = ko.observable(false);
        self.showTransactions = ko.observable(false);
        self.showuserTypeOptions = ko.observable(false);
        self.futureWorkWindowDTO = ko.observableArray();
        self.searchTransactions = ko.observableArray();
        self.userTypeOptions = ko.observableArray();
        self.transactionName = ko.observable();
        self.mode = ko.observable();
        self.groupValid = ko.observable();
        self.futureWorkWindowList = ko.observableArray();
        self.selectedTransaction = ko.observable();
        self.selectedTransactionName = ko.observable();
        self.selectedUserType = ko.observable();
        self.afterDataFetchedButtons = ko.observable(false);
        self.currentTransactionsAvailabe = ko.observable(false);
        self.futureWorkingWindowAvailable = ko.observable(false);
        self.menuSelection = ko.observable("STANDARD");
        self.resourceBundle = resourceBundle;
        rootParams.baseModel.registerComponent("cutoff-nav-bar", "cutoff");
        rootParams.baseModel.registerComponent("create-standard-work-window", "cutoff");
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerElement("modal-window");
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.dashboard.headerName(self.resourceBundle.workingWindow.transactionWorkingWindow);

        function fetchChildTasks(task) {
            const taskCodeList = [];

            for (let j = 0; j < task.childTasks.length; j++) {
                const currentTask = task.childTasks[j],
                    taskObject = {};

                taskObject.label = currentTask.name;

                if (currentTask.childTasks) {
                    taskObject.children = fetchChildTasks(currentTask);
                } else {
                    for (let k = 0; k < currentTask.aspects.length; k++) {
                        if (currentTask.aspects[k].taskAspect === "working-window" && currentTask.aspects[k].enabled) {
                            taskObject.value = currentTask.id + "~" + currentTask.name;
                        }
                    }
                }

                taskCodeList.push(taskObject);
            }

            return taskCodeList;
        }

        function customizeTaskListForDropdown(task) {
            const taskCodeList = [];

            for (let i = 0; i < task.length; i++) {
                for (let j = 0; j < task[i].childTasks.length; j++) {
                    const currentTask = task[i].childTasks[j],
                        taskObject = {};

                    taskObject.label = currentTask.name;

                    if (currentTask.childTasks) {
                        taskObject.children = fetchChildTasks(currentTask);
                    } else {
                        for (let k = 0; k < currentTask.aspects.length; k++) {
                            if (currentTask.aspects[k].taskAspect === "working-window" && currentTask.aspects[k].enabled) {
                                taskObject.value = currentTask.id + "~" + currentTask.name;
                            }
                        }
                    }

                    taskCodeList.push(taskObject);
                }
            }

            return taskCodeList;
        }

        self.displayRulesData = function() {
            self.showTransactions(false);

            standardWorkWindowModel.getTransactions().done(function(taskData) {
                const tasks = customizeTaskListForDropdown(taskData.taskList);

                self.searchTransactions(tasks);
                self.showDropDownTransactions(true);
                self.showTransactions(true);
            });
        };

        self.displayUserTypeData = function() {
            self.showuserTypeOptions(false);

            standardWorkWindowModel.fetchUserType().done(function(taskData) {
                const mapped = taskData.enterpriseRoleDTOs.filter(function(roles) {
                    return roles.enterpriseRoleId !== "administrators";
                }).map(function(data) {
                    return {
                        value: data.enterpriseRoleId,
                        label: self.resourceBundle.common[data.enterpriseRoleId]
                    };
                });

                self.userTypeOptions(mapped);
                self.showDropDownuserTypeOptions(true);
                self.showuserTypeOptions(true);
            });
        };

        if (self.userTypeOptions().length === 0) {
            self.displayUserTypeData();
        }

        self.compare = function(a, b) {
            if (a.workingWindowDayId < b.workingWindowDayId) {
                return -1;
            }

            if (a.workingWindowDayId > b.workingWindowDayId) {
                return 1;
            }

            return 0;
        };

        self.getDay = function(data) {
            return self.resourceBundle.days[data];
        };

        self.getTransactionWindowType = function(data) {
            if (data.workingWindowTimeDTOs[0].endTime === "23:59" && data.workingWindowTimeDTOs[0].startTime === "00:00") {
                return self.resourceBundle.common.OPEN;
            } else if (data.workingWindowTimeDTOs[0].endTime === "00:00" && data.workingWindowTimeDTOs[0].startTime === "00:00") {
                return self.resourceBundle.common.CLOSED;
            }

            return self.resourceBundle.common.LIMITED;
        };

        if (self.searchTransactions().length === 0) {
            self.displayRulesData();
        }

        self.capitalize = function(string) {
            return string[0].toUpperCase() + string.slice(1);
        };

        self.dataDetails = function(data) {
            return {
                day: self.getDay(data.day),
                transactionWindowType: self.getTransactionWindowType(data),
                startTime: data.workingWindowTimeDTOs[0].startTime,
                endTime: data.workingWindowTimeDTOs[0].endTime
            };
        };

        self.search = function() {
            const tracker = document.getElementById("tracker");

            if (tracker.valid === "valid") {
                self.futureDatasource.removeAll();
                self.afterDataFetchedButtons(false);
                self.currentTransactionsAvailabe(false);
                self.futureWorkingWindowAvailable(false);

                if (self.selectedTransaction()) { taskCode = self.selectedTransaction().split("~")[0]; }

                startDate = self.effectiveDate();
                userType = self.selectedUserType();

                standardWorkWindowModel.fetchStandardWorkWindowDetails(taskCode, startDate, userType).done(function(taskData) {
                    self.selectedTransactionName(self.selectedTransaction().split("~")[1]);

                    let role1, role2, role;

                    if (taskData.currentWorkingWindowDTO) {
                        if (taskData.currentWorkingWindowDTO.processingType === "SUCCESS") { self.processingType(self.resourceBundle.workingWindow.tanks); } else { self.processingType(self.resourceBundle.workingWindow.transactionRejected); }

                        self.currentEffectiveDate(taskData.currentWorkingWindowDTO.effectiveDate);

                        const dayDTOList = taskData.currentWorkingWindowDTO.workingWindowRoleTaskMapDTOs;

                        self.standardWindowDetails = getNewKoModel().workWindowModel;

                        if (dayDTOList.length === 1) {
                            role1 = dayDTOList[0].roleName.replace(/User/gi, "");
                            role1 = self.capitalize(role1);
                            self.displayCurrentUserType(role1);
                        } else {
                            role1 = self.capitalize(self.capitalize(dayDTOList[0].roleName.replace(/User/gi, "")));
                            role2 = self.capitalize(dayDTOList[1].roleName.replace(/User/gi, ""));

                            role = rootParams.baseModel.format(self.resourceBundle.common.roleType, {
                                role1: role1,
                                role2: role2
                            });

                            self.displayCurrentUserType(role);
                        }

                        let currentTableData = dayDTOList[0].workingWindowDayDTOs;

                        currentTableData = currentTableData.sort(self.compare);
                        self.standardWindowDetails = currentTableData.map(self.dataDetails);

                        self.currentRetailDatasource(new oj.ArrayTableDataSource(self.standardWindowDetails, {
                            idAttribute: "day"
                        }));

                        self.currentTransactionsAvailabe(true);
                    }

                    if (taskData.futureWorkingWindowDTO && taskData.futureWorkingWindowDTO.length > 0) {
                        self.futureWorkWindowList(taskData.futureWorkingWindowDTO);

                        for (let k = 0; k < taskData.futureWorkingWindowDTO.length; k++) {
                            self.futureWorkWindowDTO()[k] = taskData.futureWorkingWindowDTO[k];
                            self.futureWorkWindowDTO()[k].workingWindowRoleTaskMapDTOs[0].taskCode = self.selectedTransaction();

                            if (taskData.futureWorkingWindowDTO[k].processingType === "SUCCESS") { self.futureProcessingType()[k] = self.resourceBundle.workingWindow.tanks; } else { self.futureProcessingType()[k] = self.resourceBundle.workingWindow.transactionRejected; }

                            self.futureEffectiveDate()[k] = taskData.futureWorkingWindowDTO[k].effectiveDate;

                            const futuredayDTOList = taskData.futureWorkingWindowDTO[k].workingWindowRoleTaskMapDTOs;

                            self.standardWindowDetails = getNewKoModel().workWindowModel;

                            if (futuredayDTOList.length === 1) {
                                self.displayFutureUserType()[k] = self.capitalize(futuredayDTOList[0].roleName.replace(/User/gi, ""));
                            } else {
                                role1 = self.capitalize(futuredayDTOList[0].roleName.replace(/User/gi, ""));
                                role2 = self.capitalize(futuredayDTOList[1].roleName.replace(/User/gi, ""));

                                role = rootParams.baseModel.format(self.resourceBundle.common.roleType, {
                                    role1: role1,
                                    role2: role2
                                });

                                self.displayFutureUserType()[k] = role;
                            }

                            let futureTableData = futuredayDTOList[0].workingWindowDayDTOs;

                            futureTableData = futureTableData.sort(self.compare);
                            self.standardWindowDetails = futureTableData.map(self.dataDetails);
                            self.futureDatasource().push(self.standardWindowDetails);
                        }

                        for (let i = 0; i < self.futureDatasource().length; i++) {
                            self.futureDatasource()[i] = new oj.ArrayTableDataSource(self.futureDatasource()[i], {
                                idAttribute: "day"
                            });
                        }

                        self.futureWorkingWindowAvailable(true);
                    }

                    if (!taskData.futureWorkingWindowDTO && !taskData.currentWorkingWindowDTO) {
                        self.afterDataFetchedButtons(false);
                        rootParams.baseModel.showMessages(null, [self.resourceBundle.common.noRecords], "INFO");
                    } else {
                        self.afterDataFetchedButtons(true);
                    }
                });
            } else {
                tracker.showMessages();
                tracker.focusOn("@firstInvalidShown");
            }
        };

        self.mode("view");

        self.createWorkingWindow = function() {
            self.mode("CREATE");

            const params = {
                mode : "CREATE",
                menuSelection : "STANDARD"
            };

            rootParams.dashboard.loadComponent("create-standard-work-window", params);
        };

        self.back = function() {
            rootParams.dashboard.switchModule();
        };

        self.reset = function() {
            self.afterDataFetchedButtons(false);
            self.currentTransactionsAvailabe(false);
            self.futureWorkingWindowAvailable(false);
            self.selectedUserType([]);
            self.effectiveDate(undefined);
            self.selectedTransaction([]);
        };

        self.edit = function(data) {
            const editParams = {
                mode:"EDIT",
                editData : self.futureWorkWindowDTO()[data.currentTarget.id.split("_")[1]]
              };

            rootParams.dashboard.loadComponent("create-standard-work-window", editParams);
        };

        self.deleteWorkWindow = function() {
            standardWorkWindowModel.deleteWorkWindow(workWindowId).done(function(data, status, jqXhr) {
                self.transactionName(self.resourceBundle.workingWindow.deleteWorkingWindow);
                self.hideDeleteBlock();

                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.transactionName()
                });
            }).fail(function() {
                self.hideDeleteBlock();
            });
        };

        self.hideDeleteBlock = function() {
            $("#deleteDialog").hide();
        };

        self.showDelete = function(data) {
            const index = data.currentTarget.id.split("_")[1];

            workWindowId = self.futureWorkWindowList()[index].workingWindowId;
            $("#deleteDialog").trigger("openModal");
        };

        self.done = function() {
            rootParams.dashboard.switchModule();
        };

        self.cancel = function() {
            rootParams.dashboard.switchModule();
        };
    };
});