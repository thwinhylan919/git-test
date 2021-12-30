define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const SecurityKeysModel = function () {
    const baseService = BaseService.getInstance();
    let createKeysDeferred;
    const createKeys = function (payload, deferred) {
      const options = {
        url: "keyPair",
        data: payload,
        success: function (payload, status) {
          deferred.resolve(payload, status);
        },
        error: function (data, status) {
          deferred.reject(data, status);
        }
      };

      baseService.add(options);
    };
    let createJwtKeysDeferred;
    const createJwtKeys = function (payload, deferred) {
      const options = {
        url: "jwt/key",
        data: payload,
        success: function (payload, status) {
          deferred.resolve(payload, status);
        },
        error: function (data, status) {
          deferred.reject(data, status);
        }
      };

      baseService.add(options);
    };

    return {
      createKeys: function (payload) {
        createKeysDeferred = $.Deferred();
        createKeys(payload, createKeysDeferred);

        return createKeysDeferred;
      },
      createJwtKeys: function (payload) {
        createJwtKeysDeferred = $.Deferred();
        createJwtKeys(payload, createJwtKeysDeferred);

        return createJwtKeysDeferred;
      }
    };
  };

  return new SecurityKeysModel();
});