define([
  "ojs/ojcore",
  "knockout",
  "jquery",
    "./model",
  "ojL10n!resources/nls/transaction-cutoff",
  "ojs/ojinputtext",
  "ojs/ojradioset",
  "ojs/ojdatetimepicker",
  "ojs/ojcheckboxset",
  "ojs/ojselectcombobox"
], function(oj, ko, $, reviewExceptionModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    self.resourceBundle = resourceBundle;
    rootParams.baseModel.registerElement("modal-window");
    rootParams.baseModel.registerElement("confirm-screen");
    self.userTypeOptions = ko.observableArray();
    self.showuserTypeOptions = ko.observable(false);

    if (self.approvalFlow) {
      self.exception = ko.toJS(self.exception);
      self.selectedTask = ko.observable();

      reviewExceptionModel.fetchTaskName(self.exception.workingWindowRoleTaskMapDTOs[0].taskCode).done(function(data) {
        self.exception.workingWindowRoleTaskMapDTOs[0].taskCode = data.task.taskId + "~" + data.task.name;
        self.selectedTask(data.task.name);
      });
    } else {
      self.approvalFlow = false;
      self.mode = ko.observable(rootParams.rootModel.params.mode);
      self.exception = rootParams.rootModel.params.selectedWindow;
      rootParams.dashboard.headerName(self.resourceBundle.pageTitle.title);
    }

    self.transactionName = self.resourceBundle.pageTitle.title;
    self.userType = [];
    self.transactionWindow = null;

    self.getTimePeriod = function(data) {
      if (data.startTime === "00:00" && data.endTime === "00:00") {
        return self.resourceBundle.labels.CLOSED;
      }

      if (data.startTime === "00:00" && data.endTime === "23:59") {
        return self.resourceBundle.labels.OPEN;
      }

      return self.resourceBundle.labels.LIMITED;
    };

    for (let i = 0; i < self.exception.workingWindowRoleTaskMapDTOs.length; i++) {
      self.userType.push(self.exception.workingWindowRoleTaskMapDTOs[i].roleName);
      self.transactionWindow = self.getTimePeriod(self.exception.workingWindowRoleTaskMapDTOs[i].workingWindowDayDTOs[0].workingWindowTimeDTOs[0]);
    }

    self.edit = function() {
      let mode = "CREATE";

      if (self.exception.workingWindowId) {
        mode = "EDIT";
      }

      const params = {
        mode: mode,
        selectedWindow: self.exception
      };

      rootParams.dashboard.loadComponent("create-cutoff-exceptions", params);
    };

    self.deleteException = function() {
      reviewExceptionModel.deleteException(self.exception.workingWindowId).done(function(data, status, jqXhr) {
        self.hideDeleteBlock();

        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.resourceBundle.common.deleteWorkingWindow
        });
      }).fail(function() {
        self.hideDeleteBlock();
      });
    };

    self.displayUserTypeData = function() {
      self.showuserTypeOptions(false);

      reviewExceptionModel.fetchUserType().done(function(taskData) {
        const mapped = taskData.enterpriseRoleDTOs.filter(function(roles) {
          return roles.enterpriseRoleId !== "administrator";
        }).map(function(data) {
          return {
            value: data.enterpriseRoleId,
            label: data.enterpriseRoleName
          };
        });

        self.userTypeOptions(mapped);
        self.showuserTypeOptions(true);
      });
    };

    self.displayUserTypeData();

    self.getDayName = function(date) {
      const today = new Date(date);

      return oj.LocaleData.getDayNames()[today.getDay()];
    };

    self.hideDeleteBlock = function() {
      $("#deleteDialog").hide();
    };

    self.goBack = function() {
      if (self.mode() === "REVIEW") {
        let mode = "CREATE";

        if (self.params.selectedWindow.workingWindowId) {
          mode = "EDIT";
        }

        const params = {
          selectedWindow: self.params.selectedWindow,
          mode: mode
        };

        rootParams.dashboard.loadComponent("create-cutoff-exceptions", params);
      } else {
        rootParams.dashboard.loadComponent("cutoff-exceptions", {});
      }
    };

    self.confirm = function() {
      for (let i = 0; i < self.exception.workingWindowRoleTaskMapDTOs.length; i++) {
        self.exception.workingWindowRoleTaskMapDTOs[i].taskCode = self.exception.workingWindowRoleTaskMapDTOs[i].taskCode.split("~")[0];
      }

      if (self.exception.workingWindowId) {
        reviewExceptionModel.updateException(self.exception.workingWindowId, ko.mapping.toJSON(self.exception)).done(function(data, status, jqXhr) {
          rootParams.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.transactionName
          });
        });
      } else {
        reviewExceptionModel.createException(ko.mapping.toJSON(self.exception)).done(function(data, status, jqXhr) {
          rootParams.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.transactionName
          });
        });
      }
    };
  };
});