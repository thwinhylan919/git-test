/**
 */
define([

  "baseService"
], function(BaseService) {
  "use strict";

  const TransactionGroupSearchModel = function() {
    const baseService = BaseService.getInstance();

    return {
      /**
       * SearchTransactionGroup - fetches the Transaction groups.
       *
       * @param  {string} taskAspect - For Transaction group.
       * @param  {string} transactionGroupCode - Code for Transaction group.
       * @param  {string} transactionGroupDesc - Description for Transaction group.
       * @returns {Promise}  Returns the promise object.
       */
      searchTransactionGroup: function(taskAspect, transactionGroupCode, transactionGroupDesc) {
        const params = {
            name: transactionGroupCode,
            description: transactionGroupDesc,
            taskAspect: taskAspect
          },
          options = {
            url: "taskGroups?name={name}&description={description}&taskAspect={taskAspect}"
          };

        return baseService.fetch(options, params);
      }
    };
  };

  return new TransactionGroupSearchModel();
});