define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * This file contains all the REST services APIs for the bank-look-up component.
   *
   * @class BankLookUpModel
   * @extends BaseService {@link BaseService}
   * @property {Object} baseService - baseService instance through which all the rest calls will be made.
   */
  const UserGroupModel = function() {
    const baseService = BaseService.getInstance(),
      Model = function() {
        this.blackout = {
          blackoutId: null,
          taskCode: null,
          startDate: null,
          endDate: null,
          frequency: null,
          transactionName: null,
          blackoutRole: [],
          blackoutTime: []
        };
      };
    /**
     * This function uses baseService's fetch to GET the bank details data from defined URL as specified in the lookUpUrl variable.
     * @function fetchDetails
     *
     * @param {String} lookUpUrl - String indicating the URL with which the details are to be fetched.
     * @param {Object} deferred - deferred object being passed which handles resolution or rejection of data.
     */
    let createBlackoutDeferred;
    const createBlackout = function(model, deferred) {
      const options = {
          url: "blackouts",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        },
        params = {
          model: model
        };

      baseService.add(options, params);
    };
    let getTransactionsDeferred;
    const getTransactions = function(deferred) {
      const options = {
        url: "resourceTasks?aspects=blackout",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.fetch(options);
    };
    let fetchTaskNameDeferred;
    const fetchTaskName = function(taskId, deferred) {
      const options = {
        url: "resourceTasks/" + taskId,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.fetch(options);
    };
    let fetchUserTypeDeferred;
    const fetchUserType = function(deferred) {
      const options = {
        url: "enterpriseRoles?isLocal=true",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let updateBlackoutDeferred;
    const updateBlackout = function(blackoutId, model, deferred) {
      const options = {
        url: "blackouts/" + blackoutId,
        data: model,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };

      baseService.update(options);
    };
    let readTBDeferred;
    const readTB = function(blackoutId, deferred) {
      const options = {
        url: "blackouts/" + blackoutId,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };

      baseService.fetch(options);
    };

    return {
      getNewModel: function() {
        return new Model();
      },
      createBlackout: function(model) {
        createBlackoutDeferred = $.Deferred();
        createBlackout(model, createBlackoutDeferred);

        return createBlackoutDeferred;
      },
      getTransactions: function() {
        getTransactionsDeferred = $.Deferred();
        getTransactions(getTransactionsDeferred);

        return getTransactionsDeferred;
      },
      fetchUserType: function() {
        fetchUserTypeDeferred = $.Deferred();
        fetchUserType(fetchUserTypeDeferred);

        return fetchUserTypeDeferred;
      },
      fetchTaskName: function(taskId) {
        fetchTaskNameDeferred = $.Deferred();
        fetchTaskName(taskId, fetchTaskNameDeferred);

        return fetchTaskNameDeferred;
      },
      updateBlackout: function(blackoutId, model) {
        updateBlackoutDeferred = $.Deferred();
        updateBlackout(blackoutId, model, updateBlackoutDeferred);

        return updateBlackoutDeferred;
      },
      readTB: function(blackoutId) {
        readTBDeferred = $.Deferred();
        readTB(blackoutId, readTBDeferred);

        return readTBDeferred;
      }
    };
  };

  return new UserGroupModel();
});