define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Model for application summary section in the application tracking page. It serves as the model where the data to be used by the application summary section is defined.
   *
   * @namespace ApplicationSummaryModel~Model
   * @class ApplicationSummaryModel
   */
  const ApplicationSummaryModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance();
    let appSummaryDeferred;
    /**
     * Private method to get application summary details to be displayed in application dashboard of application tracker.
     * This method will only be called if submissionId, applicationId is present, and will resolve a
     * passed deferred object, which can be returned from calling function to the parent.
     *
     * @function fetchApplicationSummary
     * @memberOf ApplicationSummaryModel
     * @param {string} submissionId - Submission id of the application.
     * @param {string} applicationId - Application id of the application.
     * @param {Object} deferred - An object type Deferred.
     * @returns {void}
     * @private
     */
    const fetchApplicationSummary = function(submissionId, applicationId, deferred) {
      const params = {
        submissionId:submissionId,
        applicationId:applicationId
      },
      options = {
        url: "submissions/{submissionId}/applications/{applicationId}/summary",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options,params);
    };

    return {
      /**
       * Public method to get application summary details to be displayed in application dashboard of application tracker.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function fetchApplicationSummary
       * @memberOf ApplicationSummaryModel
       * @param {string} submissionId - Submission id of the application.
       * @param {string} applicationId - Application id of the application.
       * @returns {Object} An object of type deferred.
       * @example
       * ApplicationSummaryModel.fetchApplicationSummary().then(function (data) {
       *
       * });
       */
      fetchApplicationSummary: function(submissionId, applicationId) {
        appSummaryDeferred = $.Deferred();
        fetchApplicationSummary(submissionId, applicationId, appSummaryDeferred);

        return appSummaryDeferred;
      }
    };
  };

  return new ApplicationSummaryModel();
});
