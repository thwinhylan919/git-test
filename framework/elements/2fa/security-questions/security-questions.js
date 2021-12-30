define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/security-question",
    "ojs/ojinputtext"
], function(ko, SecurityQuestionsModel, locale) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.mappingQuestionIdAndAnswer = [];
        self.locale = locale;
        self.sendQuestionIdAndAnswer = {};
        self.sendQuestionIdAndAnswer.referenceNo = rootParams.rootModel.challenge.referenceNo;
        self.actionHeaderheading = ko.observable(self.locale.securityQuestion.headers.securityQuestion);
        self.mappingOfQuestionsAndId = ko.observableArray();
        self.submittedAnswers = [];
        self.questionIds = rootParams.rootModel.challenge.questionIDs;
        self.questionPopulated = ko.observable();
        self.cancelAuthenticationScreen = rootParams.rootModel.cancelAuthenticationScreen;

        for (let i = 0; i < self.questionIds.length; i++) {
            SecurityQuestionsModel.fetchQuestion(self.questionIds[i]).done(function(idAndQuestion) {
                self.mappingOfQuestionsAndId.push({
                    questionId: idAndQuestion.securityQuestionMappingDTO.questionId,
                    question: idAndQuestion.securityQuestionMappingDTO.question,
                    answer: ko.observable()
                });

                self.questionPopulated(true);
            });
        }

        self.completedSecQuestion = function() {
            rootParams.baseModel.onTFAScreen(false);

            if (self.originalSuccess) {
                return self.originalSuccess.apply(this, Array.prototype.slice.call(arguments));
            }
        };

        self.submitAnswers = function() {
            for (let i = 0; i < self.mappingOfQuestionsAndId().length; i++) {
                self.mappingQuestionIdAndAnswer.push({
                    questionId: self.mappingOfQuestionsAndId()[i].questionId,
                    answer: self.mappingOfQuestionsAndId()[i].answer()
                });
            }

            self.sendQuestionIdAndAnswer.questionAnswers = self.mappingQuestionIdAndAnswer;
            rootParams.rootModel.submit2fa(self.sendQuestionIdAndAnswer);
        };
    };
});