define(["jquery", "baseService"], function($, BaseService) {
  "use strict";

  /**
   * Let ApplicationTrackingBaseModel - description.
   *
   * @return {type}  Description.
   */
  const ApplicationTrackingBaseModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance(),
      fetchUserProfileDeferred = $.Deferred();

    this.fetchUserProfile = function() {
      const options = {
        url: "me",
        success: function(data) {
          fetchUserProfileDeferred.resolve(data);
        },
        error: function(data) {
          fetchUserProfileDeferred.reject(data);
        }
      };

      baseService.fetch(options);

      return fetchUserProfileDeferred;
    };

    /**
     * This - description.
     *
     * @return {type}  Description.
     */
    this.fetchSubmissionIdList = function() {
      const options = {
        url: "submissions"
      };

      return baseService.fetch(options);
    };

    /**
     * This - description.
     *
     * @return {type}  Description.
     */
    this.fetchApplicationStatusStringMap = function() {
      const options = {
        url: "enumerations/applicationStatus"
      };

      return baseService.fetch(options);
    };

    /**
     * This - description.
     *
     * @return {type}  Description.
     */
    this.fetchSubmissionStatusStringMap = function() {
      const options = {
        url: "enumerations/submissionStatus"
      };

      return baseService.fetch(options);
    };

    /**
     * This - description.
     *
     * @param  {type} submissionId   - - - - - - - - - - - - - - - Description.
     * @param  {type} applicationId  Description.
     * @param  {type} successHandler Description.
     * @return {type}                Description.
     */
    this.fetchApplicationStages = function(submissionId, applicationId, successHandler) {
      const params = {
        submissionId:submissionId,
        applicationId:applicationId
      },
      options = {
        url: "submissions/{submissionId}/applications/{applicationId}/progress",
        success: function(data) {
          successHandler(data);
        }
      };

      baseService.fetch(options,params);
    };

    /**
     * This - description.
     *
     * @param  {type} productCode    - - - - - - - - - - - - - - - - Description.
     * @param  {type} successHandler Description.
     * @return {type}                Description.
     */
    this.fetchFlow = function(productCode, successHandler) {
      const params = {
        productCode:productCode
      },
      options = {
        url: "origination/flows/{productCode}",
        success: function(data) {
          successHandler(data);
        }
      };

      baseService.fetchJSON(options, params);
    };
  };

  return new ApplicationTrackingBaseModel();
});
