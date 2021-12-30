define(["baseService"], function (BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    BrandListModel = function () {
      return {
        fetchBrands: function () {
          return baseService.fetch({
            url: "brands/user"
          });
        },
        createMapping: function (payload) {
          return baseService.add({
            url: "brands/user/mapping",
            data: payload
          });
        },
        deleteMapping: function () {
          return baseService.remove({
            url: "brands/user/mapping"
          });
        },
        fireBatch: function (payload) {
          return baseService.batch({
            url: "batch"
          }, {}, payload);
        }
      };
    };

  return new BrandListModel();
});