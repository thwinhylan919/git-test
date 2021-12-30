define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const DashboardModel = function() {
    const baseService = BaseService.getInstance();
    let fetchHoldingsDeferred;
    /**
     * Private method to fetch the account holdings
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchHoldings
     * @memberOf DashboardModel
     * @returns {void}
     * @private
     * @param {string} investmentAccountNumber - investment account number
     * @param {boolean} historic - redeemed funds
     * @param {Object} deferred - deferred object
     */
    const fetchHoldings = function(investmentAccountNumber, historic, deferred) {
      const option = {
          url: "accounts/investmentAccounts/{investmentAccountNumber}/holdings?historic={historic}",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          investmentAccountNumber: investmentAccountNumber,
          historic: historic
        };

      baseService.fetch(option, params);
    };
    let fetchRecommendationDeferred;
    /**
     * Private method to fetch the account holdings
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchRecommendation
     * @memberOf DashboardModel
     * @returns {void}
     * @private
     * @param {string} schemeCode - investment account number
     * @param {Object} deferred - deferred object
     */
    const fetchRecommendation = function(schemeCode, deferred) {
      const option = {
          url: "schemes/{schemeCode}/recommendation",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          schemeCode: schemeCode
        };

      baseService.fetch(option, params);
    };

    return {
      /**
       * Public method to fetch list of account holdings. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchRecommendation
       * @memberOf DashboardModel
       * @param {string} investmentAccountNumber - Investment account number.
       * @param {Object} - - Deferred object.
       * @returns {Object} - DeferredObject.
       * @example
       *       DashboardModel.fetchRecommendation().done(function(data) {
       *
       *       });
       */
      fetchRecommendation: function(schemeCode) {
        fetchRecommendationDeferred = $.Deferred();
        fetchRecommendation(schemeCode, fetchRecommendationDeferred);

        return fetchRecommendationDeferred;
      },
      /**
       * Public method to fetch list of account holdings. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchHoldings
       * @memberOf DashboardModel
       * @param {string} investmentAccountNumber - Investment account number.
       * @param {boolean} historic - Redeemed funds.
       * @param {Object} - - Deferred object.
       * @returns {Object} - DeferredObject.
       * @example
       *       DashboardModel.fetchHoldings().done(function(data) {
       *
       *       });
       */
      fetchHoldings: function(investmentAccountNumber, historic) {
        fetchHoldingsDeferred = $.Deferred();
        fetchHoldings(investmentAccountNumber, historic, fetchHoldingsDeferred);

        return fetchHoldingsDeferred;
      }
    };
  };

  return new DashboardModel();
});
