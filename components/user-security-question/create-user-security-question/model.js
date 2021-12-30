define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const createUserSecurityQuestionModel = function() {
    const Model = function() {
        this.QuesAnsPayload = {
          userSecurityQuestionList: []
        };
      },
      baseService = BaseService.getInstance();
    let fetchQuestionsDeferred;
    const fetchQuestions = function(deferred) {
      const options = {
        url: "securityQuestion",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let addQuesAnsDeferred;
    const addQuesAns = function(deferred, payload) {
      const options = {
        url: "me/securityQuestion",
        data: payload,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };

      baseService.add(options);
    };

    return {
      fetchQuestions: function() {
        fetchQuestionsDeferred = $.Deferred();
        fetchQuestions(fetchQuestionsDeferred);

        return fetchQuestionsDeferred;
      },
      getNewModel: function() {
        return new Model();
      },
      addQuesAns: function(payload) {
        addQuesAnsDeferred = $.Deferred();
        addQuesAns(addQuesAnsDeferred, payload);

        return addQuesAnsDeferred;
      }
    };
  };

  return new createUserSecurityQuestionModel();
});