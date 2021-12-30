define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  /**
   * Main file for redeem fund details Model<br/><br/>
   * The injected Model Class will have below properties:
   *
   * @namespace
   * @class RedeemFundDetailsModel
   */
  const RedeemFundDetailsModel = function () {
    const baseService = BaseService.getInstance();
    let fetchDataDeferred;
    /**
     * Private method to fetch the account holdings
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchData
     * @memberOf RedeemFundDetailsModel
     * @returns {void}
     * @private
     * @param {string} investmentAccountNumber - investment account number
     * @param {string} fundHouseCode - fund house code
     * @param {string} schemeCode - scheme code
     * @param {Object} deferred - deferred object
     */
    const fetchData = function (investmentAccountNumber, fundHouseCode, schemeCode, deferred) {
      const option = {
          url: "accounts/investmentAccounts/{investmentAccountNumber}/holdings?fundHouseCode={fundHouseCode}&schemeCode={schemeCode}",
          success: function (data) {
            deferred.resolve(data);
          }
        },

        params = {
          investmentAccountNumber: investmentAccountNumber,
          fundHouseCode: fundHouseCode,
          schemeCode: schemeCode
        };

      baseService.fetch(option, params);
    };

    return {
      /**
       * Public method to fetch list of Service Requests. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchData
       * @memberOf ServiceRequestsTrackModel
       * @param {string} investmentAccountNumber - Investment account number.
       * @param {string} fundHouseCode - Fund house code.
       * @param {string} schemeCode - Scheme code.
       * @param {Object} - - Deferred object.
       * @returns {Object} - DeferredObject.
       * @example
       *       RedeemFundDetailsModel.fetchData().done(function(data) {
       *
       *       });
       */
      fetchData: function (investmentAccountNumber, fundHouseCode, schemeCode) {
        fetchDataDeferred = $.Deferred();
        fetchData(investmentAccountNumber, fundHouseCode, schemeCode, fetchDataDeferred);

        return fetchDataDeferred;
      }
    };
  };

  return new RedeemFundDetailsModel();
});