define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const RolePreferenceModel = function () {
    const Model = function () {
        this.payload = {
          roleId: "",
          preferenceMappingDTOs: []
        };

        this.limitPackage = {
          roleId: "",
          entityLimitPackageDTOs: []
        };

        this.loginConfigPayload = {

          logConfigDTOs: []
        };
      },
      baseService = BaseService.getInstance();
    let getEnterpriseRolesDeferred;
    const getEnterpriseRoles = function (deferred) {
      const params = {
          isLocal: true
        },
        options = {
          url: "enterpriseRoles?isLocal={isLocal}",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let getLoginConfigComponentsDeferred;
    const getLoginConfigComponents = function (deferred) {
      const params = {
          isLocal: true
        },
        options = {
          url: "enumerations/loginConfigComponents?isLocal={isLocal}",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let getLoginConfigListDeferred;
    const getLoginConfigList = function (Parameters, deferred) {
      const selectedRoleType = {
          role: Parameters.role
        },
        options = {
          url: "loginconfig?role={role}",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, selectedRoleType);
    };

    let getRolePreferencesDeferred;
    const getRolePreferences = function (selectedRoleId, deferred) {
      const params = {
          roleId: selectedRoleId
        },
        options = {
          url: "rolePreferences/{roleId}/preferences",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let createRolePreferenceDeferred;
    const createRolePreference = function (roleId, payload, deferred) {
      const params = {
          roleId: roleId
        },
        options = {
          url: "rolePreferences/{roleId}/preferences",
          data: payload,
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

      baseService.update(options, params);
    };
    let getPreferencesDeferred;
    const getPreferences = function (deferred) {
      const options = {
        url: "rolePreferences",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getLimitPackagesDeferred;
    const getLimitPackages = function (deferred) {
      const options = {
        url: "limitPackages",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let setLimitPackagesDeferred;
    const setLimitPackages = function (deferred, payload, roleId) {
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
    let fetchUserLimitOptionsDeferred;
    const fetchUserLimitOptions = function (deferred, businessEntity) {
      const params = {
          businessEntity: businessEntity
        },
        options = {
          url: "limitPackages?businessEntity={businessEntity}",
          success: function (data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
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
      getNewModel: function (modelData) {
        return new Model(modelData);
      },
      createRolePreference: function (roleId, payload) {
        createRolePreferenceDeferred = $.Deferred();
        createRolePreference(roleId, payload, createRolePreferenceDeferred);

        return createRolePreferenceDeferred;
      },
      getLoginConfigComponents: function () {
        getLoginConfigComponentsDeferred = $.Deferred();
        getLoginConfigComponents(getLoginConfigComponentsDeferred);

        return getLoginConfigComponentsDeferred;
      },
      getLoginConfigList: function (Parameters) {
        getLoginConfigListDeferred = $.Deferred();
        getLoginConfigList(Parameters, getLoginConfigListDeferred);

        return getLoginConfigListDeferred;
      },
      getEnterpriseRoles: function () {
        getEnterpriseRolesDeferred = $.Deferred();
        getEnterpriseRoles(getEnterpriseRolesDeferred);

        return getEnterpriseRolesDeferred;
      },
      getPreferences: function () {
        getPreferencesDeferred = $.Deferred();
        getPreferences(getPreferencesDeferred);

        return getPreferencesDeferred;
      },
      getRolePreferences: function (roleId) {
        getRolePreferencesDeferred = $.Deferred();
        getRolePreferences(roleId, getRolePreferencesDeferred);

        return getRolePreferencesDeferred;
      },
      getLimitPackages: function () {
        getLimitPackagesDeferred = $.Deferred();
        getLimitPackages(getLimitPackagesDeferred);

        return getLimitPackagesDeferred;
      },
      setLimitPackages: function (payload, roleId) {
        setLimitPackagesDeferred = $.Deferred();
        setLimitPackages(setLimitPackagesDeferred, payload, roleId);

        return setLimitPackagesDeferred;
      },
      fetchUserLimitOptions: function (businessEntity) {
        fetchUserLimitOptionsDeferred = $.Deferred();
        fetchUserLimitOptions(fetchUserLimitOptionsDeferred, businessEntity);

        return fetchUserLimitOptionsDeferred;
      },
      fireBatch: function (batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        fireBatch(fireBatchDeferred, batchRequest, type);

        return fireBatchDeferred;
      }
    };
  };

  return new RolePreferenceModel();
});