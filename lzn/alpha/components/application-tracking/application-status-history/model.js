define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Model for application offers section in the application tracking page. It serves as the model where the data to be used by the application details section is defined. Since this model is tech agnostic, it can be coupled with any technology.
   *
   * @namespace ApplicationStatusHistory~Model
   * @class ApplicationStatusHistoryModel
   */
  const ApplicationStatusHistoryModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance();
    let appHistoryDeferred, appStateStringMapDeferred;
    const fetchApplicationHistory = function(submissionId, applicationId, deferred) {
        const options = {
          url: "submissions/{submissionId}/applications/{applicationId}/history",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
        submissionId: submissionId,
        applicationId: applicationId
      };

        baseService.fetch(options, params);
      },
      fetchApplicationStateStringMap = function(deferred, statusHistory) {
        const options = {
          url: "enumerations/applicationState",
          success: function(data) {
            deferred.resolve(data, statusHistory);
          }
        };

        baseService.fetch(options);
      };

    return {
      fetchApplicationHistory: function(submissionId, applicationId) {
        appHistoryDeferred = $.Deferred();
        fetchApplicationHistory(submissionId, applicationId, appHistoryDeferred);

        return appHistoryDeferred;
      },
      fetchApplicationStateStringMap: function(statusHistory) {
        appStateStringMapDeferred = $.Deferred();
        fetchApplicationStateStringMap(appStateStringMapDeferred, statusHistory);

        return appStateStringMapDeferred;
      }
    };
  };

  return new ApplicationStatusHistoryModel();
});
