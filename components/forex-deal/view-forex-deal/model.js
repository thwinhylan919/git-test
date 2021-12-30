/** Model for view fores deals list
 * @param {object} BaseService base service instance
 * @return {object} viewForexDealModel
 */
define([
  "baseService"
], function(BaseService) {
  "use strict";

  /**
   * In case more than one instance of viewForexDealModel is required,
   * we are declaring model as a function, of which new instances can be created and
   * used when required.
   *
   * @class viewForexDealModel
   * @private
   */
  const viewForexDealModel = function() {
    const baseService = BaseService.getInstance();

    return {
      /**
       * Fetches forex deals list for the user.
       *
       * @param {string} dealType - Contains selected deal type as sprot or forward.
       * @param {string} rateType - Contains rate type as Buy or Sell.
       * @param {string} currency - - - - Contains selected currency for filter.
       * @param {string} currency2 Contains selected currency for filter.
       * @param {String} dealID Contains Deal Number.
       * @param {String} bookingDate Contains booking Date.
       * @param {String} expiryDate Contains Expiry Date.
       * @param {String} status Conatins status as active or inactive.
       * @returns {Promise}  Returns the promise object.
       */
      fetchForexDealList: function(dealType, rateType, currency, currency2, dealID, bookingDate, expiryDate, status) {
        return baseService.fetch({
          url: "forexDeals?dealType={dealType}&rateType={rateType}&currency={currency}&currency2={currency2}&dealId={dealId}&bookingDate={bookingDate}&expiryDate={expiryDate}&status={status}"
        }, {
          dealType: dealType,
          rateType: rateType,
          currency: currency,
          currency2: currency2,
          dealId: dealID,
          bookingDate: bookingDate,
          expiryDate: expiryDate,
          status: status
        });
      },
      /**
       * Fetches the list of forex currencies.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchCurrency: function() {
        return baseService.fetch({
          url: "forex/currencyPairs"
        });
      },
      /**
       * Fetches dealStatusType.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchStatusTypeList: function() {
        return baseService.fetch({
          url: "enumerations/dealStatusType"
        });
      },
      /**
       * Fetches dealType.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchDealTypeList: function() {
        return baseService.fetch({
          url: "enumerations/dealType"
        });
      },
      /**
       * Fetches dealRateType.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchRateTypeList: function() {
        return baseService.fetch({
          url: "enumerations/dealRateType"
        });
      }
    };
  };

  return new viewForexDealModel();
});