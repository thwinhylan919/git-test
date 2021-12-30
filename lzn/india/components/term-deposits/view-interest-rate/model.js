define([
  "baseService"
], function(BaseService) {
  "use strict";

  const openTdModel = function() {
    const baseService = BaseService.getInstance();

    return {
      /**
       * ReadInterestRate - function to fetch interest Rates for given productId.
       *
       * @param  {type} productId - ProductId to be passed to TD.
       * @param  {type} moduleType - Description.
       * @return {type}           Description.
       */
      readInterestRate: function(productId, moduleType) {
        const params = {
          productId: productId,
          moduleType: moduleType
        },
        options = {
          url: "products/deposit/{productId}/interestRates?accountModule={moduleType}"
        };

        return baseService.fetch(options, params);
      }
    };
  };

  return new openTdModel();
});