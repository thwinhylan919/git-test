define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const AccountNumberDebitCardModel = function() {
    const baseService = BaseService.getInstance();
    let accountNumberDeferred;
    /**
     * Private method to fetch the severity levels created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function getAccountNumberData
     * @memberOf ErrorModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const getAccountNumberData = function(deferred) {
      const options = {
        url: "accounts/demandDeposit",
        success: function(status, jqXhr) {
          deferred.resolve(status, jqXhr);
        },
        error: function(status, jqXhr) {
          deferred.reject(status, jqXhr);
        }
      };

      baseService.fetch(options);
    };
    let debitCardNumberDeferred;
    /**
     * Private method to fetch the severity levels created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function getDebitCardNumberData
     * @memberOf ErrorModel
     * @param {string} account - An object type deferred
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const getDebitCardNumberData = function(account, deferred) {
      const options = {
          url: "accounts/demandDeposit/{account}/debitCards",
          success: function(status, jqXhr) {
            deferred.resolve(status, jqXhr);
          },
          error: function(status, jqXhr) {
            deferred.reject(status, jqXhr);
          }
        },
        params = {
          account: account
        };

      baseService.fetch(options, params);
    };

    return {
      /**
       * Public method to fetch list of account numbers. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function getAccountNumberData
       * @memberOf ServiceRequestsSearchModel
       * @returns {Object} - DeferredObject.
       * @example
       *       AccountNumberDebitCardModel.getAccountNumberData().done(function(data) {
       *
       *       });
       */
      getAccountNumberData: function() {
        accountNumberDeferred = $.Deferred();
        getAccountNumberData(accountNumberDeferred);

        return accountNumberDeferred;
      },
      /**
       * Public method to fetch list of applicable debit cards. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function getDebitCardNumberData
       * @memberOf ServiceRequestsSearchModel
       * @param {string} account - Account number.
       * @returns {Object} - DeferredObject.
       * @example
       *       AccountNumberDebitCardModel.getDebitCardNumberData(account).done(function(data) {
       *
       *       });
       */
      getDebitCardNumberData: function(account) {
        debitCardNumberDeferred = $.Deferred();
        getDebitCardNumberData(account, debitCardNumberDeferred);

        return debitCardNumberDeferred;
      }
    };
  };

  return new AccountNumberDebitCardModel();
});