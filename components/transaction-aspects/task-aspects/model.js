define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const TransactionAspectsModel = function() {
    const Model = function() {
        this.payload = {
          aspects: []
        };
      },
      baseService = BaseService.getInstance();
    let getTransactionsDeferred;
    const getTransactions = function(deferred) {
      const options = {
        url: "resourceTasks?view=list",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let searchTransactionsDeffered;
    const searchTransactions = function(deferred, taskID) {
      const params = {
          taskId: taskID
        },
        options = {
          url: "resourceTasks/{taskId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let setTaskAspectsDeferred;
    const setTaskAspects = function(taskId, payload, deferred) {
      const params = {
          taskId: taskId
        },
        options = {
          url: "resourceTasks/{taskId}",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };

      baseService.patch(options, params);
    };

    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getTransactions: function() {
        getTransactionsDeferred = $.Deferred();
        getTransactions(getTransactionsDeferred);

        return getTransactionsDeferred;
      },
      searchTransactions: function(taskId) {
        searchTransactionsDeffered = $.Deferred();
        searchTransactions(searchTransactionsDeffered, taskId);

        return searchTransactionsDeffered;
      },
      setTaskAspects: function(roleId, payload) {
        setTaskAspectsDeferred = $.Deferred();
        setTaskAspects(roleId, payload, setTaskAspectsDeferred);

        return setTaskAspectsDeferred;
      }
    };
  };

  return new TransactionAspectsModel();
});