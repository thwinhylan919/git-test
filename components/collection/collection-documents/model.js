define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    DocumentsModel = function() {
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
      let fetchIncotermDeferred;
      const fetchIncoterm = function(deferred) {
        const options = {
          url: "tradeIncoterms",
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
        },
        fetchIncoterm: function() {
          fetchIncotermDeferred = $.Deferred();
          fetchIncoterm(fetchIncotermDeferred);

          return fetchIncotermDeferred;
        }
      };
    };

  return new DocumentsModel();
});