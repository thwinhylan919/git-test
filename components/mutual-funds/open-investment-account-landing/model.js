define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const DashboardModel = function () {
    const baseService = BaseService.getInstance();
    let investmentAccountsDeffered;
    /**
     * Private method to fetch the list of investment accounts
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function getInvestmentAccounts
     * @memberOf DashboardModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const getInvestmentAccounts = function (deferred) {
      const accounts = {
        url: "accounts/investmentAccounts",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(accounts);
    };
    let fetchMaintanaceDetailsDeferred;
    /**
     * Private method to fetch investment account details for particular investment account
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchMaintanaceDetails
     * @memberOf DashboardModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchMaintanaceDetails = function (deferred) {
      const
        options = {
          url: "maintenances/mutualfunds",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options);
    };

    return {
      /**
       * Public method to fetch list of investment accounts. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function getInvestmentAccounts
       * @memberOf DashboardModel
       * @returns {Object} - DeferredObject.
       * @example
       *       DashboardModel.getInvestmentAccounts().done(function(data) {
       *
       *       });
       */
      getInvestmentAccounts: function () {
        investmentAccountsDeffered = $.Deferred();
        getInvestmentAccounts(investmentAccountsDeffered);

        return investmentAccountsDeffered;
      },
      /**
       * Public method to fetch investment account details for particular investment account.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchMaintanaceDetails
       * @memberOf DashboardModel
       * @returns {Object} - DeferredObject.
       * @example
       *       DashboardModel.fetchMaintanaceDetails().done(function(data) {
       *
       *       });
       */
      fetchMaintanaceDetails: function () {
        fetchMaintanaceDetailsDeferred = $.Deferred();
        fetchMaintanaceDetails(fetchMaintanaceDetailsDeferred);

        return fetchMaintanaceDetailsDeferred;
      }
    };
  };

  return new DashboardModel();
});
