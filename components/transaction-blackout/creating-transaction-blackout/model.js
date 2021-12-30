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
  const createTransactionBlackoutModel = function() {
    const baseService = BaseService.getInstance(),
      Model = function() {
        this.blackout = {
          blackoutId: null,
          taskCode: null,
          startDate: null,
          endDate: null,
          frequency: "FULL",
          blackoutRole: [],
          blackoutTime: [],
          transactionBlackoutStatusType: null,
          transactionName: null
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
          }
        },
        params = {
          model: model
        };

      baseService.add(options, params);
    };
    let getTransactionsDeferred;
    const getTransactions = function(taskType, deferred) {
      const options = {
        url: "resourceTasks?taskType=" + taskType + "&aspects=blackout",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.fetch(options);
    };
    let deleteBlackoutDeferred;
    const deleteBlackout = function(blackoutId, deferred) {
      const options = {
        url: "blackouts/" + blackoutId,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.remove(options);
    };
    let fetchUserTypeDeferred;
    const fetchUserType = function(deferred) {
      const options = {
        url: "enterpriseRoles?isLocal=true",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
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
      getTransactions: function(taskType) {
        getTransactionsDeferred = $.Deferred();
        getTransactions(taskType, getTransactionsDeferred);

        return getTransactionsDeferred;
      },
      deleteBlackout: function(blackoutId) {
        deleteBlackoutDeferred = $.Deferred();
        deleteBlackout(blackoutId, deleteBlackoutDeferred);

        return deleteBlackoutDeferred;
      },
      fetchUserType: function() {
        fetchUserTypeDeferred = $.Deferred();
        fetchUserType(fetchUserTypeDeferred);

        return fetchUserTypeDeferred;
      }
    };
  };

  return new createTransactionBlackoutModel();
});