define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const reviewUserSecurityQuestionModel = function() {
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
    let updateQuesAnsDeferred;
    const updateQuesAns = function(deferred, payload) {
      const options = {
        url: "me/securityQuestion",
        data: payload,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };

      baseService.update(options);
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
      addQuesAns: function(payload) {
        addQuesAnsDeferred = $.Deferred();
        addQuesAns(addQuesAnsDeferred, payload);

        return addQuesAnsDeferred;
      },
      updateQuesAns: function(payload) {
        updateQuesAnsDeferred = $.Deferred();
        updateQuesAns(updateQuesAnsDeferred, payload);

        return updateQuesAnsDeferred;
      }
    };
  };

  return new reviewUserSecurityQuestionModel();
});