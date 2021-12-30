define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Main file for Dividend Reports Model. This file contains the model definition
   * for list of moduleType and data fetched from the server through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   *
   * @namespace
   * @class DividendReportsModel
   */
  const DividendReportsModel = function() {
    const baseService = BaseService.getInstance();

    let investmentAccountDeferred;

    /**
     * Private method to fetch investment accounts
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     * @function fetchInvestmentAccounts
     * @memberOf ErrorModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */

    const fetchInvestmentAccounts = function(deferred) {
      const options = {
        url: "accounts/investmentAccounts",
        success: function(status, jqXhr) {
          deferred.resolve(status, jqXhr);
        },
        error: function(status, jqXhr) {
          deferred.reject(status, jqXhr);
        }
      };

      baseService.fetch(options);
    };

    let fundHousesDeferred;

    /**
     * Private method to fetch all fund house data.
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     * @function fetchAllFundHouse
     * @memberOf ErrorModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */

    const fetchAllFundHouse = function(deferred) {
      const
        options = {
          url: "fundHouses",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options);
    };

    let fundHouseDeferred;

    /**
     * Private method to fetch the fund houses based on particular investment id.
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     * @function fetchFundHouse
     * @memberOf ErrorModel
     * @param {String} investmentAccountId - An object type String
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */

    const fetchFundHouse = function(investmentAccountId, deferred) {
      const
        options = {
          url: "accounts/investmentAccounts/{investmentAccountId}/holdings",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },

        params = {
          investmentAccountId: investmentAccountId
        };

      baseService.fetch(options, params);
    };

    let schemeNameDeferred;

    /**
     * Private method to fetch the scheme details based on particular investment id.
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     * @function fetchSchemeName
     * @memberOf ErrorModel
     * @param {String} investmentAccountId - An object type String
     * @param {String} fundHouseCode - An object type String
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */

    const fetchSchemeName = function(investmentAccountId, fundHouseCode, deferred) {
      const
        options = {
          url: "accounts/investmentAccounts/{investmentAccountId}/holdings?fundhouseCode={fundHouseCode}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },

        params = {
          investmentAccountId: investmentAccountId,
          fundHouseCode: fundHouseCode
        };

      baseService.fetch(options, params);
    };

    let dividendReportDeferred;

    /**
     * Private method to fetch the Category types created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     * @function fetchDividendReports
     * @memberOf ErrorModel
     * @param {String} investmentAccount - payload to pass
     * @param {String} fundHouseCode - An object type String
     * @param {String} schemeCode -  An object type String
     * @param {Date} fromDate - An object type Date
     * @param {Date} toDate - An object type Date
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */

    const fetchDividendReports = function(investmentAccount, fundHouseCode, schemeCode, fromDate, toDate, deferred) {
      const
        options = {
          url: "accounts/investmentAccounts/{investmentAccountId}/dividendReports?fundHouseCode={fundHouseCode}&schemeCode={schemeCode}&fromDate={fromDate}&toDate={toDate}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },

        params = {
          investmentAccountId: investmentAccount,
          fundHouseCode: fundHouseCode,
          schemeCode: schemeCode,
          fromDate: fromDate,
          toDate: toDate
        };

      baseService.fetch(options, params);
    };

    let fetchPDFDeferred;
    /**
     * Private method to fetch the Category types created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchPDF
     * @memberOf ErrorModel
     * @param {string} investmentAccount - payload to pass
     * @param {string} fundHouseCode - An object type String
     * @param {string} schemeCode -  An object type String
     * @param {Date} fromDate - An object type Date
     * @param {Date} toDate - An object type Date
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchPDF = function(investmentAccount, fundHouseCode, schemeCode, fromDate, toDate, deferred) {
      const
        options = {
          url: "accounts/investmentAccounts/{investmentAccountId}/dividendReports?fundHouseCode={fundHouseCode}&schemeCode={schemeCode}&fromDate={fromDate}&toDate={toDate}&media=application/pdf&mediaFormat=pdf",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },

        params = {
          investmentAccountId: investmentAccount,
          fundHouseCode: fundHouseCode,
          schemeCode: schemeCode,
          fromDate: fromDate,
          toDate: toDate
        };

      baseService.downloadFile(options, params);
    };

    return {
      /**
       * Public method to fetch list of severity Types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchInvestmentAccounts
       * @memberOf ServiceRequestsSearchModel
       * @returns {Object} - DeferredObject.
       * @example
       *       ServiceRequestsGlobalModel.fetchInvestmentAccounts().done(function(data) {
       *
       *       });
       */
      fetchInvestmentAccounts: function() {
        investmentAccountDeferred = $.Deferred();
        fetchInvestmentAccounts(investmentAccountDeferred);

        return investmentAccountDeferred;
      },
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchFundHouse
       * @memberOf PurchaseMutualFundModel
       * @param {string} investmentAccountId - Payload to pass.
       * @returns {Object} - DeferredObject.
       * @example
       *       DividendReportsModel.fetchFundHouse().done(function(data) {
       *
       *       });
       */
      fetchFundHouse: function(investmentAccountId) {
        fundHouseDeferred = $.Deferred();
        fetchFundHouse(investmentAccountId, fundHouseDeferred);

        return fundHouseDeferred;
      },

      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchAllFundHouse
       * @memberOf PurchaseMutualFundModel
       * @returns {Object} - DeferredObject.
       * @example
       *       DividendReportsModel.fetchAllFundHouse().done(function(data) {
       *
       *       });
       */
      fetchAllFundHouse: function() {
        fundHousesDeferred = $.Deferred();
        fetchAllFundHouse(fundHousesDeferred);

        return fundHousesDeferred;
      },

      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchDividendReports
       * @memberOf PurchaseMutualFundModel
       * @param {string} investmentAccountId - Payload to pass.
       * @param {string} fundHouseCode - An object type String.
       * @param {string} schemeCode -  An object type String.
       * @param {Date} fromDate - An object type Date.
       * @param {Date} toDate - An object type Date.
       * @param {Object} deferred - An object type deferred.
       * @returns {Object} - DeferredObject.
       * @example
       *       DividendReportsModel.fetchDividendReports().done(function(data) {
       *
       *       });
       */
      fetchDividendReports: function(investmentAccountId, fundHouseCode, schemeCode, fromDate, toDate) {
        dividendReportDeferred = $.Deferred();
        fetchDividendReports(investmentAccountId, fundHouseCode, schemeCode, fromDate, toDate, dividendReportDeferred);

        return dividendReportDeferred;
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
       * @param {string} fundHouseCode - An object type String.
       * @param {string} schemeCode -  An object type String.
       * @param {Date} fromDate - An object type Date.
       * @param {Date} toDate - An object type Date.
       * @param {Object} deferred - An object type deferred.
       * @returns {Object} - DeferredObject.
       * @example
       *       DividendReportsModel.fetchPDF().done(function(data) {
       *
       *       });
       */
      fetchPDF: function(investmentAccountId, fundHouseCode, schemeCode, fromDate, toDate) {
        fetchPDFDeferred = $.Deferred();
        fetchPDF(investmentAccountId, fundHouseCode, schemeCode, fromDate, toDate, fetchPDFDeferred);

        return fetchPDFDeferred;
      },
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchSchemeName
       * @memberOf DividendReportsModel
       * @param {string} investmentAccountId - Payload to pass.
       * @param {string} fundHouseCode - For request to be updated.
       * @returns {Object} - DeferredObject.
       * @example
       *       DividendReportsModel.fetchSchemeName(fundHouseCode).done(function(data) {
       *
       *       });
       */
      fetchSchemeName: function(investmentAccountId, fundHouseCode) {
        schemeNameDeferred = $.Deferred();
        fetchSchemeName(investmentAccountId, fundHouseCode, schemeNameDeferred);

        return schemeNameDeferred;
      }
    };
  };

  return new DividendReportsModel();
});
