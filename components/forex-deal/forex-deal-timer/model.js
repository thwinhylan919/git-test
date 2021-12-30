/**
 * Model for review-forex-deal-create
 * @param {object} BaseService
 * @return {object} forexDealModel
 */
define([
  "baseService"
], function(BaseService) {
  "use strict";

  /**
   * In case more than one instance of forexDealModel is required,
   * we are declaring model as a function, of which new instances can be created and
   * used when required.
   *
   * @class forexDealTimerModel
   * @private
   */
  const forexDealTimerModel = function() {
    const baseService = BaseService.getInstance();

    return {
      /**
       * Fetches timer flag.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchTimerDetails: function() {
        return baseService.fetch({
          url: "maintenances/forex"
        });
      },
      /**
       * Fetches currencyPairs.
       *
       * @param {Object} data - Data containing curequest details.
       * @returns {Promise}  Returns the promise object.
       */
      getCurrencyPairs: function(data) {
        return baseService.fetch({
          url: "forexDeals/configurations?currency1={ccy1}&currency2={ccy2}"
        }, {
          ccy1: data.curr1,
          ccy2: data.curr2
        });
      },
      /**
       * Fetches exchangeRate.
       *
       * @param {Object} data - Data containing exchange rate request details.
       * @returns {Promise}  Returns the promise object.
       */
      getExchangeRate: function(data) {
        return baseService.fetch({
          url: "forex/rates?branchCode={branchCode}&ccy1Code={ccy1}&ccy2Code={ccy2}"
        }, {
          branchCode: data.branchCode,
          ccy1: data.curr1,
          ccy2: data.curr2
        });
      }
    };
  };

  return new forexDealTimerModel();
});