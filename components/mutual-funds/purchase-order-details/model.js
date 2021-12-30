define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Main file for Service Request Create Model. This file contains the model definition
   * for list of moduleType and data fetched from the server through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   *
   * @namespace
   * @class ServiceRequestsCreateModel
   */
  const PurchaseMutualFundModel = function() {
    const baseService = BaseService.getInstance();
    let mockDataDeferred;
    /**
     * Private method to fetch the Category types created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchMockData
     * @memberOf ErrorModel
     * @param {string} accountId - An object type deferred
     * @param {string} fundHouseCode - An object type deferred
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchMockData = function(accountId,fundHouseCode,deferred) {
      const
      options = {
        url: "accounts/investmentAccounts/{accountId}/folios?fundHouseCode={fundHouseCode}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      },

params = {
        accountId: accountId,
        fundHouseCode: fundHouseCode
      };

      baseService.fetch(options,params);
    };

    return {
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchMockData
       * @memberOf PurchaseMutualFundModel
       * @param {string} accountId - An object type deferred.
       * @param {string} fundHouseCode - An object type deferred.
       * @returns {Object} - DeferredObject.
       * @example
       *       PurchaseMutualFund.fetchMockData(accountId,fundHouseCode).done(function(data) {
       *
       *       });
       */
      fetchMockData: function(accountId,fundHouseCode) {
        mockDataDeferred = $.Deferred();
        fetchMockData(accountId,fundHouseCode,mockDataDeferred);

        return mockDataDeferred;
      }
    };
  };

  return new PurchaseMutualFundModel();
});
