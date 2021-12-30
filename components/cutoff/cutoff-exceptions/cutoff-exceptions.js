define([
  "ojs/ojcore",
  "knockout",
  "jquery",
    "./model",
  "ojL10n!resources/nls/transaction-cutoff",
  "ojL10n!resources/nls/standard-work-window",
  "ojs/ojinputtext",
  "ojs/ojradioset",
  "ojs/ojtable",
  "ojs/ojdatetimepicker",
  "ojs/ojknockout-validation",
  "ojs/ojselectcombobox",
  "ojs/ojarraytabledatasource",
  "ojs/ojvalidationgroup"
], function(oj, ko, $, cutoffExceptionsModel, resourceBundle,nls) {
  "use strict";

  return function(rootParams) {
    const self = this;

    self.exceptionName = ko.observable();
    self.exceptionId = ko.observable();
    self.exceptionDateForException = ko.observable();
    self.validationTracker = ko.observable();
    self.showDropDownTransactions = ko.observable(false);
    self.showTransactions = ko.observable(false);
    self.searchTransactions = ko.observableArray();
    self.transactionName = ko.observable();
    self.showSearchData = ko.observable(false);
    self.futureWorkingWindowDTOs = ko.observableArray();
    self.taskCode = ko.observable();
    self.datasource = ko.observable();
    self.selectedTransactionForException = ko.observable();
    self.selectedUser = ko.observable();
    self.updateData = ko.observable();
    self.groupValid = ko.observable();
    self.showuserTypeOptions = ko.observable(false);
    self.userTypeOptions = ko.observableArray();
    self.showDropDownuserTypeOptions = ko.observable(false);
    self.menuSelection = ko.observable(rootParams.rootModel.params.menuSelection);
    self.nls = resourceBundle;
    self.resourceBundle = nls;
    rootParams.baseModel.registerComponent("cutoff-nav-bar", "cutoff");
    rootParams.baseModel.registerComponent("create-cutoff-exceptions", "cutoff");
    rootParams.baseModel.registerComponent("review-exception-working-window", "cutoff");
    rootParams.dashboard.headerName(self.nls.pageTitle.title);

    const d = rootParams.baseModel.getDate();

    self.myDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(d.getFullYear(), d.getMonth(), d.getDate())));
    d.setDate(d.getDate());
    self.minEffectiveDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(d.setHours(0, 0, 0, 0))));
    self.dateInputValue = ko.observable("dd/MM/yyyy");

    self.dateInputConverter = ko.observable(oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({
      pattern: self.dateInputValue()
    }));

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

      cutoffExceptionsModel.getTransactions().done(function(taskData) {
        const tasks = customizeTaskListForDropdown(taskData.taskList);

        self.searchTransactions(tasks);
        self.showDropDownTransactions(true);
        self.showTransactions(true);
      });
    };

    if (self.searchTransactions().length === 0) {
      self.displayRulesData();
    }

    self.displayUserTypeData = function() {
      self.showuserTypeOptions(false);

      cutoffExceptionsModel.fetchUserType().done(function(taskData) {
        const mapped = taskData.enterpriseRoleDTOs.filter(function(roles) {
          return roles.enterpriseRoleId !== "administrator";
        }).map(function(data) {
          return {
            value: data.enterpriseRoleId,
            label: data.enterpriseRoleName
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

    self.reset = function() {
      self.exceptionDateForException("");
      self.selectedUser([]);
      self.selectedTransactionForException([]);
      self.showSearchData(false);
    };

    self.createWorkingWindow = function() {
      const params = {
        mode: "CREATE",
        menuSelection : "EXCEPTION"
      };

      rootParams.dashboard.loadComponent("create-cutoff-exceptions", params);
    };

    self.onExceptionSelected = function(data) {
      for (let i = 0; i < self.futureWorkingWindowDTOs().length; i++) {
        if (self.futureWorkingWindowDTOs()[i].workingWindowId === data.workingWindowId) {
          self.futureWorkingWindowDTOs()[i].workingWindowRoleTaskMapDTOs[0].taskCode = self.selectedTransactionForException();

          const params = {
            mode: "VIEW",
            selectedWindow: self.futureWorkingWindowDTOs()[i]
          };

          rootParams.dashboard.loadComponent("review-exception-working-window", params);
        }
      }
    };

    self.getUserTypes = function(data) {
      const userType = [];

      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].roleName === "retailuser")
            {userType.push("Retail");}

          if (data[i].roleName === "corporateuser")
            {userType.push("Corporate");}
        }
      }

      return userType.sort().toString();
    };

    self.search = function() {
      const tracker = document.getElementById("tracker");

      if (tracker.valid === "valid") {
        self.showSearchData(false);

        if (self.selectedTransactionForException()) {
          self.taskCode(self.selectedTransactionForException()[0].split("~")[0]);
        }

        let selectedUser;

        if (self.selectedUser()) {
          selectedUser = self.selectedUser()[0];
        }

        cutoffExceptionsModel.getTransactionList(selectedUser, self.exceptionDateForException(), self.taskCode()).done(function(data) {
          self.futureWorkingWindowDTOs(data.futureWorkingWindowDTO);

          if (data.futureWorkingWindowDTO) {
            if (data.futureWorkingWindowDTO.length > 0) {
              const exceptionData = $.map(data.futureWorkingWindowDTO, function(data) {
                const tableData = {};

                tableData.effectiveDate = data.effectiveDate;
                tableData.endDate = data.endDate;
                tableData.remark = data.remarks;
                tableData.workingWindowId = data.workingWindowId;

                if (data.workingWindowRoleTaskMapDTOs.length > 1) {
                  tableData.userTypes = rootParams.baseModel.format(self.nls.common.userTypes, {
                    firstUser: self.nls.common[data.workingWindowRoleTaskMapDTOs[0].roleName],
                    secondUser: self.nls.common[data.workingWindowRoleTaskMapDTOs[1].roleName]
                  });
                } else {
                  tableData.userTypes = self.nls.common[data.workingWindowRoleTaskMapDTOs[0].roleName];
                }

                tableData.transactionName = self.selectedTransactionForException().split("~")[1];
                tableData.status = data.workingWindowStatus;

                return tableData;
              }).filter(function(data) {
                return data.status !== "COMPLETED";
              });

              if (exceptionData.length > 0) {
                self.exceptionArray = rootParams.baseModel.sortLib(exceptionData, "effectiveDate", "asc");

                const exceptionSortArray = self.exceptionArray.map(function(data) {
                  const sortData = {};

                  sortData.effectiveDate = data.effectiveDate;
                  sortData.endDate = data.endDate;
                  sortData.remark = data.remark;
                  sortData.workingWindowId = data.workingWindowId;
                  sortData.userTypes = data.userTypes;
                  sortData.transactionName = data.transactionName;
                  sortData.status = data.status;

                  return sortData;
                });

                self.datasource(new oj.ArrayTableDataSource(exceptionSortArray, {
                  idAttribute: "workingWindowId"
                }));

                self.showSearchData(true);
              } else {
                rootParams.baseModel.showMessages(null, [self.nls.common.noRecord], "INFO");
              }
            } else {
              rootParams.baseModel.showMessages(null, [self.nls.common.noRecord], "INFO");
            }
          } else {
            rootParams.baseModel.showMessages(null, [self.nls.common.noRecord], "INFO");
          }
        });
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };
  };
});