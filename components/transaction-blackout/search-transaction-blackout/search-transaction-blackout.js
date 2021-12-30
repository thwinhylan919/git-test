define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/transaction-blackout",
  "ojs/ojknockout-validation",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojradioset",
  "ojs/ojdatetimepicker",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojvalidationgroup"
], function (oj, ko, $, searchTransactionBlackoutModel, resourceBundle) {
  "use strict";

  return function (rootParams) {
    let taskCode, userType, startDate;
    const self = this;

    self.selectedUserType = ko.observable();
    self.effectiveDate = ko.observable();
    self.dataLoaded = ko.observable(false);

    self.compare = function (a, b) {
      if (a.label < b.label) {
        return -1;
      }

      if (a.label > b.label) {
        return 1;
      }

      return 0;
    };

    self.groupValid = ko.observable();
    self.mode = ko.observable();
    self.prevMode = ko.observable();
    self.selectedTrasactionForSearch = ko.observable();
    self.typeTransactionForSearch = ko.observable();
    self.editDisabled = ko.observable(true);
    self.validationTracker = ko.observable();
    self.showDropDownTransactions = ko.observable(false);
    self.showTransactions = ko.observable(false);
    self.searchTransactions = ko.observableArray();
    self.showDropDown = ko.observable(true);
    self.showDropDownUsers = ko.observable(true);
    self.transactionData = ko.observableArray();
    self.datasource = ko.observable();
    self.transactionName = ko.observable();
    self.blackoutType = ko.observable();
    self.searchUserTypeOptions = ko.observableArray();
    self.showuserTypeOptions = ko.observable(false);
    self.showDropDownuserTypeOptions = ko.observable(false);
    self.selectDate = ko.observable();
    self.show = ko.observable();
    self.transactionBlackoutDetails = ko.observable();
    self.resourceBundle = resourceBundle;
    rootParams.dashboard.headerName(self.resourceBundle.transaction.blackout);
    rootParams.baseModel.registerComponent("creating-transaction-blackout", "transaction-blackout");

    self.transTypes = ko.observableArray([{
        value: "MAINTENANCE",
        label: self.resourceBundle.transaction.maintenance
      },
      {
        value: "ADMINISTRATION",
        label: self.resourceBundle.transaction.admin_maintenance
      },
      {
        value: "INQUIRY",
        label: self.resourceBundle.transaction.inquiry
      },
      {
        value: "NONFINANCIAL_TRANSACTION",
        label: self.resourceBundle.transaction.nonFinancialTransaction
      },
      {
        value: "FINANCIAL_TRANSACTION",
        label: self.resourceBundle.transaction.financialTransaction
      },
      {
        value: "AMOUNT_FIN_TRANSACTION",
        label: self.resourceBundle.transaction.amountFinancialTransaction
      }
    ]);

    self.displayUserTypeData = function () {
      self.showuserTypeOptions(false);

      searchTransactionBlackoutModel.fetchUserType().done(function (taskData) {
        const mapped = [];

        for (let i = 0; i < taskData.enterpriseRoleDTOs.length; i++) {
          mapped.push({
            value: taskData.enterpriseRoleDTOs[i].enterpriseRoleId,
            label: taskData.enterpriseRoleDTOs[i].enterpriseRoleName
          });
        }

        mapped.push({
          value: self.resourceBundle.transaction.prospectValue,
          label: self.resourceBundle.transaction.prospect
        });

        self.searchUserTypeOptions(mapped.sort(self.compare));
        self.showDropDownuserTypeOptions(true);
        self.showuserTypeOptions(true);
      });
    };

    if ($.isEmptyObject(self.searchUserTypeOptions())) {
      self.displayUserTypeData();
    }

    if (self.typeTransactionForSearch() !== null && self.typeTransactionForSearch() !== "undefined") {
      self.typeTransactionForSearch.subscribe(function (data) {
        self.showTransactions(false);
        self.selectedTrasactionForSearch([]);
        self.displayRulesData(data);
      });
    }

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
            if (currentTask.aspects[k].taskAspect === "blackout" && currentTask.aspects[k].enabled) {
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
              if (currentTask.aspects[k].taskAspect === "blackout" && currentTask.aspects[k].enabled) {
                taskObject.value = currentTask.id + "~" + currentTask.name;
              }
            }
          }

          taskCodeList.push(taskObject);
        }
      }

      return taskCodeList;
    }

    self.displayRulesData = function (taskType) {
      self.showTransactions(false);

      if (taskType) {
        self.editDisabled(false);
      } else {
        self.editDisabled(true);
      }

      searchTransactionBlackoutModel.getTransactions(taskType).done(function (taskData) {
        const tasks = customizeTaskListForDropdown(taskData.taskList);

        self.searchTransactions(tasks);
        self.showDropDownTransactions(true);
        self.showDropDownUsers(true);
        self.showTransactions(true);
      });
    };

    const getNewKoModel = function () {
      const KoModel = searchTransactionBlackoutModel.getNewModel();

      return ko.mapping.fromJS(KoModel);
    };

    self.transactionDetails = getNewKoModel().transactionDetails;

    self.compare = function (a, b) {
      if (a.status < b.status) {
        return -1;
      }

      if (a.status > b.status) {
        return 1;
      }

      return 0;
    };

    self.search = function () {
      const tracker = document.getElementById("tracker");

      if (tracker.valid === "valid") {
        self.dataLoaded(false);

        if (self.typeTransactionForSearch() && self.typeTransactionForSearch() !== "" && self.typeTransactionForSearch()) {
          taskCode = self.selectedTrasactionForSearch().split("~")[0];
        } else {
          taskCode = "";
        }

        if (self.selectedUserType() && self.selectedUserType() !== "") {
          userType = self.selectedUserType();
        } else {
          userType = "";
        }

        if (self.effectiveDate() && self.effectiveDate() !== null) {
          startDate = self.effectiveDate();
        } else {
          startDate = "";
        }

        searchTransactionBlackoutModel.fetchDetails(taskCode, userType, startDate).done(function (data) {
          self.transactionBlackoutDetails(data.transactionBlackout);
          self.transactionDetails.transactionBlackoutDTO(data.transactionBlackout);

          if (data.transactionBlackout) {
                        const blackoutData = data.transactionBlackout.map(function (data) {
                            const tableData = {};

                            tableData.transactionName = data.transactionName;
                            tableData.blackoutType = self.resourceBundle.transaction.frequency[data.frequency];
                            tableData.startDate = data.startDate.substring(0,10);
                            tableData.endDate = data.endDate.substring(0,10);
                            tableData.status = self.resourceBundle.transaction.frequency[data.transactionBlackoutStatusType];
                            tableData.blackoutId = data.blackoutId;

                            return tableData;
                        });

            if (blackoutData.length > 0) {
              self.blackoutArray = [];

              for (let i = 0; i < blackoutData.length; i++) {
                  self.blackoutArray.push(blackoutData[i]);
              }

              self.blackoutArray = rootParams.baseModel.sortLib(self.blackoutArray, [
                "status",
                "startDate",
                "transactionName"
              ], [
                "asc",
                "asc",
                "asc"
              ]);

              const blackoutSortArray = self.blackoutArray.map(function (data) {
                const sortData = {};

                sortData.transactionName = data.transactionName;
                sortData.blackoutType = data.blackoutType;
                sortData.startDate = data.startDate;
                sortData.endDate = data.endDate;
                sortData.status = data.status;
                sortData.blackoutId = data.blackoutId;
                sortData.startTime=data.startTime;
                sortData.endTime=data.endTime;

                return sortData;
              });

              self.datasource = new oj.ArrayTableDataSource(blackoutSortArray, {
                idAttribute: "blackoutId"
              });

              self.dataLoaded(true);
            } else {
              rootParams.baseModel.showMessages(null, [self.resourceBundle.transaction.NoRecord], "INFO");
            }
          }
        });
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };

    self.createTransactionBlackout = function () {

      const params = {
        mode:"CREATE",
        prevMode : "CREATE"
      };

      rootParams.dashboard.loadComponent("creating-transaction-blackout", params);
    };

    self.reset = function () {
      self.effectiveDate(null);
      self.selectedUserType(null);
      self.typeTransactionForSearch("");
      self.selectedTrasactionForSearch(null);
      self.editDisabled(true);
      self.dataLoaded(false);
    };

    self.onBlackoutIdSelected = function (data) {
      self.mode("VIEW");
      self.prevMode("EDIT");

      const dataToSend = self.transactionBlackoutDetails().filter(function (blackout) {
        return blackout.blackoutId === data.blackoutId;
      });

      dataToSend[0].selectedTrasactionForSearch = self.selectedTrasactionForSearch();
      dataToSend[0].transactionType = self.typeTransactionForSearch();
      dataToSend[0].mode = self.mode();
      dataToSend[0].prevMode = self.prevMode();
      rootParams.dashboard.loadComponent("creating-transaction-blackout", dataToSend);
    };
  };
});