/**
 * Model for liquidity management
 *
 * @param {object} $ instance
 * @param {object} BaseService instance
 * @return {object} liquidityManagementModel
 */
define([

  "baseService"
], function( BaseService) {
  "use strict";

  const liquidityManagementModel = function() {
    const baseService = BaseService.getInstance();

    return {
      /**
       * Fetches exchangeRate.
       *
       * @param {Object} view - Data containing view.
       * @param {Object} fromDate - Data containing the from date of transactions.
       * @param {Object} toDate - Data containing the to date of transactions.
       * @param {string} roleType - Data containing the role type of transactions.
       * @returns {Promise}  Returns the promise object.
       */
      getTransactionList: function(view, fromDate, toDate,roleType) {
        return baseService.fetch({
          url: "transactions?view={view}&discriminator=LIQUIDITY_MANAGEMENT&fromDate={fromDate}&toDate={toDate}&roleType={roleType}"
        }, {
          view: view,
          fromDate: fromDate,
          toDate: toDate,
          roleType:roleType
        });
      }
    };
  };

  return new liquidityManagementModel();
});