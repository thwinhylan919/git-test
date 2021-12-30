define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    BillDetailsModel = function() {
      let fetchGoodsDeferred;
      const fetchGoods = function(deferred) {
        const options = {
          url: "tradeGoods",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };

      return {
        fetchGoods: function() {
          fetchGoodsDeferred = $.Deferred();
          fetchGoods(fetchGoodsDeferred);

          return fetchGoodsDeferred;
        }
      };
    };

  return new BillDetailsModel();
});