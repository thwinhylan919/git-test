define([

  "knockout",

  "./model",
  "ojL10n!resources/nls/feedback",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojknockout-validation",
  "ojs/ojvalidationgroup",
  "ojs/ojselectcombobox"
], function(ko, FeedbackModel, resourceBundle) {
  "use strict";

  /**
   * File contains the view model for listing questions and options realated to db table
   *
   * @property {Boolean}  showAddQuestionInput        - flag is used to refresh the pagination component whenever user want to add another question.
   * @property {Array}    question          - Array that maintains the list of questions fetched from the server
   *                                            and loops over it to display on UI.
   * @property {Array}    option - Array that maintains the list of options respect to questions fetched from the server
   *                                            and loops over it to display on UI.
   * @property {Boolean}  questionLoaded       - Initially this flag is set to false until data is fetched from server
   *                                            and ready to display on UI
   * @property {String}  newOptionValue       - That string strore the new option value
   *
   * @property {Array}  optionValue       - That Array strore the new option value
   *
   * @property {Array}  newOptionsRequestList       - That Array strore the new option value
   *
   * @property {Array}  newQuestions       - That Array strore the new question value
   * @property {Array}  optionList       - That Array strore the new option list
   * @property {Boolean}  optionListLoaded       - flag is used to refresh the pagination component whenever user want to list option.
   */
  /**
   * Return function - description.
   *
   * @param  {Object} params - Parent context.
   * @return {void}
   */
  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    self.questionLoaded = ko.observable(false);
    self.showAddQuestionInput = ko.observable(false);
    self.newQuestionsValue = ko.observable("");
    self.newOptionValue = ko.observable("");
    self.newOptionsRequestList = ko.observableArray([]);
    self.newQuestions = ko.observable([]);
    self.optionList = ko.observable([]);
    self.question = ko.observable([]);
    self.maxOptionId = 0;
    self.optionListLoaded = ko.observable(false);
    self.disableInputsQuestion = ko.observable(false);
    self.groupValid = ko.observable();
    self.hideTemplateInfo = ko.observable();
    self.disableInputsGlobal = ko.observable();

    self.addAnotherQuestion = function() {
      if (self.newQuestionsValue().trim().length > 0) {
        self.showAddQuestionInput(false);

        const questionObj = {
          questionId: self.question().length + 1,
          questionDescription: self.newQuestionsValue(),
          optionsRequestList: ko.observableArray([]),
          extraOptionRequestList: ko.observableArray([])
        };

        self.newQuestions().push(questionObj);
        self.newQuestionsValue("");
        ko.tasks.runEarly();
        self.showAddQuestionInput(true);
      }
    };

    self.deleteAddNewQuestion = function(data) {
      self.showAddQuestionInput(false);
      self.newQuestions().splice(data, 1);
      ko.tasks.runEarly();
      self.showAddQuestionInput(true);
    };

    const getPayload = function() {
      const payload = [];

      for (let i = 0; i < self.question().length; i++) {
        let tempOption = null,
          optionsRequestList = [];

        optionsRequestList = JSON.parse(JSON.stringify(self.question()[i].optionsRequestList));

        if (self.question()[i].extraOptionRequestList) {
          for (let j = 0; j < self.question()[i].extraOptionRequestList().length; j++) {
            tempOption = ko.utils.arrayFilter(self.optionList(), function(option) {
              if (option.optionDescription === self.question()[i].extraOptionRequestList()[j]) {
                return option;
              }
            });

            if (tempOption[0]) {
              optionsRequestList.push({
                optionId: tempOption[0].optionId,
                optionDescription: tempOption[0].optionDescription
              });
            } else {
              optionsRequestList.push({
                optionId: self.maxOptionId + 1,
                optionDescription: self.question()[i].extraOptionRequestList()[j]
              });
            }
          }
        }

        payload.push({
          questionId: self.question()[i].questionId,
          questionDescription: self.question()[i].questionDescription,
          version: self.question()[i].version,
          flag: self.question()[i].flag,
          optionsRequestList: optionsRequestList
        });
      }

      return payload;
    };

    FeedbackModel.getFeedbackOptionList().done(function(data) {
      if (data.optionResponseList) {
        self.optionList(data.optionResponseList);
        self.maxOptionId = parseInt(self.optionList()[0].optionId);

        for (let k = 1; k < self.optionList().length; k++) {
          if (parseInt(self.optionList()[k].optionId) > self.maxOptionId) {
            self.maxOptionId = parseInt(self.optionList()[k].optionId);
          }
        }

        self.optionListLoaded(true);
      }
    });

    FeedbackModel.getFeedbackQuestion().done(function(data) {
      if (data.questionResponseList) {
        self.question(data.questionResponseList);

        self.question().forEach(function(question) {
          question.flag = question.flag ? question.flag : null;

          question.optionsRequestList.forEach(function(option) {
            if (!option.optionDescription) {
              option.optionDescription = "";
            }
          });
        });

        if (self.hideTemplateInfo() || self.reviewTemplate()) {
          self.disableInputsGlobal(true);
          self.disableInputsQuestion(true);

          if (self.fromReview && self.fromReview()) {
            self.disableInputsQuestion(false);
          }
        }

        for (let i = 0; i < self.question().length; i++) {
          self.question()[i].extraOptionRequestList = ko.observableArray([]);
        }

        self.questionLoaded(true);
      }
    });

    self.addQuestion = function() {
      const tracker = document.getElementById("tracker");

      if (tracker && tracker.valid === "valid") {
        self.newQuestions().forEach(function(obj) {
          self.question().push({
            questionId: self.question().length + 1,
            questionDescription: obj.questionDescription,
            optionsRequestList: [],
            flag: "Y"
          });

          for (let i = 0; i < obj.optionsRequestList().length; i++) {
            self.question()[self.question().length - 1].optionsRequestList.push({
              optionId: self.maxOptionId + 1,
              optionDescription: obj.optionsRequestList()[i]
            });

            self.maxOptionId = self.maxOptionId + 1;
          }
        });

        FeedbackModel.addQuestion(ko.toJSON({
          questionRequestList: getPayload()
        })).done(function() {
          self.nextStep();
        });
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };

    self.addQuestionForSave = function() {
      const tracker = document.getElementById("tracker");

      if (tracker && tracker.valid === "valid") {
        self.newQuestions().forEach(function(obj) {
          self.question().push({
            questionId: self.question().length + 1,
            questionDescription: obj.questionDescription,
            optionsRequestList: [],
            flag: "Y"
          });

          for (let i = 0; i < obj.optionsRequestList().length; i++) {
            self.question()[self.question().length - 1].optionsRequestList.push({
              optionId: self.maxOptionId + 1,
              optionDescription: obj.optionsRequestList()[i]
            });

            self.maxOptionId = self.maxOptionId + 1;
          }
        });

        FeedbackModel.addQuestion(ko.toJSON({
          questionRequestList: getPayload()
        })).done(function() {
          self.saveToReview();
        });
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };

    self.showFeedbackTransactionScreen = function() {
      params.baseModel.registerComponent("feedback-transaction-configuration", "feedback");
      params.dashboard.loadComponent("feedback-transaction-configuration",self);
    };

    self.edit = function() {
      self.disableInputsQuestion(false);
    };
  };
});