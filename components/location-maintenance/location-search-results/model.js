define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    LocationSearchResultsModel = function() {
      let Deferred;
      const get = function(deferred) {
        const options = {
          url: "enter-url-here/",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };

      return {
        get: function() {
          Deferred = $.Deferred();
          get(Deferred);

          return Deferred;
        }
      };
    };

  return new LocationSearchResultsModel();
});