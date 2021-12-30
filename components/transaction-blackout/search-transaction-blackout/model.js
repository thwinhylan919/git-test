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
  const searchTransactionBlackoutModel = function() {
    const baseService = BaseService.getInstance(),
      Model = function() {
        this.transactionDetails = {
          transactionName: null,
          blackoutType: null,
          startDate: null,
          endDate: null,
          status: null,
          transactionDetailsFetched: false,
          transactionBlackoutDTO: null
        };
      };
    /**
     * This function uses baseService's fetch to GET the bank details data from defined URL as specified in the lookUpUrl variable.
     * @function fetchDetails
     *
     * @param {String} lookUpUrl - String indicating the URL with which the details are to be fetched.
     * @param {Object} deferred - deferred object being passed which handles resolution or rejection of data.
     */
    let fetchDetailsDeferred;
    const fetchDetails = function(taskCode, userType, startDate, deferred) {
      const options = {
        url: "blackouts?taskCode=" + taskCode + "&roleName=" + userType + "&startDate=" + startDate,
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let getTransactionsDeferred;
    const getTransactions = function(taskType, deferred) {
      const options = {
        url: "resourceTasks?taskType=" + taskType + "&aspects=blackout",
        success: function(data) {
          deferred.resolve(data);
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

    return {
      getNewModel: function() {
        return new Model();
      },
      fetchDetails: function(taskCode, userType, startDate) {
        fetchDetailsDeferred = $.Deferred();
        fetchDetails(taskCode, userType, startDate, fetchDetailsDeferred);

        return fetchDetailsDeferred;
      },
      getTransactions: function(taskType) {
        getTransactionsDeferred = $.Deferred();
        getTransactions(taskType, getTransactionsDeferred);

        return getTransactionsDeferred;
      },
      fetchUserType: function() {
        fetchUserTypeDeferred = $.Deferred();
        fetchUserType(fetchUserTypeDeferred);

        return fetchUserTypeDeferred;
      }
    };
  };

  return new searchTransactionBlackoutModel();
});