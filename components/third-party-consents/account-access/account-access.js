define([

    "knockout",

    "ojL10n!resources/nls/third-party-consents",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojtable",
    "ojs/ojdialog",
    "ojs/ojlistview",
    "ojs/ojcollapsible",
    "ojs/ojswitch",
    "ojs/ojnavigationlist",
    "ojs/ojcheckboxset"
], function(ko, resourceBundle) {
    "use strict";

    return function(params) {
        const self = this;

        ko.utils.extend(self, params.rootModel);
        self.nls = resourceBundle;
        self.currentDatasource = ko.observableArray([]);
        self.transactionLoaded = ko.observable(false);
        params.baseModel.registerElement("nav-bar");

        self.accountsTabMenu = [{
            id: "CSA",
            label: self.nls.labels.currentAndSavings
        }, {
            id: "TRD",
            label: self.nls.labels.termDeposits
        }, {
            id: "LON",
            label: self.nls.labels.loan
        }];

        self.accountsUIOptions = {
            menuFloat: "left",
            fullWidth: false,
            defaultOption: self.selectedAccountTab
        };

        const accountTabDispose = self.selectedAccountTab.subscribe(function(currentTabId) {
            self.dataSource[self.prevAccountTab].accounts = self.currentDatasource();
            self.prevAccountTab = currentTabId;
            self.currentDatasource(self.dataSource[currentTabId].accounts);
        });

        self.createDataSource = function(accountList) {
            const optionsList = [];

            ko.utils.arrayForEach(accountList, function(account) {
                const dataSourceOption = {
                    accountNumber: account.accountNumber,
                    displayName: account.displayName,
                    checked: ko.observableArray([]),
                    mapAllTransactions: ko.observableArray([]),
                    accountExclusionId: account.accountExclusionId
                };

                dataSourceOption.displayId = dataSourceOption.accountNumber.displayValue.replace(/[^a-zA-Z0-9]/g, "");

                dataSourceOption.accountDisplayName = params.baseModel.format(self.nls.labels.accountNumber, {
                    accountNumber: dataSourceOption.accountNumber.displayValue,
                    accountType: dataSourceOption.displayName
                  });

                const tasks = ko.observableArray([]);
                let numberOfCheckedTasks = 0;

                ko.utils.arrayForEach(account.tasks, function(task) {
                    const taskOption = {
                        name: task.name,
                        checked: ko.observableArray([]),
                        parentName: dataSourceOption.accountNumber.displayValue
                    };

                    taskOption.displayId = (taskOption.parentName + taskOption.name).replace(/[^a-zA-Z0-9]/g, "");

                    const childTasks = ko.observableArray([]);
                    let numberOfCheckedChildTasks = 0;

                    ko.utils.arrayForEach(task.childTasks, function(obj) {
                        const childTaskOption = {
                            id: obj.childTask.id,
                            name: obj.childTask.name,
                            checked: ko.observableArray([]),
                            parentName: taskOption.parentName
                        };

                        childTaskOption.displayId = (childTaskOption.id + childTaskOption.parentName).replace(/[^a-zA-Z0-9]/g, "");

                        if (obj.allowed && self.accessPointSetupExists()) {
                            childTaskOption.checked.push("checked");

                            if (dataSourceOption.checked().length < 1) { dataSourceOption.checked.push("checked"); }

                            numberOfCheckedChildTasks++;
                        }

                        childTasks.push(childTaskOption);
                    });

                    if (numberOfCheckedChildTasks === task.childTasks.length) {
                        taskOption.checked.push("checked");
                        numberOfCheckedTasks++;
                    }

                    taskOption.childTasks = childTasks;

                    taskOption.selectAllChildTasks = function(data) {
                        if (data.detail.value.length > 0) {
                            ko.utils.arrayForEach(taskOption.childTasks(), function(childTask) {
                                childTask.checked.push("checked");
                            });
                        } else {
                            ko.utils.arrayForEach(taskOption.childTasks(), function(childTask) {
                                childTask.checked([]);
                            });
                        }
                    };

                    tasks.push(taskOption);
                });

                if (numberOfCheckedTasks === account.tasks.length) {
                    dataSourceOption.mapAllTransactions.push("checked");
                }

                dataSourceOption.tasks = tasks;

                dataSourceOption.selectAllTasks = function(data) {
                    if (data.detail.value.length > 0) {
                        ko.utils.arrayForEach(dataSourceOption.tasks(), function(task) {
                            task.checked.push("checked");
                        });
                    } else {
                        ko.utils.arrayForEach(dataSourceOption.tasks(), function(task) {
                            task.checked([]);
                        });
                    }
                };

                dataSourceOption.deselectAccount = function(data) {
                    if (data.detail.value.length === 0) {
                        dataSourceOption.mapAllTransactions([]);

                        ko.utils.arrayForEach(dataSourceOption.tasks(), function(task) {
                            task.checked([]);

                            ko.utils.arrayForEach(task.childTasks(), function(childTask) {
                                childTask.checked([]);
                            });
                        });
                    }
                };

                optionsList.push(dataSourceOption);
            });

            return optionsList;
        };

        let accountType;

        for (accountType in self.accounts) {
            if (Object.prototype.hasOwnProperty.call(self.accounts, accountType)) {
                const optionsList = self.createDataSource(self.accounts[accountType].accountList);

                self.dataSource[accountType] = {
                    accounts: optionsList
                };

                if (self.accessPointSetupExists()) {
                    self.dataSource[accountType].accountAccessId = self.accounts[accountType].accountAcceessId;
                }
            }
        }

        self.currentDatasource(self.dataSource[Object.keys(self.dataSource)[0]].accounts);
        self.transactionLoaded(true);

        self.dispose = function() {
            accountTabDispose.dispose();
        };
    };
});