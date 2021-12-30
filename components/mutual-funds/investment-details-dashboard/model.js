define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const DashboardModel = function() {
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
    const getInvestmentAccounts = function(deferred) {
      const accounts = {
        url: "accounts/investmentAccounts",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(accounts);
    };
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
     * @param {Object} deferred - deferred object
     */
    const fetchHoldings = function(investmentAccountNumber, deferred) {
      const option = {
          url: "accounts/investmentAccounts/{investmentAccountNumber}/holdings",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          investmentAccountNumber: investmentAccountNumber
        };

      baseService.fetch(option, params);
    };
    let fetchDividendsListDeferred;
    /**
     * Private method to fetch the account holdings
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchHoldings
     * @memberOf DashboardModel
     * @returns {void}
     * @private
     * @param {string} investmentAccountNumber - investment account number
     * @param {Object} deferred - deferred object
     */
    const fetchDividends = function(investmentAccountNumber, deferred) {
      const option = {
          url: "accounts/investmentAccounts/{investmentAccountNumber}/holdings/dividends",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          investmentAccountNumber: investmentAccountNumber
        };

      baseService.fetch(option, params);
    };
    let fetchRecurringListDeferred;
    /**
     * Private method to fetch the account holdings
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchHoldings
     * @memberOf DashboardModel
     * @returns {void}
     * @private
     * @param {string} investmentAccountNumber - investment account number
     * @param {Object} deferred - deferred object
     */
    const fetchRecurring = function(investmentAccountNumber, deferred) {
      const option = {
          url: "accounts/investmentAccounts/{investmentAccountNumber}/holdings/recurring",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          investmentAccountNumber: investmentAccountNumber
        };

      baseService.fetch(option, params);
    };
    let fetchPerformanceListDeferred;
    /**
     * Private method to fetch the account holdings
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchHoldings
     * @memberOf DashboardModel
     * @returns {void}
     * @private
     * @param {string} investmentAccountNumber - investment account number
     * @param {Object} deferred - deferred object
     */
    const fetchPerformanceList = function(investmentAccountNumber, deferred) {
      const option = {
          url: "accounts/investmentAccounts/{investmentAccountNumber}/holdings/performances",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          investmentAccountNumber: investmentAccountNumber
        };

      baseService.fetch(option, params);
    };
    let fetchPDFDeferred;
    /**
     * Private method to fetch the Category types created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchPDF
     * @memberOf ErrorModel
     * @param {string} investmentAccount - payload to pass
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchPDF = function(investmentAccount, deferred) {
      const
        options = {
          url: "accounts/investmentAccounts/{investmentAccountId}/portfolio?media=application/pdf&mediaFormat=pdf",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },

        params = {
          investmentAccountId: investmentAccount
        };

      baseService.downloadFile(options, params);
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
    const fetchAccountSummary = function(investmentAccountNumber, deferred) {
      const
        options = {
          url: "accounts/investmentAccounts/{investmentAccountNumber}/summary",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          investmentAccountNumber: investmentAccountNumber
        };

      baseService.fetch(options, params);
    };
    let fetchAccountDetailsDeferred;
    /**
     * Private method to fetch investment account details for particular investment account
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchAccountDetails
     * @memberOf DashboardModel
     * @param {string} investmentAccountNumber - An object type string
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchAccountDetails = function(investmentAccountNumber, deferred) {
      const
        options = {
          url: "accounts/investmentAccounts/{investmentAccountNumber}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          investmentAccountNumber: investmentAccountNumber
        };

      baseService.fetch(options, params);
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
      getInvestmentAccounts: function() {
        investmentAccountsDeffered = $.Deferred();
        getInvestmentAccounts(investmentAccountsDeffered);

        return investmentAccountsDeffered;
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
       * @param {Object} - - Deferred object.
       * @returns {Object} - DeferredObject.
       * @example
       *       DashboardModel.fetchHoldings().done(function(data) {
       *
       *       });
       */
      fetchHoldings: function(investmentAccountNumber) {
        fetchHoldingsDeferred = $.Deferred();
        fetchHoldings(investmentAccountNumber, fetchHoldingsDeferred);

        return fetchHoldingsDeferred;
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
       * @param {Object} - - Deferred object.
       * @returns {Object} - DeferredObject.
       * @example
       *       DashboardModel.fetchDividends().done(function(data) {
       *
       *       });
       */
      fetchDividends: function(investmentAccountNumber) {
        fetchDividendsListDeferred = $.Deferred();
        fetchDividends(investmentAccountNumber, fetchDividendsListDeferred);

        return fetchDividendsListDeferred;
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
       * @param {Object} - - Deferred object.
       * @returns {Object} - DeferredObject.
       * @example
       *       DashboardModel.fetchPerformanceList().done(function(data) {
       *
       *       });
       */
      fetchPerformanceList: function(investmentAccountNumber) {
        fetchPerformanceListDeferred = $.Deferred();
        fetchPerformanceList(investmentAccountNumber, fetchPerformanceListDeferred);

        return fetchPerformanceListDeferred;
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
       * @param {Object} - - Deferred object.
       * @returns {Object} - DeferredObject.
       * @example
       *       DashboardModel.fetchRecurring().done(function(data) {
       *
       *       });
       */
      fetchRecurring: function(investmentAccountNumber) {
        fetchRecurringListDeferred = $.Deferred();
        fetchRecurring(investmentAccountNumber, fetchRecurringListDeferred);

        return fetchRecurringListDeferred;
      },
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchPDF
       * @memberOf PurchaseMutualFundModel
       * @param {string} investmentAccountId - Payload to pass.
       * @param {Object} deferred - An object type deferred.
       * @returns {Object} - DeferredObject.
       * @example
       *       DashboardModel.fetchPDF().done(function(data) {
       *
       *       });
       */
      fetchPDF: function(investmentAccountId) {
        fetchPDFDeferred = $.Deferred();
        fetchPDF(investmentAccountId, fetchPDFDeferred);

        return fetchPDFDeferred;
      },
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
      fetchAccountSummary: function(investmentAccountNumber) {
        fetchAccountSummaryDeferred = $.Deferred();
        fetchAccountSummary(investmentAccountNumber, fetchAccountSummaryDeferred);

        return fetchAccountSummaryDeferred;
      },
      /**
       * Public method to fetch investment account details for particular investment account.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchAccountDetails
       * @memberOf DashboardModel
       * @param {string} investmentAccountNumber - Investment account number.
       * @returns {Object} - DeferredObject.
       * @example
       *       DashboardModel.fetchAccountDetails(investmentAccountNumber).done(function(data) {
       *
       *       });
       */
      fetchAccountDetails: function(investmentAccountNumber) {
        fetchAccountDetailsDeferred = $.Deferred();
        fetchAccountDetails(investmentAccountNumber, fetchAccountDetailsDeferred);

        return fetchAccountDetailsDeferred;
      }
    };
  };

  return new DashboardModel();
});
