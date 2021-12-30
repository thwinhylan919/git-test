define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const bankProductsModel = function () {
    const baseService = BaseService.getInstance();
    let fetchProductTilesDeferred;
    const fetchProductTiles = function (deferred) {
      const params = {
          status: "ACTIVE"
        },
        options = {
          url: "productTypes?status={status}",
          success: function (data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
    };

    return {
      fetchProductTiles: function () {
        fetchProductTilesDeferred = $.Deferred();
        fetchProductTiles(fetchProductTilesDeferred);

        return fetchProductTilesDeferred;
      }
    };
  };

  return new bankProductsModel();
});