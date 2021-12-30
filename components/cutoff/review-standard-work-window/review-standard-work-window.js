define([
  "ojs/ojcore",
  "knockout",
      "./model",
  "ojL10n!resources/nls/standard-work-window",
  "ojs/ojinputtext",
  "ojs/ojdatetimepicker",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojcheckboxset",
  "ojs/ojradioset"
], function(oj, ko, ReviewStandardWorkWindowModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;
    let reviewWorkWindowData;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    rootParams.baseModel.registerElement("action-header");
    rootParams.dashboard.headerName(self.nls.pageTitle.title);
    self.displayTemplate = ko.observable(false);
    self.deleteReviewScreen = ko.observable(false);
    self.standardWindowDetails = ko.observable();
    self.processingType = ko.observable();
    self.effectiveDate = ko.observable();
    self.userTypes = ko.observableArray([]);
    self.selectedTransaction = ko.observable();
    self.datasource = {};

    self.getTIme = function(data) {
      const dateForTime = rootParams.baseModel.getDate();

      dateForTime.setHours(data.split(":")[0], data.split(":")[1], 0);

      function pad(n) {
        return n < 10 ? "0" + n : n;
      }

      return "T" + pad(dateForTime.getHours()) + ":" + pad(dateForTime.getMinutes()) + ":" + pad(dateForTime.getSeconds());
    };

    self.compare = function(a, b) {
      if (a.workingWindowDayId < b.workingWindowDayId) {
        return -1;
      }

      if (a.workingWindowDayId > b.workingWindowDayId) {
        return 1;
      }

      return 0;
    };

    if (rootParams.standardWindowDetails) {
      reviewWorkWindowData = rootParams.standardWindowDetails;
    } else if (!self.exception.workingWindowRoleTaskMapDTOs) {
      self.deleteReviewScreen(true);

      ReviewStandardWorkWindowModel.readWW(rootParams.data.workingWindowId()).done(function(data) {
        data.workingWindowDTO.workingWindowRoleTaskMapDTOs[0].workingWindowDayDTOs.sort(self.compare);
        reviewWorkWindowData = ko.mapping.fromJS(data.workingWindowDTO);

        const length = reviewWorkWindowData.workingWindowRoleTaskMapDTOs().length;

        for (let i = 0; i < length; i++) {
          for (let j = 0; j < 7; j++) {
            reviewWorkWindowData.workingWindowRoleTaskMapDTOs()[i].workingWindowDayDTOs()[j].workingWindowTimeDTOs()[0].startTime(self.getTIme(reviewWorkWindowData.workingWindowRoleTaskMapDTOs()[i].workingWindowDayDTOs()[j].workingWindowTimeDTOs()[0].startTime()));
            reviewWorkWindowData.workingWindowRoleTaskMapDTOs()[i].workingWindowDayDTOs()[j].workingWindowTimeDTOs()[0].endTime(self.getTIme(reviewWorkWindowData.workingWindowRoleTaskMapDTOs()[i].workingWindowDayDTOs()[j].workingWindowTimeDTOs()[0].endTime()));

            const stime = reviewWorkWindowData.workingWindowRoleTaskMapDTOs()[i].workingWindowDayDTOs()[j].workingWindowTimeDTOs()[0].startTime(),
              etime = reviewWorkWindowData.workingWindowRoleTaskMapDTOs()[i].workingWindowDayDTOs()[j].workingWindowTimeDTOs()[0].endTime();

            if (stime === "T00:00:00" && etime === "T23:59:00") {
              reviewWorkWindowData.workingWindowRoleTaskMapDTOs()[i].workingWindowDayDTOs()[j].transactionWindow = ko.observable(self.nls.common.OPEN);
            } else if (stime === "T00:00:00" && etime === "T00:00:00") {
              reviewWorkWindowData.workingWindowRoleTaskMapDTOs()[i].workingWindowDayDTOs()[j].transactionWindow = ko.observable(self.nls.common.CLOSED);
            } else {
              reviewWorkWindowData.workingWindowRoleTaskMapDTOs()[i].workingWindowDayDTOs()[j].transactionWindow = ko.observable(self.nls.common.LIMITED);
            }
          }

          self.userTypes.push(reviewWorkWindowData.workingWindowRoleTaskMapDTOs()[i].roleName());
        }

        self.standardWindowDetails(reviewWorkWindowData.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs());
        self.processingType(reviewWorkWindowData.processingType());
        self.effectiveDate(reviewWorkWindowData.effectiveDate());

        if (reviewWorkWindowData.workingWindowRoleTaskMapDTOs()[0].taskCode() === "all") {
          self.selectedTransaction("ALL");
        } else {
          self.selectedTransaction(reviewWorkWindowData.workingWindowRoleTaskMapDTOs()[0].taskCode());

          ReviewStandardWorkWindowModel.fetchTaskName(self.selectedTransaction()).done(function(data) {
            self.selectedTransaction(data.task.name);
          });
        }

        self.datasource = new oj.ArrayTableDataSource(self.standardWindowDetails(), {
          idAttribute: "day"
        });

        self.displayTemplate(true);
      });
    } else {
      reviewWorkWindowData = self.exception;

      const length = reviewWorkWindowData.workingWindowRoleTaskMapDTOs().length;

      for (let i = 0; i < length; i++) {
        for (let j = 0; j < 7; j++) {
          reviewWorkWindowData.workingWindowRoleTaskMapDTOs()[i].workingWindowDayDTOs()[j].workingWindowTimeDTOs()[0].startTime(self.getTIme(reviewWorkWindowData.workingWindowRoleTaskMapDTOs()[i].workingWindowDayDTOs()[j].workingWindowTimeDTOs()[0].startTime()));
          reviewWorkWindowData.workingWindowRoleTaskMapDTOs()[i].workingWindowDayDTOs()[j].workingWindowTimeDTOs()[0].endTime(self.getTIme(reviewWorkWindowData.workingWindowRoleTaskMapDTOs()[i].workingWindowDayDTOs()[j].workingWindowTimeDTOs()[0].endTime()));

          const stime = reviewWorkWindowData.workingWindowRoleTaskMapDTOs()[i].workingWindowDayDTOs()[j].workingWindowTimeDTOs()[0].startTime(),
            etime = reviewWorkWindowData.workingWindowRoleTaskMapDTOs()[i].workingWindowDayDTOs()[j].workingWindowTimeDTOs()[0].endTime();

          if (stime === "T00:00:00" && etime === "T23:59:00") {
            reviewWorkWindowData.workingWindowRoleTaskMapDTOs()[i].workingWindowDayDTOs()[j].transactionWindow = ko.observable(self.nls.common.OPEN);
          } else if (stime === "T00:00:00" && etime === "T00:00:00") {
            reviewWorkWindowData.workingWindowRoleTaskMapDTOs()[i].workingWindowDayDTOs()[j].transactionWindow = ko.observable(self.nls.common.CLOSED);
          } else {
            reviewWorkWindowData.workingWindowRoleTaskMapDTOs()[i].workingWindowDayDTOs()[j].transactionWindow = ko.observable(self.nls.common.LIMITED);
          }
        }

        self.userTypes.push(reviewWorkWindowData.workingWindowRoleTaskMapDTOs()[i].roleName());
      }

      if (reviewWorkWindowData.workingWindowRoleTaskMapDTOs()[0].taskCode() === "all") {
        self.selectedTransaction("ALL");
      } else {
        self.selectedTransaction(reviewWorkWindowData.workingWindowRoleTaskMapDTOs()[0].taskCode());

        ReviewStandardWorkWindowModel.fetchTaskName(self.selectedTransaction()).done(function(data) {
          self.selectedTransaction(data.task.name);
        });
      }
    }

    self.disabledState = ko.observable(true);
    self.showTable = ko.observable(false);

    const getNewKoModel = function() {
      const KoModel = ReviewStandardWorkWindowModel.getNewModel();

      return ko.mapping.fromJS(KoModel);
    };

    self.secondConverter = ko.observable(oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({
      hour: "2-digit",
      hour12: false,
      minute: "2-digit"
    }));

    self.tableObject = ko.observableArray([]);
    self.rootModelInstance = ko.observable(getNewKoModel());
    self.payload = self.rootModelInstance().WorkingWindow;

    if (!self.deleteReviewScreen()) {
      self.standardWindowDetails(reviewWorkWindowData.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs());
      self.processingType(reviewWorkWindowData.processingType());
      self.effectiveDate(reviewWorkWindowData.effectiveDate());
      self.selectedTransaction(reviewWorkWindowData.workingWindowRoleTaskMapDTOs()[0].taskCode());
    }

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

    if (rootParams.rootModel.userType) {
      self.userTypes(rootParams.rootModel.userType());
    }

    self.userTypeOptions = ko.observableArray();
    self.showDropDownuserTypeOptions = ko.observable(false);
    self.showuserTypeList = ko.observable(false);
    self.showuserTypeOptions = ko.observable(false);

    if (rootParams.rootModel.selectedTransaction) {
      if (rootParams.rootModel.selectedTransaction() === "all") {
        self.selectedTransaction("ALL");
      } else {
        self.selectedTransaction(rootParams.rootModel.selectedTransaction().split("~")[1]);
      }
    }

    self.displayUserTypeData = function() {
      ReviewStandardWorkWindowModel.fetchUserType().done(function(taskData) {
        self.showuserTypeOptions(false);

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

        if (rootParams.rootModel.userType) {
          self.userTypes(rootParams.rootModel.userType());
        }

        self.showuserTypeOptions(true);
        self.showuserTypeList(true);
      });
    };

    self.displayUserTypeData();

    if (!self.deleteReviewScreen()) {
      self.datasource = new oj.ArrayTableDataSource(self.standardWindowDetails(), {
        idAttribute: "day"
      });
    }

    self.edit = function() {
      self.mode("CREATE");
    };

    self.getTime = function(time) {
      return time.substring(1, 6);
    };

    self.confirm = function() {
      let taskcode;

      if (self.selectedTransaction()) {
        if (self.selectedTransaction() === "ALL") {
          taskcode = "ALL";
        } else {
          taskcode = rootParams.rootModel.selectedTransaction().split("~")[0];
        }
      }

      self.payload.effectiveDate(self.effectiveDate());
      self.payload.processingType(self.processingType());

      for (let i = 0; i < self.userTypes().length; i++) {
        self.payloadObject = {
          roleName: null,
          taskCode: null,
          workingWindowDayDTOs: [{
              day: "MON",
              workingWindowTimeDTOs: []
            },
            {
              day: "TUE",
              workingWindowTimeDTOs: []
            },
            {
              day: "WED",
              workingWindowTimeDTOs: []
            },
            {
              day: "THU",
              workingWindowTimeDTOs: []
            },
            {
              day: "FRI",
              workingWindowTimeDTOs: []
            },
            {
              day: "SAT",
              workingWindowTimeDTOs: []
            },
            {
              day: "SUN",
              workingWindowTimeDTOs: []
            }
          ]
        };

        self.payloadObject.roleName = self.userTypes()[i];
        self.payloadObject.taskCode = taskcode;

        for (let j = 0; j < 7; j++) {
          for (let k = 0; k < self.standardWindowDetails()[j].workingWindowTimeDTOs().length; k++) {
            self.timeObject = {
              startTime: null,
              endTime: null
            };

            self.timeObject.startTime = self.getTime(self.standardWindowDetails()[j].workingWindowTimeDTOs()[k].startTime());
            self.timeObject.endTime = self.getTime(self.standardWindowDetails()[j].workingWindowTimeDTOs()[k].endTime());
            self.payloadObject.workingWindowDayDTOs[j].workingWindowTimeDTOs.push(self.timeObject);
          }
        }

        self.payload.workingWindowRoleTaskMapDTOs.push(self.payloadObject);
      }

      const payload = ko.toJSON(self.payload);

      if (self.prevMode() === "EDIT") {
        const workWindowId = self.editWorkWindowId();

        ReviewStandardWorkWindowModel.editStandardWorkWindow(workWindowId, payload).done(function(data, status, jqXhr) {
          self.transactionName(self.nls.pageTitle.title);

          rootParams.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.transactionName()
          }, self);
        });
      } else {
        ReviewStandardWorkWindowModel.createStandardWorkWindow(payload).done(function(data, status, jqXhr) {
          self.transactionName(self.nls.pageTitle.title);

          rootParams.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.transactionName()
          }, self);
        });
      }
    };

    if (!self.deleteReviewScreen()) {
      self.displayTemplate(true);
    }
  };
});