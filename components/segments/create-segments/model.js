define([
  "baseService",
  "jquery"
], function (BaseService, $) {
  "use strict";

  const CreateSegmentModel = function () {
    const baseService = BaseService.getInstance(),
      Model = function () {
        return {
          name: "",
          status: true,
          enterpriseRole: "",
          code: "",
          limits: [],
          roles: []
        };
      };
    /**
     * fetchChildRoleDeferred -fetches list of application roles
     *
     * @param  {Object} enterpriseRoleId     unique identifier of the enterprise role.
     * @param  {Object} deferred deferred object
     * @return {type}          return the transaction response
     */
    let fetchChildRoleDeferred;
    const fetchChildRole = function (enterpriseRoleId, deferred) {
      const params = {
          enterpriseRoleId: enterpriseRoleId
        },
        options = {
          url: "applicationRoles?accessPointType=INT&enterpriseRole={enterpriseRoleId}",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    /**
     * fireBatchDeferred -fetches batch for list of limit packages
     *
     * @param  {Object} batchRequest    batch request details
     * @param  {Object} type batch type
     * @param  {Object} deferred deferred object
     * @return {type}          return the transaction response
     */
    let fireBatchDeferred;
    const fireBatch = function (deferred, batchRequest, type) {
      const options = {
        url: "batch",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.batch(options, {
        type: type
      }, batchRequest);
    };

    return {
      /**
       * FetchEnterpriseRoles - fetch entrprise roles for mapping segment user type.
       *
       * @return {Promise}  Returns the promise object.
       */
      fetchEnterpriseRoles: function () {
        const options = {
          url: "enterpriseRoles"
        };

        return baseService.fetch(options);
      },
      /**
       * FetchChildRole - fetch application roles for mapping segment user type.
       *
       * @param  {Object} enterpriseRoleId     - Unique identifier of the enterprise role.
       * @return {Promise}  Returns the promise object.
       */
      fetchChildRole: function (enterpriseRoleId) {
        fetchChildRoleDeferred = $.Deferred();
        fetchChildRole(enterpriseRoleId, fetchChildRoleDeferred);

        return fetchChildRoleDeferred;
      },
      /**
       * GetNewModel - fetch the model object.
       *
       * @return {Object}  Returns the model object.
       */
      getNewModel: function () {
        return new Model();
      },
      /**
       * FireBatch - fetches batch to get the limit packages details.
       *
       * @param  {Object} batchRequest     - Batch request details.
       * @param  {Object} type     - Type of the batch.
       * @return {Promise}  Returns the promise object.
       */
      fireBatch: function (batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        fireBatch(fireBatchDeferred, batchRequest, type);

        return fireBatchDeferred;
      }
    };
  };

  return new CreateSegmentModel();
});