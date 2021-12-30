define([
  "baseService"
], function(BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    Model = function() {
      return {
        getBranch: function() {
          const options = {
            url: "locations/country/all/city/all/branchCode"
          };

          return baseService.fetch(options);
        }
      };
    };

  return new Model();
});