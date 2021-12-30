define([
  "baseService",
  "jquery"
], function (BaseService, $) {
  "use strict";

  const Model = function () {
    const baseService = BaseService.getInstance();
    /**
     * createSegmentDeferred - create user segment with given details.
     *
     * @param  {Object} payload  object representing user segment details.
     * @param  {Object} deferred deferred object
     * @return {type}          return the transaction response
     */
    let createSegmentDeferred;
    const createSegment = function (payload, deferred) {
      const options = {
        data: payload,
        url: "segments",
        success: function (data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function (data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.add(options);
    };
    /**
     * updateSegmentDeferred - update user segment with given details for given segment code.
     *
     * @param  {Object} code     unique identifier of the segment whose details need to be updated.
     * @param  {Object} payload  object representing user segment details.
     * @param  {Object} deferred deferred object
     * @return {type}          return the transaction response
     */
    let updateSegmentDeferred;
    const updateSegment = function (code, payload, deferred) {
      const params = {
          code: code
        },
        options = {
          data: payload,
          url: "segments/{code}",
          success: function (data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function (data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };

      baseService.update(options, params);
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
    /**
     * fetchAccessDeferred -fetches access point details
     *
     * @param  {Object} searchParams    access point search parameters
     * @param  {Object} deferred deferred object
     * @return {type}          return the transaction response
     */
    let fetchAccessDeferred;
    const fetchAccess = function (searchParams, deferred) {
      const options = {
        url: "accessPoints?accessType=All",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options, searchParams);
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
       * CreateSegment - create user segment with given details.
       *
       * @param  {Object} payload - Object representing user segment details.
       * @return {Object}         Return the transaction response.
       */
      createSegment: function (payload) {
        createSegmentDeferred = $.Deferred();
        createSegment(payload, createSegmentDeferred);

        return createSegmentDeferred;
      },
      /**
       * UpdateSegment - update user segment with given details for given segment code.
       *
       * @param  {Object} code    - Unique identifier of the segment whose details need to be updated.
       * @param  {Object} payload - Object representing user segment details.
       * @return {Object}         Return the transaction response.
       */
      updateSegment: function (code, payload) {
        updateSegmentDeferred = $.Deferred();
        updateSegment(code, payload, updateSegmentDeferred);

        return updateSegmentDeferred;
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
      },
      /**
       * FetchAccess - fetches access point details.
       *
       * @param  {Object} searchParams     - Access point search parameters.
       * @return {Promise}  Returns the promise object.
       */
      fetchAccess: function (searchParams) {
        fetchAccessDeferred = $.Deferred();
        fetchAccess(searchParams, fetchAccessDeferred);

        return fetchAccessDeferred;
      },
      /**
       * ListAccessPointGroup - fetches the AccessPointGroup List.
       *
       * @returns {Promise}  Returns the promise object.
       */
      listAccessPointGroup: function () {
        const options = {
          url: "accessPointGroups"
        };

        return baseService.fetch(options);
      }
    };
  };

  return new Model();
});