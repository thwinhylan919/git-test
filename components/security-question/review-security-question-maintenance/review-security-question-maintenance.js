define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/security-question",
  "ojs/ojselectcombobox",
  "ojs/ojknockout-validation",
  "ojs/ojpagingcontrol",
  "ojs/ojknockout", "ojs/ojarraytabledatasource",
  "ojs/ojtable"
], function (oj, ko, ReviewSecurityQuestionModel, ResourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = ResourceBundle;
    rootParams.dashboard.headerName(self.nls.securityQuestion.headers.securityQuestion);
    self.buttonFlag = ko.observable(true);
    self.validationTracker = ko.observable();
    self.payload = self.params.payload ? self.params.payload : self.params.data;

    if (self.params.mode === "UPDATE" || self.params.mode === "approval") {
      self.maintenanceId = self.params.maintenanceId !== undefined ? self.params.maintenanceId : self.params.data.secQueMapping[0].maintenanceId;
    }

    self.back = function () {
      history.back();
    };

    self.datasource = ko.observableArray();

    self.reviewTransactionMessage = {
      header: self.nls.securityQuestion.messages.reviewHeader,
      reviewHeader: self.nls.securityQuestion.messages.reviewHeader1
    };

    rootParams.baseModel.registerElement("confirm-screen");
    self.actionHeaderheading = ko.observable(self.nls.securityQuestion.headers.REVIEW);

    const array = [];

    if (self.transactionDetails && self.transactionDetails().transactionSnapshot) {
      self.buttonFlag(false);
    }

    for (let i = 0; i < self.payload.secQueMapping.length; i++) {
      array.push({
        question: self.payload.secQueMapping[i].question
      });
    }

    self.datasource(new oj.ArrayTableDataSource(array, {
      idAttribute: "question"
    }) || []);

    self.save = function () {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }

      if (self.params.mode === "CREATE" || self.params.mode === "approval") {
        ReviewSecurityQuestionModel.createSecurityQuestion(ko.mapping.toJSON(self.payload)).then(function (data) {
          self.httpStatus = data.getResponseStatus();

          rootParams.dashboard.loadComponent("confirm-screen", {
            transactionResponse: data,
            transactionName: self.nls.securityQuestion.labels.maintenance
          });
        });
      }

      if (self.params.mode === "UPDATE" || self.params.mode === "approval") {
        ReviewSecurityQuestionModel.updateSecurityQuestion(ko.mapping.toJSON(self.payload), self.params.maintenanceId).then(function (data) {
          self.httpStatus = data.getResponseStatus();

          rootParams.dashboard.loadComponent("confirm-screen", {
            transactionResponse: data,
            transactionName: self.nls.securityQuestion.labels.maintenance
          });
        });
      }
    };
  };
});