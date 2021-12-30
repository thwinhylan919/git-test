define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const CoolingLimitModel = function() {
    const baseService = BaseService.getInstance();
    let fetchCoolingLimitsDeffered;
    const fetchCoolingLimits = function(deffered) {
      const options = {
        url: "financialLimits?limitType=DUR",
        success: function(data) {
          deffered.resolve(data);
        },
        error: function(data) {
          deffered.reject(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      fetchCoolingLimits: function() {
        fetchCoolingLimitsDeffered = $.Deferred();
        fetchCoolingLimits(fetchCoolingLimitsDeffered);

        return fetchCoolingLimitsDeffered;
      }
    };
  };

  return new CoolingLimitModel();
});