/**
 * Model for review-task-aspect
 * @param1 {object} jquery jquery instance
 * @param2 {object} BaseService base service instance for server communication
 * @return {object} TransactionAspectsModel Modal instance
 */
define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const TransactionAspectsModel = function () {
    const Model = function () {
      this.payload = {
        aspects: []
      };
    },
      /**
      * baseService instance through which all the rest calls will be made.
      *
      * @attribute baseService
      * @type {Object} BaseService Instance
      * @private
      */
      baseService = BaseService.getInstance();
    /**
    * getTransactionsDeferred - get list of transactions.
    * @param  {type} deferred deferred object
    */
    let getTransactionsDeferred;
    const getTransactions = function (deferred) {
      const options = {
        url: "resourceTasks?view=list",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    /**
     * searchTransactionsDeffered - search transactions on the basis of taskID.
     * @param  {Object} taskID  unique identifier of the task.
     * @param  {type} deferred deferred object
     */
    let searchTransactionsDeffered;
    const searchTransactions = function (deferred, taskID) {
      const params = {
        taskId: taskID
      },
        options = {
          url: "resourceTasks/{taskId}",
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
     * setTaskAspectsDeferred - setting task aspects.
     * @param  {Object} taskID  unique identifier of the task.
     * @param  {Object} payload contains payload information.
     * @param  {type} deferred deferred object
     */
    let setTaskAspectsDeferred;
    const setTaskAspects = function (taskId, payload, deferred) {
      const params = {
        taskId: taskId
      },
        options = {
          url: "resourceTasks/{taskId}",
          data: payload,
          success: function (data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function (data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };

      baseService.patch(options, params);
    };

    return {
      /**
       * Method to get new modal instance.
       *
       * @param  {Object} modelData - Payload to be passed.
       * @returns {Object}  Returns the modelData.
       */
      getNewModel: function (modelData) {
        return new Model(modelData);
      },
      /**
       * GetTransactions - get list of transactions.
       *
       * @returns {getTransactionsDeferred}  Returns the deferred object.
       */
      getTransactions: function () {
        getTransactionsDeferred = $.Deferred();
        getTransactions(getTransactionsDeferred);

        return getTransactionsDeferred;
      },
      /**
       * SearchTransactions - get list of transactions.
       *
       * @param  {string} taskId - Unique identifier of the task.
       * @returns {searchTransactionsDeffered}  Returns the deferred object.
       */
      searchTransactions: function (taskId) {
        searchTransactionsDeffered = $.Deferred();
        searchTransactions(searchTransactionsDeffered, taskId);

        return searchTransactionsDeffered;
      },
      /**
       * SetTaskAspects - setting task aspects.
       *
       * @param  {string} roleId - Unique identifier of the task.
       * @param  {string} payload - Contains payload information.
       * @returns {setTaskAspectsDeferred}  Returns the deferred object.
       */
      setTaskAspects: function (roleId, payload) {
        setTaskAspectsDeferred = $.Deferred();
        setTaskAspects(roleId, payload, setTaskAspectsDeferred);

        return setTaskAspectsDeferred;
      }
    };
  };

  return new TransactionAspectsModel();
});