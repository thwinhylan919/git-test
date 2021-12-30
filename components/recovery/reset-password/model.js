define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const ResetPasswordModel = function() {
    const Model = function() {
        this.userId = null;
        this.newPassword = null;
        this.token = null;
      },
      baseService = BaseService.getInstance();
    let changePasswordDeferred, fetchPasswordPolicyDeferred;
    const changePassword = function(payload, deferred, determinantValue,isDynamicUrl) {
        const options = {
          url: "credentials/changeCredentials",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        if(isDynamicUrl){
          options.headers = {};
          options.headers["X-Target-Unit"] = determinantValue;
        }

        baseService.update(options);
      },
      fetchPasswordPolicy = function(searchParams,deferred, determinantValue,isDynamicUrl) {
        const options = {
          url: "passwordPolicy?token={token}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        if(isDynamicUrl){
          options.headers = {};
          options.headers["X-Target-Unit"] = determinantValue;
        }

        baseService.fetch(options,searchParams);
      };
      let tokenValidateDeferred;
      const tokenValidate = function(token, deferred, determinantValue,isDynamicUrl) {
        const params = {token : token},
         options = {
          url: "token/{token}",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        if(isDynamicUrl){
          options.headers = {};
          options.headers["X-Target-Unit"] = determinantValue;
        }

        baseService.fetch(options, params);
      };

    return {
      getNewModel: function() {
        return new Model();
      },
      changePassword: function(payload,determinantValue,isDynamicUrl) {
        changePasswordDeferred = $.Deferred();
        changePassword(payload, changePasswordDeferred,determinantValue,isDynamicUrl);

        return changePasswordDeferred;
      },
      fetchPasswordPolicy: function(params,determinantValue,isDynamicUrl) {
        fetchPasswordPolicyDeferred = $.Deferred();
        fetchPasswordPolicy(params,fetchPasswordPolicyDeferred,determinantValue,isDynamicUrl);

        return fetchPasswordPolicyDeferred;
      },
      tokenValidate: function(token,determinantValue,isDynamicUrl) {
        tokenValidateDeferred = $.Deferred();
        tokenValidate(token, tokenValidateDeferred,determinantValue,isDynamicUrl);

        return tokenValidateDeferred;
      }
    };
  };

  return new ResetPasswordModel();
});