define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/authentication",
  "ojs/ojselectcombobox",
  "ojs/ojknockout-validation",
  "ojs/ojarraytabledatasource",
  "ojs/ojtable"
], function (oj, ko, $, viewAuthenticationMaintenanceModel, ResourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = ResourceBundle;
    rootParams.dashboard.headerName(self.nls.authentication.headers.authentication);
    self.userSegmentsLoaded = ko.observable(false);
    rootParams.baseModel.registerComponent("create-authentication-maintenance", "authentication");

    self.back = function () {
      history.back();
    };

    let dataFetched = null;

    self.userSegmentsList = ko.observableArray();
    self.selectedSegmentId = ko.observable(self.params.selectedSegmentId);
    self.selectedEntityId = self.params.selectedEntityValue ? self.params.selectedEntityId : "ROLE";
    self.selectedEntityValue = self.params.selectedEntityValue ? self.params.selectedEntityValue : self.selectedSegmentId();
    self.selectedSegmentName = ko.observable(self.nls.authentication.labels[self.selectedSegmentId()]);
    self.showApprovalsTable = ko.observable(false);
    self.showTransactionsTable = ko.observable(false);
    self.showCreateScreen = ko.observable(false);
    self.taskIdMap = {};
    self.actionHeaderheading = ko.observable(self.nls.authentication.headers.VIEW);
    self.showMaintenanceData = self.showMaintenanceData || ko.observable(false);
    self.editFlag = ko.observable("none");
    self.rowTemplateValue = ko.observable("editRowTemplate");
    self.datasource = self.datasource || ko.observable();

    let maintenanceData = null,
      i = 0;

    self.openCreateMode = function () {
      rootParams.dashboard.loadComponent("create-authentication-maintenance", {
        selectedSegmentId: self.selectedSegmentId(),
        selectedEntityId: self.selectedEntityId,
        selectedEntityValue: self.selectedEntityValue,
        mode: "CREATE",
        dataFetched: null
      }, self);
    };

    self.showEditScreen = function () {
      rootParams.dashboard.loadComponent("create-authentication-maintenance", {
        selectedSegmentId: self.selectedSegmentId(),
        selectedEntityId: self.selectedEntityId,
        selectedEntityValue: self.selectedEntityValue,
        mode: "EDIT",
        dataFetched: maintenanceData.authenticationMaintenanceDTOs[0]
      }, self);
    };

    const createDataSource = function (data) {
      self.showMaintenanceData(false);

      dataFetched = $.map(data.authenticationMaintenanceDTOs[0].mappings, function (dataPerTransaction) {
        dataPerTransaction.transactionName = dataPerTransaction.dictionaryArray[0].nameValuePairDTOArray[0].value;

        if (!(dataPerTransaction.authenticationInfoDTOList && dataPerTransaction.authenticationInfoDTOList.length > 0)) {
          dataPerTransaction.authenticationInfoDTOList = [{
              authType: {
                authTypeKey: "None"
              },
              levelNumber: 1,
              paramVal1: 0
            },
            {
              authType: {
                authTypeKey: "None"
              },
              levelNumber: 2,
              paramVal1: 0
            }
          ];
        } else if (dataPerTransaction.authenticationInfoDTOList && dataPerTransaction.authenticationInfoDTOList.length === 1) {
          dataPerTransaction.authenticationInfoDTOList.push({
            authType: {
              authTypeKey: "None"
            },
            levelNumber: 2,
            paramVal1: 0
          });
        }

        return dataPerTransaction;
      });

      const mappingsData = data;
      let taskTypeAdmin = null,
      taskTypeCommon = null;

      if (self.selectedSegmentId() === "administrator") {
        taskTypeAdmin = "ADMINISTRATION";
        taskTypeCommon = "COMMON";
      }

      Promise.all([ viewAuthenticationMaintenanceModel.fetchTransactionsForMaintenance(taskTypeAdmin), viewAuthenticationMaintenanceModel.fetchTransactionsForMaintenance(taskTypeCommon)])
      .then(function (response) {
        let data = response[0].taskList;

        if(self.selectedSegmentId() === "administrator"){
          data = response[0].taskList.concat(response[1].taskList);
        }

        if (self.selectedSegmentId() !== "administrator") {
          for (i = data.length - 1; i >= 0; i--) {
            if (data[i].type === "ADMINISTRATION") {
              data.splice(i, 1);
            }
          }
        }

        for (i = 0; i < data.length; i++) {
          if (!self.taskIdMap[data[i].id]) {
            dataFetched.push({
              task: data[i].id,
              transactionName: data[i].name,
              authenticationInfoDTOList: [{
                  levelNumber: 1,
                  authType: {
                    authTypeKey: "None"
                  },
                  paramVal1: 0
                },
                {
                  levelNumber: 2,
                  authType: {
                    authTypeKey: "None"
                  },
                  paramVal1: 0
                }
              ]
            });
          }
        }

        mappingsData.authenticationMaintenanceDTOs[0].mappings = dataFetched;
        maintenanceData = mappingsData;

        self.datasource = new oj.ArrayTableDataSource(maintenanceData.authenticationMaintenanceDTOs[0].mappings, {
          idAttribute: "task"
        });

        self.showMaintenanceData(true);
      });
    };

    viewAuthenticationMaintenanceModel.fetchSegementAuthenticationMaintenance(self.selectedEntityId, self.selectedEntityValue).done(function (data) {
      if (data && data.authenticationMaintenanceDTOs && data.authenticationMaintenanceDTOs[0] && data.authenticationMaintenanceDTOs[0].mappings && data.authenticationMaintenanceDTOs[0].mappings.length > 0) {
        for (i = 0; i < data.authenticationMaintenanceDTOs[0].mappings.length; i++) {
          self.taskIdMap[data.authenticationMaintenanceDTOs[0].mappings[i].task] = data.authenticationMaintenanceDTOs[0].mappings[i];
        }

        createDataSource(data);
      } else {
        self.showCreateScreen(true);
        self.showMaintenanceData(true);
      }
    });
  };
});