define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Model for application dashboard section in the application tracking page. It serves as the model where the data to be used by the application details section is defined.
   *
   * @namespace ApplicationDashboardModel~Model
   * @class ApplicationDashboard
   */
  /**
   * Let ApplicationDashboardModel - description.
   *
   * @return {type}  Description.
   */
  const ApplicationDashboardModel = function() {
    const baseService = BaseService.getInstance();
    let withdrawApplicationdeffered;
    /**
     * Private method to withdraw application if the applicant chooses to cancel application post submission,
     * this method will only be called if submissionId is present, and will resolve a
     * passed deferred object, which can be returned from calling function to the parent.
     *
     * @function withdrawApplication
     * @memberOf ApplicationDashboardModel
     * @param {String} submissionId - Submission id of the application
     * @param {Object} deferred - An object type Deferred
     * @returns {void}
     * @private
     */
    /**
     * WithdrawApplication - description.
     *
     * @param  {type} submissionId  - - - - - - - - - - - - - - - Description.
     * @param  {type} applicationId Description.
     * @param  {type} deferred      Description.
     * @return {type}               Description.
     */
    const withdrawApplication = function(submissionId, applicationId, deferred) {
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

      baseService.remove(options,params);
    };

    return {
      /**
       * Public method to withdraw application in application dashboard model. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function withdrawApplication
       * @memberOf ApplicationDashboardModel
       * @param {String} submissionId Submission id of the application
       * @returns {Object} An object of type deferred
       * @example
       * ApplicationDashboardModel.withdrawApplication().then(function (data) {
       *
       * });
       */
      /**
       * WithdrawApplication - description.
       *
       * @param  {type} submissionId  - - - - - - - - - - - - - - - - Description.
       * @param  {type} applicationId Description.
       * @return {type}               Description.
       */
      withdrawApplication: function(submissionId, applicationId) {
        withdrawApplicationdeffered = $.Deferred();
        withdrawApplication(submissionId, applicationId, withdrawApplicationdeffered);

        return withdrawApplicationdeffered;
      }
    };
  };

  return new ApplicationDashboardModel();
});
