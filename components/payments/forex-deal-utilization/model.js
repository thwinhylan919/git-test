/** Model for fores deal booking
 * @param {object} BaseService base service instance
 * @return {object} forexDealBookingModel
 */
define([
  "baseService"
], function(BaseService) {
  "use strict";

  /**
   * In case more than one instance of forexDealBookingModel is required,
   * we are declaring model as a function, of which new instances can be created and
   * used when required.
   *
   * @class forexDealBookingModel
   * @private
   */
  const forexDealBookingModel = function() {
    const baseService = BaseService.getInstance();

    return {
      /**
       * Fetches forex deals list for the user.
       *
       * @param {string} currency - - - - - - - - - - - - - Contains selected currency for filter.
       * @param {string} currency2 Contains selected currency for filter.
       * @param {String} dealId Contains selected currency for filter.
       * @returns {Promise}  Returns the promise object.
       */
      fetchForexDealList: function(currency, currency2, dealId) {
        return baseService.fetch({
          url: "forexDeals?currency={currency}&currency2={currency2}&dealId={dealId}"
        }, {
          currency: currency,
          currency2: currency2,
          dealId: dealId
        });
      },
      /**
       * Fetches forex deal for the user.
       *
       * @param {string} dealId - Contains selected currency for filter.
       * @returns {Promise}  Returns the promise object.
       */
      fetchForexDeal: function(dealId) {
        return baseService.fetch({
          url: "forexDeals/{dealId}"
        }, {
          dealId: dealId
        });
      }
    };
  };

  return new forexDealBookingModel();
});