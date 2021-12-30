define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Main file for Fund Infomation Model of mutual funds. This file contains the model definition
   * for list of moduleType and data fetched from the server through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   *
   * @namespace
   * @class FundInformationModel
   */
  const FundInformationModel = function() {
    const baseService = BaseService.getInstance();

    let schemesnapshotDeferred;

    /**
     * Private method to read fund info snapshot details .
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     * @function readSnapshot
     * @memberOf FundInformationModel
     * @param {String} schemeCode - payload to pass
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */

    const readSnapshot = function(schemeCode, deferred) {
      const options = {
          url: "schemes/{schemeCode}/snapshot",
          success: function(status, jqXhr) {
            deferred.resolve(status, jqXhr);
          },
          error: function(status, jqXhr) {
            deferred.reject(status, jqXhr);
          }
        },
        params = {
          schemeCode: schemeCode
        };

      baseService.fetch(options, params);
    };

    let schemeInvestmentDetailsDeferred;

    /**
     * Private method to read fund info snapshot details .
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     * @function fetchInvestmentDetails
     * @memberOf FundInformationModel
     * @param {String} schemeCode - payload to pass
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */

    const fetchInvestmentDetails = function(schemeCode, deferred) {
      const options = {
          url: "schemes/{schemeCode}/schemeInvestmentDetails",
          success: function(status, jqXhr) {
            deferred.resolve(status, jqXhr);
          },
          error: function(status, jqXhr) {
            deferred.reject(status, jqXhr);
          }
        },
        params = {
          schemeCode: schemeCode
        };

      baseService.fetch(options, params);
    };

    let schemeportfolioDeferred;

    /**
     * Private method to read fund info portfolio details .
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     * @function fetchSchemePortfolio
     * @memberOf FundInformationModel
     * @param {String} schemeCode - payload to pass
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */

    const fetchSchemePortfolio = function(schemeCode, deferred) {
      const options = {
          url: "schemes/{schemeCode}/portfolio",
          success: function(status, jqXhr) {
            deferred.resolve(status, jqXhr);
          },
          error: function(status, jqXhr) {
            deferred.reject(status, jqXhr);
          }
        },
        params = {
          schemeCode: schemeCode
        };

      baseService.fetch(options, params);
    };
    let schemePerformanceDeferred;

    /**
     * Private method to read fund info scheme performance details .
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     * @function fetchSchemePerformance
     * @memberOf FundInformationModel
     * @param {String} schemeCode - payload to pass
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */

    const fetchSchemePerformance = function(schemeCode, deferred) {
      const options = {
          url: "schemes/{schemeCode}/performance",
          success: function(status, jqXhr) {
            deferred.resolve(status, jqXhr);
          },
          error: function(status, jqXhr) {
            deferred.reject(status, jqXhr);
          }
        },
        params = {
          schemeCode: schemeCode
        };

      baseService.fetch(options, params);
    };

    return {
      /**
       * Public method to fetch list of severity Types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function readSnapshot
       * @memberOf FundInformationModel
       * @param {string} schemeCode - Payload to pass.
       * @returns {Object} - DeferredObject.
       * @example
       *       FundInformationModel.readSnapshot().done(function(data) {
       *
       *       });
       */
      readSnapshot: function(schemeCode) {
        schemesnapshotDeferred = $.Deferred();
        readSnapshot(schemeCode, schemesnapshotDeferred);

        return schemesnapshotDeferred;
      },
      /**
       * Public method to fetch list of severity Types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchInvestmentDetails
       * @memberOf FundInformationModel
       * @param {string} schemeCode - Payload to pass.
       * @returns {Object} - DeferredObject.
       * @example
       *       FundInformationModel.readSnapshot().done(function(data) {
       *
       *       });
       */
      fetchInvestmentDetails: function(schemeCode) {
        schemeInvestmentDetailsDeferred = $.Deferred();
        fetchInvestmentDetails(schemeCode, schemeInvestmentDetailsDeferred);

        return schemeInvestmentDetailsDeferred;
      },
      /**
       * Public method to fetch list of severity Types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchSchemePerformance
       * @memberOf FundInformationModel
       * @param {string} schemeCode - Payload to pass.
       * @returns {Object} - DeferredObject.
       * @example
       *       FundInformationModel.fetchSchemePerformance().done(function(data) {
       *
       *       });
       */
      fetchSchemePerformance: function(schemeCode) {
        schemePerformanceDeferred = $.Deferred();
        fetchSchemePerformance(schemeCode, schemePerformanceDeferred);

        return schemePerformanceDeferred;
      },
      /**
       * Public method to fetch list of severity Types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchSchemePortfolio
       * @memberOf FundInformationModel
       * @param {string} schemeCode - Payload to pass.
       * @returns {Object} - DeferredObject.
       * @example
       *       FundInformationModel.fetchSchemePortfolio().done(function(data) {
       *
       *       });
       */
      fetchSchemePortfolio: function(schemeCode) {
        schemeportfolioDeferred = $.Deferred();
        fetchSchemePortfolio(schemeCode, schemeportfolioDeferred);

        return schemeportfolioDeferred;
      }
    };
  };

  return new FundInformationModel();
});
