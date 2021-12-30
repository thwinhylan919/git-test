define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";

  const SecurityQuestions = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance();
    /**
     * This function fires a GET request to fetch the Question against its Id
     *
     */
    let fetchQuestionDeferred;
    const fetchQuestion = function(questionId, deferred) {
      const params = {
          questionId: questionId
        },
        options = {
          url: "securityQuestion/question/{questionId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };

    return {
      fetchQuestion: function(questionId) {
        fetchQuestionDeferred = $.Deferred();
        fetchQuestion(questionId, fetchQuestionDeferred);

        return fetchQuestionDeferred;
      }
    };
  };

  return new SecurityQuestions();
});