/** Model to fetch details of a particular Deal.
 * @param {object} BaseService base service instance
 * @return {object} viewForexDealDetailsModel
 */
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const viewForexDealDetailsModel = function() {
    const baseService = BaseService.getInstance();
    /**
     * confirm forex deal
     * @param {String} id contains selected currency for filter
     * @param {string} deferred  An string containg the data to be recieved from host
     * @returns {Promise}  Returns the promise object
     */
    let reverseForexDealDeferred;
    const reverseForexDeal = function(id, deferred) {
      const options = {
          url: "forexDeals/{id}",
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        },
        params = {
          id: id
        };

      baseService.remove(options, params);
    };

    return {

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
      },

      /**
       * Fetches the party details.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchPartyDetails: function() {
        return baseService.fetch({
          url: "me/party"
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
      },
      /**
       * Reverse forex deal.
       *
       * @param {string} id - Contains selected currency for filter.
       * @returns {Promise}  Returns the promise object.
       */
      reverseForexDeal: function(id) {
        reverseForexDealDeferred = $.Deferred();
        reverseForexDeal(id, reverseForexDealDeferred);

        return reverseForexDealDeferred;
      },
      /**
       * Fetches deal utilization details.
       *
       * @param {string} dealId - Deal Id.
       * @returns {Promise}  Returns the promise object.
       */
      fetchDealUtilization: function(dealId) {
        return baseService.fetch({
          url: "forexDeals/utilization?dealId={dealId}"
        }, {
          dealId: dealId
        });
      },
      /**
       * Fetches deal utilization status types.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchDealUtilizationStatusType: function() {
        return baseService.fetch({
          url: "enumerations/utilizationStatusType"
        });
      }

    };
  };

  return new viewForexDealDetailsModel();
});
