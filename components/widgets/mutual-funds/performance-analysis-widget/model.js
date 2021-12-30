define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const performanceAnalysisModel = function () {
    const baseService = BaseService.getInstance();
    let fetchInvestmentAccountsDeferred;
    /**
     * Private method to fetch the list of investment accounts
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchInvestmentAccounts
     * @memberOf performanceAnalysisModel
     * @returns {void}
     * @private
     * @param {Object} deferred - deferred object
     */
    const fetchInvestmentAccounts = function (deferred) {
      const option = {
        url: "accounts/investmentAccounts",
        mockedUrl: "framework/json/design-dashboard/mutual-funds/performance-analysis/investment-accounts.json",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetchWidget(option);
    };
    let fetchPerformanceDeferred;
    /**
     * Private method to fetch performance analysis for particular investment account
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchPerformance
     * @memberOf performanceAnalysisModel
     * @param {string} investmentAccountNumber - An object type string
     * @param {string} dataCount - An object type string
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchPerformance = function (investmentAccountNumber, dataCount, deferred) {
      const
        options = {
          url: "accounts/investmentAccounts/{investmentAccountNumber}/performance?dataCount={dataCount}",
          mockedUrl: "framework/json/design-dashboard/mutual-funds/performance-analysis/performance-data.json",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        },
        params = {
          investmentAccountNumber: investmentAccountNumber,
          dataCount: dataCount
        };

      baseService.fetchWidget(options, params);
    };

    return {
      /**
       * Public method to fetch investment account performance data for particular investment account.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchPerformance
       * @memberOf performanceAnalysisModel
       * @param {string} investmentAccountNumber - Investment account number.
       * @param {string} dataCount - Data count.
       * @returns {Object} - DeferredObject.
       * @example
       *       performanceAnalysisModel.fetchPerformance(investmentAccountNumber, dataCount).done(function(data) {
       *
       *       });
       */
      fetchPerformance: function (investmentAccountNumber, dataCount) {
        fetchPerformanceDeferred = $.Deferred();
        fetchPerformance(investmentAccountNumber, dataCount, fetchPerformanceDeferred);

        return fetchPerformanceDeferred;
      },
      /**
       * Public method to fetch list of investment accounts. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchInvestmentAccounts
       * @memberOf performanceAnalysisModel
       * @param {Object} - - Deferred object.
       * @returns {Object} - DeferredObject.
       * @example
       *       performanceAnalysisModel.fetchInvestmentAccounts().done(function(data) {
       *
       *       });
       */
      fetchInvestmentAccounts: function () {
        fetchInvestmentAccountsDeferred = $.Deferred();
        fetchInvestmentAccounts(fetchInvestmentAccountsDeferred);

        return fetchInvestmentAccountsDeferred;
      }
    };
  };

  return new performanceAnalysisModel();
});