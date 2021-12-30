define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/task-aspects",
  "ojs/ojselectcombobox",
  "ojs/ojcheckboxset",
  "ojs/ojswitch",
  "ojs/ojknockout-validation",
  "ojs/ojvalidationgroup"
], function (ko, TransactionAspectsModel, ResourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this,
      getNewKoModel = function () {
        const KoModel = ko.mapping.fromJS(TransactionAspectsModel.getNewModel());

        return KoModel;
      };

    self.resource = ResourceBundle;
    self.payload = getNewKoModel().payload;
    self.selectedTransaction = typeof rootParams.rootModel.previousState !== "undefined" ? rootParams.rootModel.previousState.selectedTransaction : ko.observable();
    self.transactionsList = typeof rootParams.rootModel.previousState !== "undefined" ? rootParams.rootModel.previousState.transactionsList : ko.observable();
    self.taskList = typeof rootParams.rootModel.previousState !== "undefined" ? rootParams.rootModel.previousState.taskList : ko.observableArray();
    self.supportedTaskList = typeof rootParams.rootModel.previousState !== "undefined" ? rootParams.rootModel.previousState.supportedTaskList : ko.observableArray();
    self.graceperiod = typeof rootParams.rootModel.previousState !== "undefined" ? rootParams.rootModel.previousState.graceperiod : ko.observable();
    self.approvalValue = typeof rootParams.rootModel.previousState !== "undefined" ? rootParams.rootModel.previousState.approvalValue : ko.observable();
    self.graceEnabled = typeof rootParams.rootModel.previousState !== "undefined" ? rootParams.rootModel.previousState.graceEnabled : ko.observable(true);
    self.mode = typeof rootParams.rootModel.previousState !== "undefined" ? rootParams.rootModel.previousState.prevmode : ko.observable();

    self.taskName = typeof rootParams.rootModel.previousState !== "undefined" ? rootParams.rootModel.previousState.taskName : ko.observable();
    self.emptyList = typeof rootParams.rootModel.previousState !== "undefined" ? rootParams.rootModel.previousState.emptyList : ko.observable(false);
    self.validationTracker = ko.observable();
    self.switchEnabled = typeof rootParams.rootModel.previousState !== "undefined" ? rootParams.rootModel.previousState.switchEnabled : ko.observable(true);
    self.dataLoaded = typeof rootParams.rootModel.previousState !== "undefined" ? rootParams.rootModel.previousState.dataLoaded : ko.observable(false);
    rootParams.baseModel.registerElement("action-header");
    rootParams.baseModel.registerElement("confirm-screen");
    rootParams.baseModel.registerComponent("review-task-aspects", "transaction-aspects");

    rootParams.dashboard.headerName(self.resource.header.transactionAspects);

    TransactionAspectsModel.getTransactions().done(function (data) {
      const tasks = ko.utils.arrayFilter(data.taskList, function (dataItem) {
        return dataItem.aspects && dataItem.aspects.length;
      }),
      sortedTasks = tasks.sort(function(left, right) { return left.name === right.name ? 0 : left.name < right.name ? -1 : 1; });

      self.transactionsList(sortedTasks);
      self.dataLoaded(true);
    });

    self.searchTransactions = function () {
      if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("TaskValidater"))) {
        return;
      }

      TransactionAspectsModel.searchTransactions(self.selectedTransaction()).done(function (data) {
        self.taskName(data.task.name);
        self.emptyList(false);
        self.taskList(data.task.aspects);
        self.supportedTaskList.removeAll();
        self.graceperiod("");

        for (let i = 0; i < self.taskList().length; i++) {
          if (self.taskList()[i].taskAspect !== "grace-period") {
            self.supportedTaskList.push(self.taskList()[i]);
          } else {
            self.graceperiod(self.taskList()[i]);
          }

          if (self.taskList()[i].taskAspect === "approval") {
            self.approvalValue(self.taskList()[i].enabled);
          }
        }

        if (!self.supportedTaskList().length) {
          self.emptyList(true);
          self.mode("NOASPECTS");
        } else {
          self.switchEnabled(true);
          self.mode("VIEW");
          self.dataLoaded(false);
          self.dataLoaded(true);
          self.graceEnabled(true);
        }
      });
    };

    self.editTransactions = function () {
      self.mode("EDIT");
      self.switchEnabled(false);

      if (self.approvalValue()) {
        self.graceEnabled(false);
      } else {
        self.graceEnabled(true);
      }

      self.dataLoaded(false);
      self.dataLoaded(true);
    };

    self.saveTransactions = function () {
      const context = {};

      context.mode = "REVIEW";
      context.switchEnabled = self.switchEnabled;
      context.graceEnabled = self.graceEnabled;
      context.graceperiod = self.graceperiod;
      context.dataLoaded = self.dataLoaded;
      context.selectedTransaction = self.selectedTransaction;
      context.taskName = self.taskName;
      context.taskList = self.taskList;
      context.supportedTaskList = self.supportedTaskList;
      context.transactionsList = self.transactionsList;
      context.approvalValue = self.approvalValue;
      context.switchEnabled = self.switchEnabled;
      context.emptyList = self.emptyList;
      context.prevmode = self.mode;
      rootParams.dashboard.loadComponent("review-task-aspects", context);

    };

    self.clearTransactions = function () {
      self.selectedTransaction("");
    };

    self.changeGrace = function () {
      for (let i = 0; i < self.taskList().length; i++) {
        if (self.taskList()[i].taskAspect === "approval") {
          self.approvalValue(self.taskList()[i].enabled);
        }
      }

      if (self.approvalValue() === true) {
        self.graceEnabled(false);
      } else {
        self.graceEnabled(true);
      }
    };

    self.back = function () {
      if (self.mode() === "EDIT") {
        self.mode("VIEW");
        self.graceEnabled(true);
        self.switchEnabled(true);
      } else if (self.mode() === "VIEW") {
        self.mode("");
        self.switchEnabled(true);
      } else if (self.mode() === "NOASPECTS") {
        self.mode("");
        self.switchEnabled(true);
      }
    };

    self.confirm = function () {
      self.payload = self.taskList();

      TransactionAspectsModel.setTaskAspects(self.selectedTransaction(), ko.toJSON(self.payload)).then(function (data) {
        self.httpStatus = data.getResponseStatus();

        rootParams.dashboard.loadComponent("confirm-screen", {
          transactionResponse: data,
          transactionName: self.resource.common.maintenance
        });
      });
    };

  };
});