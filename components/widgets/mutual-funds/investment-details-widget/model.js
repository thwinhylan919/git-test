define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const InvestmentAllocationModel = function () {
    const baseService = BaseService.getInstance();
    let fetchInvestmentSummaryDeferred;
    /**
     * Private method to fetch the account holdings
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchInvestmentSummary
     * @memberOf DashboardModel
     * @returns {void}
     * @private
     * @param {Object} deferred - deferred object
     */
    const fetchInvestmentSummary = function (deferred) {
      const option = {
          url: "accounts/investmentAccounts",
          mockedUrl: "framework/json/design-dashboard/mutual-funds/investment-details/investment-accounts.json",
          success: function (data) {
            deferred.resolve(data);
          }
        };

      baseService.fetchWidget(option);
    };
    let fetchAccountSummaryDeferred;
    /**
     * Private method to fetch investment account summary for particular investment account
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchAccountSummary
     * @memberOf DashboardModel
     * @param {string} investmentAccountNumber - An object type string
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchAccountSummary = function (investmentAccountNumber, deferred) {
      const
        options = {
          url: "accounts/investmentAccounts/{investmentAccountNumber}/summary",
          mockedUrl: "framework/json/design-dashboard/mutual-funds/investment-details/account-summary.json",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        },
        params = {
          investmentAccountNumber: investmentAccountNumber
        };

      baseService.fetchWidget(options, params);
    };

    return {
      /**
       * Public method to fetch investment account summary for particular investment account.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchAccountSummary
       * @memberOf DashboardModel
       * @param {string} investmentAccountNumber - Investment account number.
       * @returns {Object} - DeferredObject.
       * @example
       *       DashboardModel.fetchAccountSummary(investmentAccountNumber).done(function(data) {
       *
       *       });
       */
      fetchAccountSummary: function (investmentAccountNumber) {
        fetchAccountSummaryDeferred = $.Deferred();
        fetchAccountSummary(investmentAccountNumber, fetchAccountSummaryDeferred);

        return fetchAccountSummaryDeferred;
      },
      /**
       * Public method to fetch list of account holdings. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchInvestmentSummary
       * @memberOf DashboardModel
       * @param {Object} - - Deferred object.
       * @returns {Object} - DeferredObject.
       * @example
       *       DashboardModel.fetchInvestmentSummary().done(function(data) {
       *
       *       });
       */
      fetchInvestmentSummary: function () {
        fetchInvestmentSummaryDeferred = $.Deferred();
        fetchInvestmentSummary(fetchInvestmentSummaryDeferred);

        return fetchInvestmentSummaryDeferred;
      }
    };
  };

  return new InvestmentAllocationModel();
});
