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
  const TopBottomFundsModel = function() {
    const baseService = BaseService.getInstance();
    let fundsDeferred;
    /**
     * Private method to fetch the Category types created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchTopFunds
     * @memberOf ErrorModel
     * @param {boolean} isAscending - An object type deferred
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchTopFunds = function(isAscending, deferred) {
      const
        options = {
          url: "accounts/investmentAccounts/holdings?isAscending={isAscending}&count=2",
          mockedUrl: "framework/json/design-dashboard/mutual-funds/top-bottom-funds.json",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },

        params = {
          isAscending: isAscending
        };

      baseService.fetchWidget(options, params);
    };

    return {
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchTopFunds
       * @memberOf TopBottomFundsModel
       * @param {boolean} isAscending - An object type deferred.
       * @returns {Object} - DeferredObject.
       * @example
       *       PurchaseMutualFund.fetchTopFunds(isAscending).done(function(data) {
       *
       *       });
       */
      fetchTopFunds: function(isAscending) {
        fundsDeferred = $.Deferred();
        fetchTopFunds(isAscending, fundsDeferred);

        return fundsDeferred;
      }
    };
  };

  return new TopBottomFundsModel();
});
