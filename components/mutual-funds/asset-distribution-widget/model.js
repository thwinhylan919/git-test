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
        url: "investmentAccounts",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(accounts);
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
      }
    };
  };

  return new DashboardModel();
});