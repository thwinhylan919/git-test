define([
  "ojs/ojcore",
  "knockout",

  "./model",
  "ojL10n!resources/nls/system-rules",
  "ojs/ojbutton",
  "ojs/ojknockout"
], function (oj, ko, ReviewSystemRulesModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    self.mode = ko.observable();
    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    params.dashboard.headerName();
    params.baseModel.registerElement("confirm-screen");
    params.baseModel.registerComponent("system-rules-map", "system-rules");
    self.entityArray = ko.observableArray();
    self.limitArray = ko.observableArray();
    self.isLoaded = ko.observable(false);
    self.reviewLoginConfigTableList = ko.observableArray();
    self.reviewLoginConfigTableList([]);
    self.loginFlowPreferenceValue = ko.observable();
    self.validationTracker = ko.observable();

    for (let i = 0; i < self.params.loginConfigTableList().length; i++) {
      if (self.params.loginConfigTableList()[i].enabled()[0] === "true") {

        self.reviewLoginConfigTableList.push(self.params.loginConfigTableList()[i]);
      }
    }

    self.reviewStatusDatasource = new oj.ArrayTableDataSource(self.reviewLoginConfigTableList(), {
      idAttribute: "id"
    });

    self.test = ko.toJSON(self.loginConfigPayload);

    if (params.mode || params.loginmode) {
      self.mode(params.mode || params.loginmode);
    } else if (self.params.mode || self.params.loginmode) {
      self.mode(self.params.mode || self.params.loginmode);
    }

    if (self.params.entityLimitPackageMapArray()) {
      for (let i = 0; i < self.params.entityLimitPackageMapArray().length; i++) {
        self.entityArray()[i] = self.params.entityLimitPackageMapArray()[i].entityName;
      }
    }

    for (let x = 0; x < self.entityArray().length; x++) {
      for (let y = 0; y < self.params.entityLimitPackageMapArray().length; y++) {
        if (self.entityArray()[x] === self.params.entityLimitPackageMapArray()[y].entityName) {
          self.limitArray.push({
            id: x,
            name: self.entityArray()[x],
            packages: []
          });

          for (let z = 0; z < self.params.entityLimitPackageMapArray()[y].limitPackageDetails().length; z++) {
            if (self.params.entityLimitPackageMapArray()[y].limitPackageDetails()[z].selectedLimitPackage()) {
              self.limitArray()[x].packages.push({
                value: self.params.entityLimitPackageMapArray()[y].limitPackageDetails()[z].selectedLimitPackage(),
                description: self.params.entityLimitPackageMapArray()[y].limitPackageDetails()[z].description
              });
            }
          }
        }
      }
    }

    self.createRolePreference = function () {

      if (!params.baseModel.showComponentValidationErrors(self.validationTracker())) {
        for (let x = 0; x < self.params.entityLimitPackageMapArray().length; x++) {
          if (self.params.entityLimitPackageMapArray()[x].packageId().toString() === "") {
            params.baseModel.showMessages(null, [self.resource.rolePreferences.limitPackageSelectionError], "ERROR");
            break;
          }
        }

        return;
      }

      if (self.params.selectedRole()) {
        if (self.params.showLimitPackageSearchSection()) {
          ReviewSystemRulesModel.setLimitPackages(ko.toJSON(self.params.limitPackagePayload), self.params.selectedRole()).done(function (data) {
            if (data.status.message.type === "INFO") {
              self.fireCreateRolePreference();
            }
          });
        } else {
          self.fireCreateRolePreference();
        }
      }
    };

    self.fireCreateRolePreference = function () {
      ReviewSystemRulesModel.createRolePreference(self.params.selectedRole(), ko.toJSON(self.params.payload), self.createRolePreferenceSuccesshandler).then(function (data) {
        if (data.status.message.type !== "INFO") {
          const error = new Error(self.resource.failedMessage);

          throw error;
        } else {
          self.createLoginConfigFlow();
          self.httpStatus = data.getResponseStatus();

          params.dashboard.loadComponent("confirm-screen", {
            transactionResponse: data,
            transactionName: self.resource.rolePreferences.updateSuccess
          });
        }
      });
    };

    self.createLoginConfigFlow = function () {
      for (let i = 0; i < self.params.preferencesList().length; i++) {
        if (self.params.preferencesList()[i].preferenceId === "LOGIN_FLOW_REQUIRED") {
          self.loginFlowPreferenceValue(self.params.preferencesList()[i].value);

        }
      }

      if (self.loginFlowPreferenceValue() === true) {
        if (self.params.loginConfigCurrentList().length !== 0) {
          ReviewSystemRulesModel.setLoginConfigUpdate(ko.toJSON(self.params.loginConfigPayload), self.params.selectedRole()).done(function (data) {
            if (data.status.message.type !== "INFO") {
              const errorLoginConfig = new Error(self.resource.loginFlowFailedMessage);

              throw errorLoginConfig;
            }
          });
        } else {
          ReviewSystemRulesModel.fireBatch({
            batchDetailRequestList: self.params.batchPayload()
          }).done(function (data) {
            if (data.status.message.type !== "INFO") {
              const errorLoginConfig = new Error(self.resource.loginFlowFailedMessage);

              throw errorLoginConfig;
            }
          });
        }
      }
    };

    self.editAll = function () {
      const context = {};

      context.mode = "EDIT";
      context.payload = ko.mapping.toJS(self.params.payload);
      context.loginConfigPayload = ko.mapping.toJS(self.params.loginConfigPayload);
      context.showLimitPackageSearchSection = self.params.showLimitPackageSearchSection;
      context.limitPackageDataLoaded = self.params.limitPackageDataLoaded;
      context.entityLimitPackageMapArray = self.params.entityLimitPackageMapArray;
      context.isInitialScreenLoaded = self.params.isInitialScreenLoaded;
      context.preferencesList = self.params.preferencesList;
      context.limitArray = self.params.limitArray;
      context.isEnterpriseRoleSelected = self.params.isEnterpriseRoleSelected;
      context.showLoginConfigSelectOptions = self.params.showLoginConfigSelectOptions;
      context.showTable = self.params.showTable;
      context.loginConfigTableList = self.params.loginConfigTableList;
      context.loginConfigCurrentList = self.params.loginConfigCurrentList;
      context.loginConfigList = self.params.loginConfigList;
      context.statusDatasource = self.params.statusDatasource;
      context.limitPackagePayload = self.params.limitPackagePayload;
      context.batchPayload = self.params.batchPayload;
      params.dashboard.loadComponent("system-rules-map", context);
    };
  };
});