define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Model for application fees view in the Application tracking additional details section. It serves as the model where the data to be used by the application details section is defined. Since this model is tech agnostic, it can be coupled with any technology.
   *
   * @namespace ApplicationFeesViewModel~Model
   * @class
   * @property {Object[]} sections - Array containing the distinct additional information sections
   * @return {Object}  Description.
   */
  const ApplicationFeesViewModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance();
    let appFeesDeffered, collectionTypeDeffered;
    /**
     * FetchAppFees - description.
     *
     * @param  {Object} submissionId  - - - - - - - - - - - - - - - Description.
     * @param  {Object} applicationId Description.
     * @param  {Object} deferred      Description.
     * @return {void}               Description.
     */
    const fetchAppFees = function(submissionId, applicationId, deferred) {
      const params = {
        submissionId:submissionId,
        applicationId:applicationId
      },
      options = {
        url: "submissions/{submissionId}/applications/{applicationId}/fees",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options,params);
    };
    let fetchFundingTableDeferred;
    /**
     * FetchFundingTable - description.
     *
     * @param  {Object} submissionId  - - - - - - - - - - - - - - - Description.
     * @param  {Object} applicationId Description.
     * @param  {Object} deferred      Description.
     * @return {void}               Description.
     */
    const fetchFundingTable = function(submissionId, applicationId, deferred) {
      const params = {
        submissionId:submissionId,
        applicationId:applicationId
      },
     options = {
          url: "submissions/{submissionId}/applications/{applicationId}/fees",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.fetch(options,params);
      },
      /**
       * FetchCollectionType - description.
       *
       * @param  {Object} deferred - Description.
       * @return {void}          Description.
       */
      fetchCollectionType = function(deferred) {
        const options = {
          url: "enumerations/collectionType",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };

    return {
      /**
       * FetchAppFees - description.
       *
       * @param  {Object} submissionId  - - - - - - - - - - - - - - - - Description.
       * @param  {Object} applicationId Description.
       * @return {void}               Description.
       */
      fetchAppFees: function(submissionId, applicationId) {
        appFeesDeffered = $.Deferred();
        fetchAppFees(submissionId, applicationId, appFeesDeffered);

        return appFeesDeffered;
      },
      /**
       * FetchFundingTable - description.
       *
       * @param  {Object} submissionId  - - - - - - - - - - - - - - - - Description.
       * @param  {Object} applicationId Description.
       * @return {void}               Description.
       */
      fetchFundingTable: function(submissionId, applicationId) {
        fetchFundingTableDeferred = $.Deferred();
        fetchFundingTable(submissionId, applicationId, fetchFundingTableDeferred);

        return fetchFundingTableDeferred;
      },
      /**
       * FetchCollectionType - description.
       *
       * @return {void}  Description.
       */
      fetchCollectionType: function() {
        collectionTypeDeffered = $.Deferred();
        fetchCollectionType(collectionTypeDeffered);

        return collectionTypeDeffered;
      }
    };
  };

  return new ApplicationFeesViewModel();
});
