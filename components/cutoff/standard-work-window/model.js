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
  const WorkWindowModel = function() {
    const
      baseService = BaseService.getInstance(),
      Model = function() {
        this.workWindowModel = {
          day: null,
          transactionWindowType: null,
          workingWindow: [],
          startTime: null,
          endTime: null
        };
      };
    /**
     * This function uses baseService's fetch to GET the bank details data from defined URL as specified in the lookUpUrl variable.
     * @function fetchDetails
     *
     * @param {String} lookUpUrl - String indicating the URL with which the details are to be fetched.
     * @param {Object} deferred - deferred object being passed which handles resolution or rejection of data.
     */
    let getTransactionsDeferred;
    const getTransactions = function(deferred) {
      const options = {
        url: "resourceTasks?aspects=working-window",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchStandardDetailsDeferred;
    const fetchStandardWorkWindowDetails = function(taskCode, startDate, roleName, deferred) {
      const options = {
        url: "workingWindows?taskCode=" + taskCode + "&startDate=" + startDate + "&roleName=" + roleName + "&workingWindowType=STANDARD",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchUserTypeDeferred;
    const fetchUserType = function(deferred) {
      const
        options = {
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
    let deleteWorkWindowDeferred;
    const deleteWorkWindow = function(workingWindowId, deferred) {
      const options = {
        url: "workingWindows/" + workingWindowId,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.remove(options);
    };

    return {
      getNewModel: function() {
        return new Model();
      },
      getTransactions: function() {
        getTransactionsDeferred = $.Deferred();
        getTransactions(getTransactionsDeferred);

        return getTransactionsDeferred;
      },
      fetchStandardWorkWindowDetails: function(taskCode, startDate, roleName) {
        fetchStandardDetailsDeferred = $.Deferred();
        fetchStandardWorkWindowDetails(taskCode, startDate, roleName, fetchStandardDetailsDeferred);

        return fetchStandardDetailsDeferred;
      },
      fetchUserType: function() {
        fetchUserTypeDeferred = $.Deferred();
        fetchUserType(fetchUserTypeDeferred);

        return fetchUserTypeDeferred;
      },
      deleteWorkWindow: function(workingWindowId) {
        deleteWorkWindowDeferred = $.Deferred();
        deleteWorkWindow(workingWindowId, deleteWorkWindowDeferred);

        return deleteWorkWindowDeferred;
      }
    };
  };

  return new WorkWindowModel();
});