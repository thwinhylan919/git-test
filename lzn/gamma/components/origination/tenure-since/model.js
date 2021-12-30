define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const TenureSinceModel = function() {
    const baseService = BaseService.getInstance();
    let getMonthsDeferred;
    const getMonths = function(deferred) {
      const options = {
        url: "origination/months",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetchJSON(options);
    };

    return {
      getMonths: function() {
        getMonthsDeferred = $.Deferred();
        getMonths(getMonthsDeferred);

        return getMonthsDeferred;
      }
    };
  };

  return new TenureSinceModel();
});