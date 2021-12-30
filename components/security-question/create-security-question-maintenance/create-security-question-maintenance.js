define([

  "knockout",

  "./model",
  "ojL10n!resources/nls/security-question",
  "ojs/ojselectcombobox",
  "ojs/ojknockout-validation",
  "ojs/ojpagingcontrol",
  "ojs/ojknockout",
  "ojs/ojinputtext",
  "ojs/ojvalidationgroup"
], function (ko, CreateSecurityQuestionModel, ResourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.taxonomyDefinition = rootParams.dashboard.getTaxonomyDefinition("com.ofss.digx.app.security.dto.authentication.securityquestion.SecurityQuestionDTO");
    self.nls = ResourceBundle;

    self.back = function () {
      history.back();
    };

    self.actionHeaderheading = ko.observable(self.nls.securityQuestion.headers.CREATE);
    self.createSuccess = ko.observable(false);
    self.validationTracker = ko.observable();
    rootParams.baseModel.registerComponent("review-security-question-maintenance", "security-question");

    const getNewKoModel = function () {
      if (!self.createSecQueModel) {
        const KoModel = CreateSecurityQuestionModel.getNewModel();

        return ko.mapping.fromJS(KoModel);
      }

      return self.createSecQueModel;
    };

    self.questionNumber = function (index) {
      return index + 1;
    };

    if (!self.createSecQueModel) {
      self.createSecQueModel = getNewKoModel();
      self.createSecQueModel.createSecurityQuestionPayload.secQueMapping.removeAll();

      self.createSecQueModel.createSecurityQuestionPayload.secQueMapping.push({
        question: ko.observable(),
        languageId: "en_US"
      });
    }

    self.addQuestion = function () {
      self.createSecQueModel.createSecurityQuestionPayload.secQueMapping.push({
        question: ko.observable(),
        languageId: "en_US"
      });
    };

    self.deleteQuestion = function (index) {
      self.createSecQueModel.createSecurityQuestionPayload.secQueMapping.splice(index, 1);
    };

    self.isSecQueMappingEmpty = function () {
      if (self.createSecQueModel.createSecurityQuestionPayload.secQueMapping().length === 0) {
        return true;
      }

      return false;
    };

    self.save = function () {
      if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("TaskValidater"))) {
        return;
      }

      if (self.isSecQueMappingEmpty()) {
        rootParams.baseModel.showMessages(null, [self.nls.securityQuestion.messages.questionsNotEntered], "ERROR");

        return;
      }

      const payload = self.createSecQueModel.createSecurityQuestionPayload,

        context = {};

      context.payload = payload;
      context.mode = "CREATE";
      rootParams.dashboard.loadComponent("review-security-question-maintenance", context);
    };
  };
});