/**
 * Model for view-rd-interest-rate
 * @param {object} BaseService base service instance for server communication
 * @return {object} recurringDepositModel Modal instance
 */
define([
  "baseService"
], function(BaseService) {
  "use strict";

  const recurringDepositModel = function() {
    const baseService = BaseService.getInstance();

    return {
      /**
       * ReadProduct - fetch the product details.
       *
       * @param {string} productId - Product id of the product to be fetched.
       * @returns {Promise}  Returns the promise object.
       */
      readProduct: function(productId) {
        return baseService.fetch({
          url: "products/deposit/{productId}/interestRates?accountModule=RD"
        }, {
          productId: productId
        });
      }
    };
  };

  return new recurringDepositModel();
});