define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const PortfolioSummaryModel = function () {
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
        url: "accounts/investmentAccounts/summary",
        mockedUrl: "framework/json/design-dashboard/mutual-funds/portfolio-summary.json",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetchWidget(option);
    };

    return {
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

  return new PortfolioSummaryModel();
});