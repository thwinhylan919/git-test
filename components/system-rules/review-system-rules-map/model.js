define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    ReviewSystemRulesModel = function () {
      let setloginConfigUpdateDeferred;
      const setLoginConfigUpdate = function (payload, roleId, deferred) {
        const params = {
            roleId: roleId
          },
          options = {
            url: "loginconfig/{roleId}",
            data: payload,
            success: function (data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function (data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          };

        baseService.update(options, params);
      };

      let setLimitPackagesDeferred;
      const setLimitPackages = function (payload, roleId, deferred) {
        const params = {
            roleId: roleId
          },
          options = {
            url: "rolePreferences/{roleId}",
            data: payload,
            success: function (data) {
              deferred.resolve(data);
            },
            error: function (data) {
              deferred.reject(data);
            }
          };

        baseService.add(options, params);
      };
      let createRolePreferenceDeferred;
      const createRolePreference = function (roleId, payload, deferred) {
        const params = {
            roleId: roleId
          },
          options = {
            url: "rolePreferences/{roleId}/preferences",
            data: payload,
            success: function (data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function (data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          };

        baseService.update(options, params);
      };
      let fireBatchDeferred;
      const fireBatch = function (deferred, batchRequest, type) {
        const options = {
          url: "batch",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

        baseService.batch(options, {
          type: type
        }, batchRequest);
      };

      return {
        createRolePreference: function (roleId, payload) {
          createRolePreferenceDeferred = $.Deferred();
          createRolePreference(roleId, payload, createRolePreferenceDeferred);

          return createRolePreferenceDeferred;
        },
        setLimitPackages: function (payload, roleId) {
          setLimitPackagesDeferred = $.Deferred();
          setLimitPackages(payload, roleId, setLimitPackagesDeferred);

          return setLimitPackagesDeferred;
        },
        setLoginConfigUpdate: function (payload, roleId) {
          setloginConfigUpdateDeferred = $.Deferred();
          setLoginConfigUpdate(payload, roleId, setloginConfigUpdateDeferred);

          return setloginConfigUpdateDeferred;
        },
        fireBatch: function (batchRequest, type) {
          fireBatchDeferred = $.Deferred();
          fireBatch(fireBatchDeferred, batchRequest, type);

          return fireBatchDeferred;
        }
      };
    };

  return new ReviewSystemRulesModel();
});