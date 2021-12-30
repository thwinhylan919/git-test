/**
 */
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const TransactionGroupUpdateModel = function() {
    const baseService = BaseService.getInstance();
    /**
     * Method to create Transaction Group
     *  deferred object is resolved once the  information  is successfully fetched
     *
     * @function updateTransactionGroup
     * @param {string} payload- for creating Transaction Group
     * @param {string} transactionGroupId- transactionGroupId for creating Transaction Group
     * @param {oject} deferred- resolved for successful request
     * @private
     */
    let updateTransactionGroupDeferred;
    const updateTransactionGroup = function(payload, transactionGroupId, deferred) {
      const params = {
          taskGroupId: transactionGroupId
        },
        options = {
          url: "taskGroups/{taskGroupId}",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };

      baseService.update(options, params);
    };

    return {
      /**
       * FetchTransactionList - fetches the Task Group list.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchTransactionList: function() {
        const options = {
          url: "resourceTasks?aspects=limit&view=list"
        };

        return baseService.fetch(options);
      },
      updateTransactionGroup: function(payload, transactionGroupId) {
        updateTransactionGroupDeferred = $.Deferred();
        updateTransactionGroup(payload, transactionGroupId, updateTransactionGroupDeferred);

        return updateTransactionGroupDeferred;
      }
    };
  };

  return new TransactionGroupUpdateModel();
});