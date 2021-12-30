define([
  "baseService"
], function(BaseService) {
  "use strict";

  const openTdModel = function() {
    const baseService = BaseService.getInstance();

    return {

      getDepositType: function() {
        return baseService.fetch({
          url: "products/deposit?productModule=TD&depositProductType=CON"
        });
      }
    };
  };

  return new openTdModel();
});