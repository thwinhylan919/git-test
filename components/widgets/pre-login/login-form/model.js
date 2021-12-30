define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const loginFormModel = function loginFormModel() {
    const baseService = BaseService.getInstance();
    let validateDeviceDeferred;
    const validateDevice = function(deferred) {
      const options = {
        url: "mobileClient/validateDevice",
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        },
        error: function(data, status, jqXHR) {
          deferred.reject(data, status, jqXHR);
        }
      };

      baseService.update(options);
    };
    let registerDeviceDeferred;
    const registerDevice = function(deferred, payload) {
      const options = {
        url: "mobileClient",
        data: payload,
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        }
      };

      baseService.add(options);
    };
    let getNonceForceDeferred;
    const getNonceForce = function(deferred) {
      const options = {
        url: "session/nonce",
        headers: {
          "x-noncecount": 10
        },
        complete: function(jqXHR) {
          if (jqXHR.status === 200) {
            deferred.resolve(jqXHR);
          } else {
            deferred.reject(jqXHR);
          }
        }
      };

      baseService.add(options);
    };
    let meDeferred;
    const me = function(deferred) {
      const options = {
        url: "me",
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        },
        error: function(data, status, jqXHR) {
          deferred.reject(data, status, jqXHR);
        }
      };

      baseService.fetch(options);
    };

    return {
      validateDevice: function() {
        validateDeviceDeferred = $.Deferred();
        validateDevice(validateDeviceDeferred);

        return validateDeviceDeferred;
      },
      registerDevice: function(payload) {
        registerDeviceDeferred = $.Deferred();
        registerDevice(registerDeviceDeferred, payload);

        return registerDeviceDeferred;
      },
      getNonceForce: function() {
        getNonceForceDeferred = $.Deferred();
        getNonceForce(getNonceForceDeferred);

        return getNonceForceDeferred;
      },
      me: function() {
        meDeferred = $.Deferred();
        me(meDeferred);

        return meDeferred;
      }
    };
  };

  return new loginFormModel();
});