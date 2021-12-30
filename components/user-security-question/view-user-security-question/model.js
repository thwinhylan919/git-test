define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const viewUserSecurityQuestionModel = function() {
    const baseService = BaseService.getInstance();
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
    let fetchQuestionConfigurationDeferred;
    const fetchQuestionConfiguration = function(deferred, userSegment) {
      const options = {
          url: "me/securityQuestion/noOfQuestions",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          userSegment: userSegment
        };

      baseService.fetch(options, params);
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
      fetchQuestionConfiguration: function(userSegment) {
        fetchQuestionConfigurationDeferred = $.Deferred();
        fetchQuestionConfiguration(fetchQuestionConfigurationDeferred, userSegment);

        return fetchQuestionConfigurationDeferred;
      }
    };
  };

  return new viewUserSecurityQuestionModel();
});