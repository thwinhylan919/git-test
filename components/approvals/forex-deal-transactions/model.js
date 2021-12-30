/**
 * Model for forex-deal-create
 *
 * @param {object} $ instance
 * @param {object} BaseService instance
 * @return {object} forexDealTransactionsModel
 */
define([

  "baseService"
], function(BaseService) {
  "use strict";

  const forexDealTransactionsModel = function() {
    const baseService = BaseService.getInstance();

    return {
      /**
       * Fetches exchangeRate.
       *
       * @param {Object} view - Data containing view.
       * @param {Object} fromDate - Data containing the from date of transactions.
       * @param {Object} toDate - Data containing the to date of transactions.
       * @returns {Promise}  Returns the promise object.
       */
      getTransactionList: function(view, fromDate, toDate,roleType) {
        return baseService.fetch({
          url: "transactions?view={view}&discriminator=FOREX_DEAL&fromDate={fromDate}&toDate={toDate}&roleType={roleType}"
        }, {
          view: view,
          fromDate: fromDate,
          toDate: toDate,
          roleType:roleType
        });
      }
    };
  };

  return new forexDealTransactionsModel();
});