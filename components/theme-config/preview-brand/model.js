define([

    "baseService"
  ], function(BaseService) {
    "use strict";

    const baseService = BaseService.getInstance(),
      BrandListModel = function() {
        return {
          fetchBrands: function() {
            return baseService.fetch({
              url: "brands/"
            });
          }

        };
      };

    return new BrandListModel();
  });
