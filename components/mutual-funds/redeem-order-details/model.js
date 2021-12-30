define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  /**
   * Main file for Redeem order details Model. <br/><br/>
   * The injected Model Class will have below properties:
   *
   * @namespace
   * @class RedeemOrderDetailsModel
   */
  const RedeemOrderDetailsModel = function () {
    const baseService = BaseService.getInstance();
    let schemeDetailsDeferred;
    /**
     * Private method to fetch the scheme details
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchSchemeDetails
     * @memberOf RedeemOrderDetailsModel
     * @param {string} schemeCode - An object type string
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchSchemeDetails = function (schemeCode, deferred) {
      const
        options = {
          url: "schemes/{schemeCode}",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        },

        params = {
          schemeCode: schemeCode
        };

      baseService.fetch(options, params);
    };
    let holdingDetailsDeferred;
    /**
     * Private method to fetch account holding details
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchHoldingDetails
     * @memberOf RedeemOrderDetailsModel
     * @param {string} investmentAccountNumber - An object type string
     * @param {string} accountHoldingId - An object type string
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchHoldingDetails = function (investmentAccountNumber, accountHoldingId, deferred) {
      const
        options = {
          url: "accounts/investmentAccounts/{investmentAccountNumber}/holdings/{accountHoldingId}",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        },
        params = {
          investmentAccountNumber: investmentAccountNumber,
          accountHoldingId: accountHoldingId
        };

      baseService.fetch(options, params);
    };

    return {
      /**
       * Public method to fetch scheme details. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchSchemeDetails
       * @memberOf RedeemOrderDetailsModel
       * @param {string} schemeCode - Scheme code.
       * @returns {Object} - DeferredObject.
       * @example
       *       RedeemOrderDetailsModel.fetchSchemeDetails(schemeCode).done(function(data) {
       *
       *       });
       */
      fetchSchemeDetails: function (schemeCode) {
        schemeDetailsDeferred = $.Deferred();
        fetchSchemeDetails(schemeCode, schemeDetailsDeferred);

        return schemeDetailsDeferred;
      },
      /**
       * Public method to fetch scheme details. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchHoldingDetails
       * @memberOf RedeemOrderDetailsModel
       * @param {string} investmentAccountNumber - An object type string.
       * @param {string} accountHoldingId - An object type string.
       * @returns {Object} - DeferredObject.
       * @example
       *       RedeemOrderDetailsModel.fetchHoldingDetails(investmentAccountNumber, accountHoldingId).done(function(data) {
       *
       *       });
       */
      fetchHoldingDetails: function (investmentAccountNumber, accountHoldingId) {
        holdingDetailsDeferred = $.Deferred();
        fetchHoldingDetails(investmentAccountNumber, accountHoldingId, holdingDetailsDeferred);

        return holdingDetailsDeferred;
      }
    };
  };

  return new RedeemOrderDetailsModel();
});