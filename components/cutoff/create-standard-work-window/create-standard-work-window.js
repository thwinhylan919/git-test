define([
  "ojs/ojcore",
  "knockout",
      "./model",
  "ojL10n!resources/nls/standard-work-window",
  "ojs/ojinputtext",
  "ojs/ojradioset",
  "ojs/ojknockout-validation",
  "ojs/ojdatetimepicker",
  "ojs/ojcheckboxset",
  "ojs/ojselectcombobox",
  "ojs/ojvalidationgroup"
], function(oj, ko, standardWorkWindowModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    self.nls = resourceBundle;

    const getNewKoModel = function() {
      const KoModel = standardWorkWindowModel.getNewModel();

      return ko.mapping.fromJS(KoModel);
    };

    self.showDropDownTransactions = ko.observableArray();
    self.menuSelection = ko.observable(rootParams.rootModel.params.menuSelection);
    rootParams.dashboard.headerName(self.nls.pageTitle.title);
    self.addTimeObs = ko.observable(false);
    self.transactionName = ko.observable();
    self.line1 = ko.observable();
    self.resourceBundle = resourceBundle;

    self.validationTracker = ko.observable();
    self.httpStatus = ko.observable();
    self.statusMessage = ko.observable();
    self.transactionStatus = ko.observable();
    self.rootModelInstance = ko.observable(getNewKoModel());
    self.standardWindowDetails = self.rootModelInstance().WorkingWindow;
    self.userType = ko.observableArray();
    self.editWorkWindowId = ko.observable();
    self.transactionType = ko.observable();
    self.editStartTime = ko.observable();
    self.editEndTime = ko.observable();
    self.showDropDown = ko.observable();
    self.overalpping = ko.observable();
    self.showData = ko.observable(false);
    self.selectedTransaction = ko.observable();
    self.userTypeOptions = ko.observableArray();
    self.showuserTypeOptions = ko.observable(false);
    self.showDropDownuserTypeOptions = ko.observable(false);
    self.showuserTypeList = ko.observable(false);
    self.transactions = ko.observable([]);
    self.showTransactions = ko.observable();
    self.prevMode = ko.observable();
    self.groupValid = ko.observable();
    self.childParentTaskMap = {};
    self.mode = ko.observable(rootParams.rootModel.params.mode);
    rootParams.baseModel.registerComponent("review-standard-work-window", "cutoff");
    rootParams.baseModel.registerElement("confirm-screen");
    rootParams.baseModel.registerComponent("cutoff-nav-bar", "cutoff");

    self.secondConverter = ko.observable(oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({
      hour: "2-digit",
      hour12: false,
      minute: "2-digit"
    }));

    self.dateInputValue = ko.observable("dd/MM/yyyy");

    self.displayUserTypeData = function() {
      self.showuserTypeOptions(false);

      standardWorkWindowModel.fetchUserType().done(function(taskData) {
        const mapped = [];

        for (let i = 0; i < taskData.enterpriseRoleDTOs.length; i++) {
          if (taskData.enterpriseRoleDTOs[i].enterpriseRoleId !== "administrator") {
            mapped.push({
              value: taskData.enterpriseRoleDTOs[i].enterpriseRoleId,
              label: taskData.enterpriseRoleDTOs[i].enterpriseRoleName
            });
          }
        }

        self.userTypeOptions(mapped);
        self.showDropDownuserTypeOptions(true);
        self.showuserTypeOptions(true);
        self.showuserTypeList(true);
      });
    };

    self.displayUserTypeData();

    self.dateInputConverter = ko.observable(oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({
      pattern: self.dateInputValue()
    }));

    const d = rootParams.baseModel.getDate();

    d.setDate(d.getDate() + 1);
    self.minEffectiveDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(d.setHours(0, 0, 0, 0))));

    self.getDayName = function(date) {
      const today = new Date(date);
      let day;

      switch (today.getDay()) {
        case 0:
            day = self.nls.days.SUN;
            break;
        case 1:
            day = self.nls.days.MON;
            break;
        case 2:
            day = self.nls.days.TUE;
            break;
        case 3:
            day = self.nls.days.WED;
            break;
        case 4:
          day = self.nls.days.THU;
          break;
        case 5:
            day = self.nls.days.FRI;
            break;
        case 6:
            day = self.nls.days.SAT;
            break;

      }

      return day;
    };

    self.transactionTimeType = ko.observable([{
        value: "LIMITED",
        label: self.nls.common.LIMITED
      },
      {
        value: "OPEN",
        label: self.nls.common.OPEN
      },
      {
        value: "CLOSED",
        label: self.nls.common.CLOSED
      }
    ]);

    self.getTIme = function(data) {
      const dateForTime = rootParams.baseModel.getDate();

      dateForTime.setHours(data.split(":")[0], data.split(":")[1], 0);

      function pad(n) {
        return n < 10 ? "0" + n : n;
      }

      return "T" + pad(dateForTime.getHours()) + ":" + pad(dateForTime.getMinutes()) + ":" + pad(dateForTime.getSeconds());
    };

    self.getTransactionWindowType = function(data) {
      if (data.workingWindowTimeDTOs[0].endTime === "23:59" && data.workingWindowTimeDTOs[0].startTime === "00:00") {
        return "OPEN";
      } else if (data.workingWindowTimeDTOs[0].endTime === "00:00" && data.workingWindowTimeDTOs[0].startTime === "00:00") {
        return "CLOSED";
      }

      return "LIMITED";
    };

    self.getWidowDisableStatus = function(data) {
      if (data[0] === "OPEN" || data[0] === "CLOSED") {
        return true;
      }

      return false;
    };

    if (self.mode() === "CREATE") {
      self.showData(false);

      for (let i = 0; i < 7; i++) {
        if (i < 5) {
          self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[i].transactionWindow("OPEN");
          self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[i].workingWindowTimeDTOs()[0].endTime("T23:59:00");
          self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[i].workingWindowTimeDTOs()[0].startTime("T00:00:00");
          self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[i].workingWindowTimeDTOs()[0].disabled(true);
        } else {
          self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[i].transactionWindow("CLOSED");
          self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[i].workingWindowTimeDTOs()[0].endTime("T00:00:00");
          self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[i].workingWindowTimeDTOs()[0].startTime("T00:00:00");
          self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[i].workingWindowTimeDTOs()[0].disabled(true);
        }
      }

      self.showData(true);
    }

    if (self.mode() === "EDIT") {
      self.editData = ko.observable(rootParams.rootModel.params.editData);
      self.showData(false);
      self.prevMode("EDIT");
      self.editWorkWindowId(self.editData().workingWindowId);

      if (self.editData().workingWindowRoleTaskMapDTOs.length === 1) {
        self.userType([self.editData().workingWindowRoleTaskMapDTOs[0].roleName]);
      } else {
        self.userType([
          self.editData().workingWindowRoleTaskMapDTOs[0].roleName,
          self.editData().workingWindowRoleTaskMapDTOs[1].roleName
        ]);
      }

      if (self.editData().workingWindowRoleTaskMapDTOs[0].taskCode[0].split("~")[0] === "ALL") {
        self.transactionType("ALL");
      } else {
        self.transactionType("SINGLE");
        self.selectedTransaction(self.editData().workingWindowRoleTaskMapDTOs[0].taskCode);
      }

      self.standardWindowDetails.processingType(self.editData().processingType);
      self.standardWindowDetails.effectiveDate(self.editData().effectiveDate);
      self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].roleName(self.editData().workingWindowRoleTaskMapDTOs[0].roleName);
      self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].taskCode(self.editData().workingWindowRoleTaskMapDTOs[0].taskCode);

      for (let j = 0; j < 7; j++) {
        self.editStartTime(self.getTIme(self.editData().workingWindowRoleTaskMapDTOs[0].workingWindowDayDTOs[j].workingWindowTimeDTOs[0].startTime));
        self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[j].workingWindowTimeDTOs()[0].startTime(self.editStartTime());
        self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[j].transactionWindow(self.getTransactionWindowType(self.editData().workingWindowRoleTaskMapDTOs[0].workingWindowDayDTOs[j]));
        self.editEndTime(self.getTIme(self.editData().workingWindowRoleTaskMapDTOs[0].workingWindowDayDTOs[j].workingWindowTimeDTOs[0].endTime));
        self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[j].workingWindowTimeDTOs()[0].endTime(self.editEndTime());
        self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[j].workingWindowTimeDTOs()[0].disabled(self.getWidowDisableStatus(self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[j].transactionWindow()));

        if (self.editData().workingWindowRoleTaskMapDTOs[0].workingWindowDayDTOs[j].workingWindowTimeDTOs.length > 1) {
          for (let k = 1; k < self.editData().workingWindowRoleTaskMapDTOs[0].workingWindowDayDTOs[j].workingWindowTimeDTOs.length; k++) {
            const stime = self.getTIme(self.editData().workingWindowRoleTaskMapDTOs[0].workingWindowDayDTOs[j].workingWindowTimeDTOs[k].startTime),
              etime = self.getTIme(self.editData().workingWindowRoleTaskMapDTOs[0].workingWindowDayDTOs[j].workingWindowTimeDTOs[k].endTime);

            self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[j].workingWindowTimeDTOs.push(ko.mapping.fromJS({
              startTime: stime,
              endTime: etime,
              dayIndex: k
            }));
          }
        }
      }

      self.showData(true);
    }

    self.optionChangedHandler = function(event) {
      let index = event.currentTarget.id;

      index = index.substring(index.length - 1, index.length);

      let length, i;

      if (event.detail.value === "LIMITED") {
        self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[index].workingWindowTimeDTOs()[0].disabled(false);
      } else if (event.detail.value === "OPEN") {
        self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[index].workingWindowTimeDTOs()[0].endTime("T23:59:00");
        self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[index].workingWindowTimeDTOs()[0].startTime("T00:00:00");
        self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[index].workingWindowTimeDTOs()[0].disabled(true);
        length = self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[index].workingWindowTimeDTOs().length;

        if (length > 1) {
          for (i = 0; i < length - 1; i++) {
            self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[index].workingWindowTimeDTOs.pop();
          }
        }
      } else if (event.detail.value === "CLOSED") {
        self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[index].workingWindowTimeDTOs()[0].endTime("T00:00:00");
        self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[index].workingWindowTimeDTOs()[0].startTime("T00:00:00");
        self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[index].workingWindowTimeDTOs()[0].disabled(true);
        length = self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[index].workingWindowTimeDTOs().length;

        if (length > 1) {
          for (i = 0; i < length - 1; i++) {
            self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[index].workingWindowTimeDTOs.pop();
          }
        }
      }
    };

    self.verifyTime = function(event) {
      let index = event.currentTarget.id;
      const dayIndex = index.substring(index.length - 3, index.length - 2);

      index = index.substring(index.length - 1, index.length);

      const startTime = self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[dayIndex].workingWindowTimeDTOs()[index].startTime(),
        endTime = self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[dayIndex].workingWindowTimeDTOs()[index].endTime();

      if (endTime !== null) {
        if (startTime > endTime) {
          self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[dayIndex].workingWindowTimeDTOs()[index].endTime(startTime);
        }
      }
    };

    self.dateRangeOverlaps = function(a_start, a_end, b_start, b_end) {
      if (a_start <= b_start && b_start <= a_end)
        {return true;}

      if (a_start <= b_end && b_end <= a_end)
        {return true;}

      if (b_start < a_start && a_end < b_end)
        {return true;}

      return false;
    };

    self.timeChangedHandler = function(event) {
      let index = event.currentTarget.id;
      const dayIndex = index.substring(index.length - 3, index.length - 2);

      index = index.substring(index.length - 1, index.length);

      const length = self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[dayIndex].workingWindowTimeDTOs().length;

      for (let i = 0; i < length; i++) {
        const startTime1 = self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[dayIndex].workingWindowTimeDTOs()[i].startTime(),
          endTime1 = self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[dayIndex].workingWindowTimeDTOs()[i].endTime();

        for (let j = i + 1; j < length; j++) {
          const startTime2 = self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[dayIndex].workingWindowTimeDTOs()[j].startTime(),
            endTime2 = self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[dayIndex].workingWindowTimeDTOs()[j].endTime();

          if (startTime2 !== null || endTime2 !== null) {
            if (self.dateRangeOverlaps(startTime1, endTime1, startTime2, endTime2)) {
              self.overalpping(true);
              rootParams.baseModel.showMessages(null, [self.nls.common.overlapMsg], self.nls.common.error);
            } else {
              self.overalpping(false);
            }
          }
        }
      }
    };

    self.deleteRow = function(data, event) {
      const index = event.currentTarget.id,
        dayIndex = index.substring(index.length - 3, index.length - 2);

      self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[dayIndex].workingWindowTimeDTOs.pop();
    };

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

    self.displayTransactions = function() {
      self.showTransactions(false);

      standardWorkWindowModel.getTransactions().done(function(taskData) {
        const tasks = customizeTaskListForDropdown(taskData.taskList);

        self.transactions(tasks);
        self.showDropDown(true);
        self.showDropDownTransactions(true);
        self.showTransactions(true);
      });
    };

    self.displayTransactions();

    self.save = function() {
      const tracker = document.getElementById("tracker");

      if (tracker.valid === "valid") {
        self.standardWindowDetails.workingWindowRoleTaskMapDTOs()[0].taskCode(self.selectedTransaction());

        if (self.childParentTaskMap[self.selectedTransaction() + ""] === "FU_FT" && !(self.standardWindowDetails.processingType() === "REJECT")) {
          rootParams.baseModel.showMessages(null, [self.nls.workingWindow.fileUploadErrorMsg], "INFO");
          self.standardWindowDetails.processingType(null);

          return;
        }

        self.mode("REVIEW");
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };

    self.back = function() {
      history.back();
    };
  };
});