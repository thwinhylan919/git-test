define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Model for application dashboard section in the application tracking page. It serves as the model where the data to be used by the application details section is defined. Since this model is tech agnostic, it can be coupled with any technology.
   *
   * @namespace ApplicationDashboardModel~Model
   * @class ApplicationDashboard
   */
  const ApplicationDashboardModel = function() {
    const baseService = BaseService.getInstance();
    let getComponentListDeferred, cancelApplicationdeffered, withdrawApplicationdeffered;
    const fetchComponents = function(deferred) {
        const options = {
          url: "components/upldashboard",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetchJSON(options);
      },
      cancelApplication = function(submissionId, deferred) {
        const params = {
      submissionId:submissionId
      }, options = {
          url: "submissions/{submissionId}/cancel",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.remove(options, params);
      },
      withdrawApplication = function(submissionId, applicationId, deferred) {
        const params = {
      submissionId:submissionId,
      applicationId:applicationId
      },
       options = {
          url: "submissions/{submissionId}/applications/{applicationId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.remove(options, params);
      };

    return {
      fetchComponents: function() {
        getComponentListDeferred = $.Deferred();
        fetchComponents(getComponentListDeferred);

        return getComponentListDeferred;
      },
      cancelApplication: function(submissionId) {
        cancelApplicationdeffered = $.Deferred();
        cancelApplication(submissionId, cancelApplicationdeffered);

        return cancelApplicationdeffered;
      },
      withdrawApplication: function(submissionId, applicationId) {
        withdrawApplicationdeffered = $.Deferred();
        withdrawApplication(submissionId, applicationId, withdrawApplicationdeffered);

        return withdrawApplicationdeffered;
      }
    };
  };

  return new ApplicationDashboardModel();
});