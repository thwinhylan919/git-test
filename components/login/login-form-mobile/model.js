define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const loginFormModel = function loginFormModel() {
    const baseService = BaseService.getInstance();
    let validateDeviceDeferred;
    const validateDevice = function (deferred) {
      const options = {
        url: "mobileClient/validateDevice",
        success: function (data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        },
        error: function (data, status, jqXHR) {
          deferred.reject(data, status, jqXHR);
        }
      };

      baseService.update(options);
    };
    let registerDeviceDeferred;
    const registerDevice = function (deferred, payload) {
      const options = {
        url: "mobileClient",
        data: payload,
        success: function (data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        }
      };

      baseService.add(options);
    };
    let getNonceForceDeferred;
    const getNonceForce = function (deferred) {
      const options = {
        url: "session/nonce",
        headers: {
          "x-noncecount": 10
        },
        complete: function (jqXHR) {
          if (jqXHR.status === 200) {
            deferred.resolve(jqXHR);
          } else {
            deferred.reject(jqXHR);
          }
        }
      };

      baseService.add(options);
    };
    let registerForPushDeferred;
    const registerForPush = function (deferred, payload) {
      const options = {
        url: "mobileClient/pushRegistration",
        data: payload,
        success: function (data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        },
        error: function (data, status, jqXHR) {
          deferred.reject(data, status, jqXHR);
        }
      };

      baseService.add(options);
    };
    let updateStatusDeferred;
    const updateStatus = function (deferred, referenceNumber, token, status) {
      const options = {
          url: "oobauthentication/{referenceNumber}/token/{token}/{status}",
          success: function (data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function (data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        },
        params = {
          referenceNumber: referenceNumber,
          token: token,
          status: status
        };

      baseService.update(options, params);
    };
    let getJwtTokenDeferred;
    const getJwtToken = function (deferred, payload) {
      const options = {
        url: "jwt",
        data: payload,
        success: function (data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        }
      };

      baseService.add(options);
    };
    let getPayeeListDeferred;
    const getPayeeList = function (deferred) {
      const url = "payments/payeeGroup?expand=ALL&types=INTERNAL,INTERNATIONAL,INDIADOMESTIC,UKDOMESTIC,SEPADOMESTIC",
        options = {
          url: url,
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options);
    };

    return {
      getMePreference: function () {
        const options = {
          url: "me/preferences"
        };

        return baseService.fetch(options);
      },
      updateMePreference: function (payload) {
        const options = {
          data: payload,
          url: "me/preferences"
        };

        return baseService.update(options);
      },
      sessionCreate: function () {
        return baseService.add({
          url: "session",
          method: "POST",
          data: ""
        });
      },
      updateSession: function () {
        return baseService.remove({
          url: "session"
        }).then(function () {
          baseService.invalidateSession();

          return baseService.add({
            url: "session",
            method: "POST",
            data: ""
          });
        });
      },
      validateDevice: function () {
        validateDeviceDeferred = $.Deferred();
        validateDevice(validateDeviceDeferred);

        return validateDeviceDeferred;
      },
      registerDevice: function (payload) {
        registerDeviceDeferred = $.Deferred();
        registerDevice(registerDeviceDeferred, payload);

        return registerDeviceDeferred;
      },
      getNonceForce: function () {
        getNonceForceDeferred = $.Deferred();
        getNonceForce(getNonceForceDeferred);

        return getNonceForceDeferred;
      },
      me: function (payload) {
        const options = {
          url: "me",
          throttle: false,
          nonceRequired: true,
          showInModalWindow: true,
          headers: {
            "X-Target-Unit": ""
          }
        };

        if (payload) {
          options.headers = $.extend({}, options.headers, payload);
        }

        return baseService.fetch(options);
      },
      getJwtToken: function (payload) {
        getJwtTokenDeferred = $.Deferred();
        getJwtToken(getJwtTokenDeferred, payload);

        return getJwtTokenDeferred;
      },
      registerForPush: function (payload) {
        registerForPushDeferred = $.Deferred();
        registerForPush(registerForPushDeferred, payload);

        return registerForPushDeferred;
      },
      updateStatus: function (referenceNumber, token, status) {
        updateStatusDeferred = $.Deferred();
        updateStatus(updateStatusDeferred, referenceNumber, token, status);

        return updateStatusDeferred;
      },
      getPayeeList: function () {
        getPayeeListDeferred = $.Deferred();
        getPayeeList(getPayeeListDeferred);

        return getPayeeListDeferred;
      }
    };
  };

  return new loginFormModel();
});