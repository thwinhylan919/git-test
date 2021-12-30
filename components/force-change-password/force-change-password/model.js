define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const ChangePasswordModel = function () {
    const Model = function () {
        this.oldPassword = null;
        this.newPassword = null;
        this.userId = null;
      },
      baseService = BaseService.getInstance();
    let changePasswordDeferred;
    const changePassword = function (payload, deferred) {
      const options = {
        url: "credentials/forceChangePassword",
        data: payload,
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.update(options);
    };
    let fetchPasswordPolicyDeferred;
    const fetchPasswordPolicy = function (searchParams, deferred) {
      const options = {
        url: "credentials/passwordPolicy?userId=" + searchParams.userId,
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
      getNewModel: function () {
        return new Model();
      },
      changePassword: function (payload) {
        changePasswordDeferred = $.Deferred();
        changePassword(payload, changePasswordDeferred);

        return changePasswordDeferred;
      },
      fetchPasswordPolicy: function (params) {
        fetchPasswordPolicyDeferred = $.Deferred();
        fetchPasswordPolicy(params, fetchPasswordPolicyDeferred);

        return fetchPasswordPolicyDeferred;
      }
    };
  };

  return new ChangePasswordModel();
});