define([
  "baseService"
], function(BaseService) {
  "use strict";

  const openTdModel = function() {
    const baseService = BaseService.getInstance();

    return {
      getDepositType: function(depositProductType, currency) {
        const params ={
          depositProductType: depositProductType,
          currency: currency
        },
        options = {
          url: "products/deposit?productModule=TD&depositProductType={depositProductType}&productCurrency={currency}"
        };

        return baseService.fetch(options, params);
      },
      fetchMaturityInstruction: function() {
        const options = {
          url: "enumerations/rollOverType"
        };

        return baseService.fetch(options);
      }
    };
  };

  return new openTdModel();
});
