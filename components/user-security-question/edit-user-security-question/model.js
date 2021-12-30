define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const editUserSecurityQuestionModel = function() {
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
    let fetchUserQuestionsDeferred;
    const fetchUserQuestions = function(deferred) {
      const options = {
        url: "me/securityQuestion",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      fetchQuestions: function() {
        fetchQuestionsDeferred = $.Deferred();
        fetchQuestions(fetchQuestionsDeferred);

        return fetchQuestionsDeferred;
      },
      fetchUserQuestions: function() {
        fetchUserQuestionsDeferred = $.Deferred();
        fetchUserQuestions(fetchUserQuestionsDeferred);

        return fetchUserQuestionsDeferred;
      },
      getNewModel: function() {
        return new Model();
      }
    };
  };

  return new editUserSecurityQuestionModel();
});