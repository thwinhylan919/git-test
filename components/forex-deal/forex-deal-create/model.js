/**
 * Model for forex-deal-create
 *
 * @param {object} BaseService instance
 * @return {object} forexDealModel
 */
define([
  "baseService"
], function(BaseService) {
  "use strict";

  const forexDealModel = function() {
    /**
     * In case more than one instance of forexDealModel is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     */
    const Model = function() {
        this.createForexDealModel = {
          forexDealDTO: {
            rateType: null,
            buyAmount: {
              amount: null,
              currency: null
            },
            rate: {
              amount: null,
              currency: null
            },
            sellAmount: {
              amount: null,
              currency: null
            },
            forwardPeriod: null,
            bookingDate: null,
            expiryDate: null,
            type: null,
            swap: false,
            swapDealDTO: {
              forexDealDTO: {
                rateType: null,
                buyAmount: {
                  amount: null,
                  currency: null
                },
                rate: {
                  amount: null,
                  currency: null
                },
                sellAmount: {
                  amount: null,
                  currency: null
                },
                forwardPeriod: null,
                bookingDate: null,
                expiryDate: null,
                type: "F"
              }
            }
          }
        };
      },
      baseService = BaseService.getInstance();

    return {
      /**
       * Returns new Model instance.
       *
       * @returns {Object}  Returns the modelData.
       */
      getNewModel: function() {
        return new Model();
      },
      /**
       * Fetches currencyPairs.
       *
       * @returns {Promise}  Returns the promise object.
       */
      getCurrencyPairs: function() {
        return baseService.fetch({
          url: "forexDeals/configurations"
        });
      },
      /**
       * Fetches currentDate.
       *
       * @returns {Promise}  Returns the promise object.
       */
      getHostDate: function() {
        return baseService.fetch({
          url: "payments/currentDate"
        });
      },
      /**
       * Fetches currentDate.
       *
       * @returns {Promise}  Returns the promise object.
       */
      listAccessPoint: function() {
        return baseService.fetch({
          url: "accessPoints"
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
          ccy1: data.ccy1Code,
          ccy2: data.ccy2Code
        });
      },
      /**
       * Fetches forwardDealPeriod.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchFrequencyList: function() {
        return baseService.fetch({
          url: "enumerations/forwardDealPeriod"
        });
      },
      /**
       * Fetches bankConfiguration.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchBankConfig: function() {
        return baseService.fetch({
          url: "bankConfiguration"
        });
      },
      /**
       * Fetches party details to which it is logged in.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchForexDealCreationFlag: function() {
        return baseService.fetch({
          url: "me/partyPreferences"
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
       * Fetches the party details.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchPartyDetails: function() {
        return baseService.fetch({
          url: "me/party"
        });
      }
    };
  };

  return new forexDealModel();
});