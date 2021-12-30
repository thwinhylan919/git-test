define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const UserInformationModel = function() {
    const baseService = BaseService.getInstance();
    let updatePasswordRequestDeferred;
    const updatePasswordRequest = function(payload, deferred) {
      const options = {
        url: "credentials/forgotCredentials",
        data: payload,
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.add(options);
    };
    let sessionRequestDeferred;
    const sessionRequest = function (deferred) {
      const options = {
        url: "session",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.add(options);
    };
    let nonceRequestDeferred;
    const nonceRequest = function (deferred) {
      const options = {
        url: "session/nonce",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.add(options);
    };

    return {
      updatePasswordRequest: function(uId) {
        updatePasswordRequestDeferred = $.Deferred();
        updatePasswordRequest(uId, updatePasswordRequestDeferred);

        return updatePasswordRequestDeferred;
      },
      sessionRequest: function(){
        sessionRequestDeferred = $.Deferred();
        sessionRequest(sessionRequestDeferred);

        return sessionRequestDeferred;
      },
      nonceRequest: function(){
        nonceRequestDeferred = $.Deferred();
        nonceRequest(nonceRequestDeferred);

        return nonceRequestDeferred;
      }
    };
  };

  return new UserInformationModel();
});