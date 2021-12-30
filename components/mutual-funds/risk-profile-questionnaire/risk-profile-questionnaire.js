define([

  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/mutual-funds-risk-profile",
  "ojs/ojbutton",
  "ojs/ojradioset",
  "ojs/ojlabel"
], function (ko, $, QuestionnaireModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    self.resource = resourceBundle;
    self.groupValid = ko.observable();
    params.dashboard.headerName(self.resource.riskProfileTitle);
    self.options = ko.observable([]);
    self.questionnaireListArray = ko.observableArray([]);
    self.dataLoaded = ko.observable(false);
    self.showCalculateButton = ko.observable(false);
    self.showNextButton = ko.observable(false);
    self.showPrevButton = ko.observable(false);
    self.noOfQuestions = ko.observable();
    self.selectedAnswer = ko.observableArray([]);
    params.baseModel.registerComponent("risk-profile-review", "mutual-funds");
    self.questionsArray = ko.observableArray([]);
    self.questionsList = ko.observableArray([]);

    let i, j, k,

      count = 0;

    self.finalSelection = {
      questionId: null,
      options: [{
        optionId: null
      }]
    };

    let dataArray = [];
    const questionsblock = [];

    self.setAns = function () {
      for (i = 0; i < self.questionnaireListArray().length; i++) {
        self.questionnaireListArray()[i].selectedAnswer = self.questionnaireListArray()[i].options[0].optionId;

        self.questionsArray().push({
          questionId: self.questionnaireListArray()[i].questionId,
          options: [{
            optionId: self.questionnaireListArray()[i].selectedAnswer
          }]
        });
      }
    };

    QuestionnaireModel.getRiskProfileQuestionnaire().done(function (data) {
      dataArray = $.map(data.questionnaire.questions, function (a) {
        return {
          questionId: a.questionId,
          questionDescription: a.questionDescription,
          options: $.map(a.options, function (o) {
            return {
              optionId: o.optionId,
              optionDesc: o.optionDescription
            };
          }),
          selectedAnswer: null
        };
      });

      if ((dataArray.length - count) <= 5) {
        questionsblock.push(dataArray);
        self.showCalculateButton(true);
      } else {
        for (i = count; i < count + 5; i++) {
          questionsblock.push(dataArray[i]);
        }

        self.showNextButton(true);
      }

      self.questionsList(questionsblock);
      self.questionnaireListArray(dataArray);
      self.noOfQuestions(self.questionnaireListArray().length);
      self.setAns();
      self.dataLoaded(true);
      document.getElementsByTagName("ol").item(0).setAttribute("start", parseInt(self.questionsList()[0].questionId));
    });

    self.next = function () {
      self.dataLoaded(false);
      count = count + 5;
      questionsblock.splice(0, questionsblock.length);

      if ((dataArray.length - count) <= 5) {
        for (i = count; i < dataArray.length; i++) {
          questionsblock.push(dataArray[i]);
        }

        self.showPrevButton(true);
        self.showCalculateButton(true);
        self.showNextButton(false);
      } else {
        for (i = count; i < count + 5; i++) {
          questionsblock.push(dataArray[i]);
        }

        self.showNextButton(true);
        self.showPrevButton(true);
        self.showCalculateButton(false);
      }

      self.questionsList(questionsblock);
      ko.tasks.runEarly();
      self.dataLoaded(true);
      document.getElementsByTagName("ol").item(0).setAttribute("start", parseInt(self.questionsList()[0].questionId));
    };

    self.prev = function () {
      self.dataLoaded(false);
      count = count - 5;
      questionsblock.splice(0, questionsblock.length);

      if (count === 0) {
        for (i = count; i < count + 5; i++) {
          questionsblock.push(dataArray[i]);
        }

        self.showNextButton(true);
        self.showPrevButton(false);
        self.showCalculateButton(false);
      } else {
        for (i = count; i < count + 5; i++) {
          questionsblock.push(dataArray[i]);
        }

        self.showNextButton(true);
        self.showPrevButton(true);
        self.showCalculateButton(false);
      }

      self.questionsList(questionsblock);
      ko.tasks.runEarly();
      self.dataLoaded(true);
      document.getElementsByTagName("ol").item(0).setAttribute("start", parseInt(self.questionsList()[0].questionId));
    };

    self.optionChangeHandler = function (event) {
      if (event.detail.value) {
        for (j = 0; j < self.questionnaireListArray().length; j++) {
          for (k = 0; k < self.questionnaireListArray()[j].options.length; k++) {
            if (self.questionnaireListArray()[j].options[k].optionId === event.detail.value) {
              self.finalSelection.questionId = self.questionnaireListArray()[j].questionId;
              self.finalSelection.options[0].optionId = event.detail.value;
            }
          }
        }

        for (i = 0; i < self.questionsArray().length; i++) {
          if (self.questionsArray()[i].questionId === self.finalSelection.questionId) {
            self.questionsArray()[i].options[0].optionId = self.finalSelection.options[0].optionId;
          }
        }
      }
    };

    self.calculateRiskProfile = function () {
      const result = {
        investmentAccountNumber: params.rootModel.params.investmentAccount,
        questions: self.questionsArray()
      };

      QuestionnaireModel.calculateRiskProfiles(ko.toJSON(result)).done(function (data) {
        data.investmentAccount = params.rootModel.params.investmentAccount;

        params.dashboard.loadComponent("risk-profile-review", {
          resultData: data
        });
      });
    };
  };
});
