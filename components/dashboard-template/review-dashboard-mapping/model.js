define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    CreateMappingModel = function() {
      return {
        createMapping: function(payload) {
          const deferred = $.Deferred(),
            options = {
              url: "dashboards/mappings",
              data: payload,
              success: function(data, status, jqXhr) {
                deferred.resolve(data, status, jqXhr);
              },
              error: function(data, status, jqXhr) {
                deferred.reject(data, status, jqXhr);
              }
            };

          baseService.add(options);

          return deferred;
        }
      };
    };

  return new CreateMappingModel();
});