/**
 */
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const TransactionGroupReadModel = function() {
    const baseService = BaseService.getInstance();
    /**
     * Method to delete Transaction Group
     *  deferred object is resolved once the  information  is successfully fetched
     *
     * @function deleteTransactionGroup
     * @param {string} transactionGroupId- transactionGroupId for creating Transaction Group
     * @param {oject} deferred- resolved for successful request
     * @private
     */
    let deleteTransactionGroupDeferred;
    const deleteTransactionGroup = function(transactionGroupId, deferred) {
      const params = {
          taskGroupId: transactionGroupId
        },
        options = {
          url: "taskGroups/{taskGroupId}",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };

      baseService.remove(options, params);
    };

    return {
      /**
       * ReadTransactionGroup - reads the Transaction group.
       *
       * @param  {string} transactionGroupId - Transaction Group Id for Transaction group.
       * @returns {Promise}  Returns the promise object.
       */
      readTransactionGroup: function(transactionGroupId) {
        const params = {
            taskGroupId: transactionGroupId
          },
          options = {
            url: "taskGroups/{taskGroupId}"
          };

        return baseService.fetch(options, params);
      },
      deleteTransactionGroup: function(transactionGroupId) {
        deleteTransactionGroupDeferred = $.Deferred();
        deleteTransactionGroup(transactionGroupId, deleteTransactionGroupDeferred);

        return deleteTransactionGroupDeferred;
      }
    };
  };

  return new TransactionGroupReadModel();
});