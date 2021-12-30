define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/security-question",
  "ojs/ojselectcombobox",
  "ojs/ojknockout-validation",
  "ojs/ojarraytabledatasource",
  "ojs/ojtable"
], function (oj, ko, ViewSecQueMntModel, ResourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = ResourceBundle;
    rootParams.dashboard.headerName(self.nls.securityQuestion.headers.securityQuestion);
    rootParams.baseModel.registerComponent("update-security-question-maintenance", "security-question");
    self.questionsList = ko.observable();

    self.back = function () {
      history.back();
    };

    self.datasource = ko.observableArray();
    self.showCreateScreen = ko.observable(true);
    self.securityQuestionLoaded = ko.observable(false);
    self.actionHeaderheading = ko.observable(self.nls.securityQuestion.headers.VIEW);
    rootParams.baseModel.registerComponent("create-security-question-maintenance", "security-question");

    self.createMaintenance = function () {
      rootParams.dashboard.loadComponent("create-security-question-maintenance", {});
    };

    self.maintenanceId = null;
    self.version = null;

    ViewSecQueMntModel.fetchTransactionsForMaintenance("").done(function (data) {
      if (Object.keys(data).length !== 0) {
        self.questionsList(data.secQueList[0].secQueMapping);
        self.maintenanceId = data.secQueList[0].id;
        self.version = data.secQueList[0].version;

        const array = data.secQueList[0].secQueMapping;

        self.datasource(new oj.ArrayTableDataSource(array, {
          idAttribute: "questionId"
        }) || []);

        self.showCreateScreen(false);
      }

      self.securityQuestionLoaded(true);
    });

    self.loadEditComponent = function () {
      const context = {};

      context.questionsList = self.questionsList();
      context.maintenanceId = self.maintenanceId;
      context.version = self.version;
      rootParams.dashboard.loadComponent("update-security-question-maintenance", context);
    };
  };
});