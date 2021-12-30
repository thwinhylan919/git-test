define(["baseService"], function (BaseService) {
  "use strict";

  const AmountInputModel = function () {
    const baseService = BaseService.getInstance();

    return {
      getCurrencyList: function (url) {
        return baseService.fetch({
          url: url
        });
      }
    };
  };

  return new AmountInputModel();
});