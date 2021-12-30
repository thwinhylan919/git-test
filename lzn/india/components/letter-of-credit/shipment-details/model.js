define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const ShipmentDetailsModel = function () {
    const baseService = BaseService.getInstance();
    let fetchCurrencyDeferred;
    const fetchCurrency = function (deferred) {
      const options = {
        url: "currency",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };

    return {

      fetchCurrency: function () {
        fetchCurrencyDeferred = $.Deferred();
        fetchCurrency(fetchCurrencyDeferred);

        return fetchCurrencyDeferred;
      }
    };
  };

  return new ShipmentDetailsModel();
});