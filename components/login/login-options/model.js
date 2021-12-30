define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    loginOptions = function() {
      let createLoginConfigDeferred;
      const createLoginConfig = function(payload, deferred) {
        const options = {
          url: "me/loginFlow",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.add(options);
      };

      return {
        createLoginConfig: function(payload) {
          createLoginConfigDeferred = $.Deferred();
          createLoginConfig(payload, createLoginConfigDeferred);

          return createLoginConfigDeferred;
        }
      };
    };

  return new loginOptions();
});