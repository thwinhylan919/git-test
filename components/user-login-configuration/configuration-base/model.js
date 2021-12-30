define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    UserLoginFlowDisplayModel = function() {
      let listUserLoginFlowDeferred;
      const listUserLoginFlow = function(deferred) {
        const options = {
          url: "me/loginFlow",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
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
        listUserLoginFlow: function() {
          listUserLoginFlowDeferred = $.Deferred();
          listUserLoginFlow(listUserLoginFlowDeferred);

          return listUserLoginFlowDeferred;
        },
        createLoginConfig: function(payload) {
          createLoginConfigDeferred = $.Deferred();
          createLoginConfig(payload, createLoginConfigDeferred);

          return createLoginConfigDeferred;
        }
      };
    };

  return new UserLoginFlowDisplayModel();
});