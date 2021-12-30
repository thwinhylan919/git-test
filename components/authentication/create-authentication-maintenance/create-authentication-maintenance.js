define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/authentication",
  "ojs/ojselectcombobox",
  "ojs/ojknockout-validation",
  "ojs/ojpagingcontrol",
  "ojs/ojknockout",
  "ojs/ojnavigationlist",
  "ojs/ojarraytabledatasource",
  "ojs/ojtable"
], function(oj, ko, $, createAuthenticationMaintenanceModel, ResourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = ResourceBundle;
    rootParams.dashboard.headerName(self.nls.authentication.headers.authentication);
    self.mode = ko.observable(self.params.mode);
    self.showDropDown = ko.observable(false);
    self.challengeList = ko.observableArray();
    rootParams.baseModel.registerComponent("confirm-authentication-maintenance", "authentication");
    self.challengeSelected = ko.observable();
    self.userSegmentsList = ko.observableArray();
    self.selectedSegmentName = ko.observable(self.nls.authentication.labels[self.params.selectedSegmentId]);
    self.showApprovalsTable = ko.observable(false);
    self.showTransactionsTable = ko.observable(false);
    self.showMaintenanceData = ko.observable(false);
    self.selectedSegmentId = ko.observable();
    self.validationTracker = ko.observable();
    self.actionHeaderheading = ko.observable(self.nls.authentication.headers[self.mode()]);
    self.editFlag = ko.observable("none");
    self.rowTemplateValue = ko.observable("editRowTemplate");
    self.datasource = null;
    self.challengeSelectedObservableArray = ko.observableArray();

    let i = 0;

    createAuthenticationMaintenanceModel.fetchChallenges(self.params.selectedSegmentId).done(function(data) {
      self.challengeList(data.authenticationTypeDTOs);

      const addingNoneAsChallenge = {
        authTypeKey: "None",
        name: "None"
      };

      self.challengeList.splice(0, 0, addingNoneAsChallenge);
      self.showDropDown(true);
    });

    self.itemNumber = function(index) {
      return index + 1;
    };

    self.optionChangedHandler = function(index) {
      document.getElementById("table").refreshRow(index);
    };

    const createDataSource = function(data) {
      self.showMaintenanceData(false);

      const addingLevels = $.map(data.mappings, function(dataPerTransaction) {
        if (dataPerTransaction.dictionaryArray) {
          dataPerTransaction.transactionName = dataPerTransaction.dictionaryArray[0].nameValuePairDTOArray[0].value;
        }

        dataPerTransaction.entity = {
          key: {
            value: self.params.selectedEntityValue,
            type: self.params.selectedEntityId
          }
        };

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
        } else {
          $.map(dataPerTransaction.authenticationInfoDTOList, function(levelPerTransaction) {
            levelPerTransaction.paramVal1 = levelPerTransaction.paramVal1 || 0;

            return levelPerTransaction;
          });
        }

        return dataPerTransaction;
      });

      data.mappings = addingLevels;
      self.challengeSelectedObservableArray(data);

      self.datasource = new oj.ArrayTableDataSource(self.challengeSelectedObservableArray().mappings, {
        idAttribute: "task"
      });

      self.showMaintenanceData(true);
    };

    if (self.mode() === "CREATE") {
      let taskTypeAdmin = null,
      taskTypeCommon = null;

      if (self.params.selectedSegmentId === "administrator") {
        taskTypeAdmin = "ADMINISTRATION";
        taskTypeCommon = "COMMON";
      }

       Promise.all([ createAuthenticationMaintenanceModel.fetchTransactionsForMaintenance(taskTypeAdmin), createAuthenticationMaintenanceModel.fetchTransactionsForMaintenance(taskTypeCommon)])
        .then(function (response) {
          let data = response[0].taskList;

          const jsonForCreation = {
            mappings: []
          };

          if(self.params.selectedSegmentId === "administrator"){
            data = response[0].taskList.concat(response[1].taskList);
          }

        for (i = 0; i < data.length; i++) {
          jsonForCreation.mappings.push({
            task: data[i].id,
            transactionName: data[i].name,
            entity: {
              key: {
                value: self.params.selectedEntityValue,
                type: self.params.selectedEntityId
              }
            },
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

        createDataSource(jsonForCreation);
      });
    } else if (self.mode() === "EDIT") {
      createDataSource(self.params.dataFetched);
    }

    self.applyToAll = function() {
      for (i = 1; i < self.challengeSelectedObservableArray().mappings.length; i++) {
        self.challengeSelectedObservableArray().mappings[i].authenticationInfoDTOList[0].authType.authTypeKey = self.challengeSelectedObservableArray().mappings[0].authenticationInfoDTOList[0].authType.authTypeKey;
        self.challengeSelectedObservableArray().mappings[i].authenticationInfoDTOList[0].paramVal1 = self.challengeSelectedObservableArray().mappings[0].authenticationInfoDTOList[0].paramVal1;
        self.challengeSelectedObservableArray().mappings[i].authenticationInfoDTOList[1].authType.authTypeKey = self.challengeSelectedObservableArray().mappings[0].authenticationInfoDTOList[1].authType.authTypeKey;
        self.challengeSelectedObservableArray().mappings[i].authenticationInfoDTOList[1].paramVal1 = self.challengeSelectedObservableArray().mappings[0].authenticationInfoDTOList[1].paramVal1;
      }

      createDataSource(self.challengeSelectedObservableArray());
      document.getElementById("table").refresh();
    };

    self.save = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }

      for (i = 0; i < self.challengeSelectedObservableArray().mappings.length; i++) {
        if (self.challengeSelectedObservableArray().mappings[i].authenticationInfoDTOList[1].authType.authTypeKey !== "None" && self.challengeSelectedObservableArray().mappings[i].authenticationInfoDTOList[0].authType.authTypeKey === "None") {
          rootParams.baseModel.showMessages(null, [self.nls.authentication.labels.level1Null], "ERROR");

          return;
        }
      }

      rootParams.dashboard.loadComponent("confirm-authentication-maintenance", {
        challenges: self.challengeSelectedObservableArray(),
        mode: self.mode(),
        selectedSegmentId: self.params.selectedSegmentId,
        selectedEntityId: self.params.selectedEntityId,
        selectedEntityValue: self.params.selectedEntityValue
      }, self);
    };
  };
});
