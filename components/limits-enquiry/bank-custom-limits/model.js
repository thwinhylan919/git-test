define([
  "baseService",
  "jquery"
], function (BaseService, $) {
  "use strict";

  const BankCustomLimitsModel = function () {
    const baseService = BaseService.getInstance();

    /**
     * createBankCustomLimitsDeferred - create bank custom limits for given user.
     * @param  {Object} requestDTO object representing bank custom limit packages.
     * @param  {Object} userId  unique identifier of the user.
     * @param  {type} deferred deferred object
     */
    let createBankCustomLimitsDeferred;
    const createBankCustomLimits = function (requestDTO, userId, deferred) {
      const params = {
          userId: userId
        },
        options = {
          data: requestDTO,
          url: "users/{userId}/customLimitPackage",
          success: function (data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function (data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };

      baseService.add(options, params);
    };

    return {

      /**
       * FetchAssignedLimitPackages - Fetch limit packages assigned to the user.
       *
       * @param  {string} userId - Unique identifier of the user.
       * @param  {string} accessPointValue - It is access point id if accessPointGroupType is single,  access point group id if group else global.
       * @param  {string} accessPointGroupType  - It is single for access point ,  group id for access point group if group else global.
       *
       * @return {Promise}  Returns the promise object.
       */
      fetchAssignedLimitPackages: function (userId, accessPointValue, accessPointGroupType) {
        const params = {
            accessPointValue: accessPointValue,
            accessPointGroupType: accessPointGroupType,
            userId: userId
          },
          options = {
            url: "users/{userId}/assignedLimitPackage?accessPointValue={accessPointValue}&accessPointGroupType={accessPointGroupType}"
          };

        return baseService.fetch(options, params);
      },
      /**
       * FetchCustomLimitPackages - Fetch custom limit packages created by the user.
       *
       *  @param  {string} userId - Unique identifier of the user.
       *  @param  {string} isEffective - IsEffective.
       *  @return {Promise}  Returns the promise object.
       */
      fetchCustomLimitPackages: function (userId,isEffective) {
        const params = {
            userId: userId,
            isEffective : isEffective
          },
          options = {
            url: "users/{userId}/customLimitPackage?isEffective={isEffective}"
          };

        return baseService.fetch(options, params);
      },
      /**
       * FetchUtilizedLimits - Fetch limits utilized by to the user.
       *
       * @param  {string} userId - Unique identifier of the user.
       * @param  {string} entityType - Utilization level type of the user.
       * @param  {string} accessPointValue - It is access point id if accessPointGroupType is single,  access point group id if group else global.
       * @param  {string} accessPointGroupType - It is single for access point ,  group id for access point group if group else global.
       * @param  {string} limitType - It is daily or monthly.
       *
       * @return {Promise}  Returns the promise object.
       */
      fetchUtilizedLimits: function (userId, entityType, accessPointValue, accessPointGroupType, limitType) {
        const params = {
            entityType: entityType,
            accessPointValue: accessPointValue,
            accessPointGroupType: accessPointGroupType,
            limitType: limitType,
            userId: userId
          },
          options = {
            url: "financialLimitUtilization/{userId}?entityType={entityType}&limitType={limitType}&accessPointValue={accessPointValue}&accessPointGroupType={accessPointGroupType}"
          };

        return baseService.fetch(options, params);
      },

      /**
       * SearchTransactionGroup - Fetch the transaction group with limit aspect.
       *
       * @param  {string} taskAspect - It is aspect supported by task.
       *
       *  @return {Promise}  Returns the promise object.
       */
      searchTransactionGroup: function (taskAspect) {
        const params = {
            taskAspect: taskAspect
          },
          options = {
            url: "taskGroups?taskAspect={taskAspect}"
          };

        return baseService.fetch(options, params);
      },
      /**
       * SearchTasks - Fetch the task with limit aspect.
       *
       * @return {Promise}  Returns the promise object.
       */
      searchTasks: function () {
        const params = {
            aspects: "limit",
            view: "list"
          },
          options = {
            url: "resourceTasks?aspects={aspects}&view={view}"
          };

        return baseService.fetch(options, params);
      },
      /**
       * FetchAccessPoints - fetches all the access points.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchAccessPoints: function () {
        const options = {
          url: "accessPoints"
        };

        return baseService.fetch(options);
      },
      /**
       * FetchEffectiveTodayDetails - fetches all the access points.
       *
       *  @returns {Promise}  Returns the promise object.
       *
       */
      fetchEffectiveTodayDetails: function () {
        const options = {
          url: "limitPackages/config/effectiveToday"
        };

        return baseService.fetch(options);
      },
      /**
       * CreateBankCustomLimits - create bank custom limits for given user.
       *
       * @param  {string} requestDTO  - Object representing bank custom limit packages.
       * @param  {string} userId - Unique identifier of the user.
       *
       * @returns {Promise}  Returns the promise object.
       */
      createBankCustomLimits: function (requestDTO, userId) {
        createBankCustomLimitsDeferred = $.Deferred();
        createBankCustomLimits(requestDTO, userId, createBankCustomLimitsDeferred);

        return createBankCustomLimitsDeferred;
      },
      /**
       * FetchUser - Fetch user on which bank custom limits are defined.
       *
       * @param  {string} userId - Unique identifier of the user.
       *
       * @return {Promise}  Returns the promise object.
       */
      fetchUser: function (userId) {
        const params = {
            userId: userId
          },
          options = {
            url: "users/{userId}"
          };

        return baseService.fetch(options, params);
      }
    };
  };

  return new BankCustomLimitsModel();
});