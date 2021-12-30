define([
  "baseService",
  "jquery"
], function(BaseService, $) {
  "use strict";

  const MapTransactionModel = function() {
    const baseService = BaseService.getInstance(),
      Model = function() {
        this.applicationRoleDTO = {
          applicationRoleName: null,
          applicationRoleDescription: null,
          applicationRoleDisplayName: null,
          enterpriseRole: null,
          accessPointType: null,
          accessPointScope: null
        };

        this.modules = [];
        this.accessTransactionMapDTO = [];
        this.roleSegmentMap = [];
      };
    let fetchEntitlementsDeferred;
    const fetchEntitlements = function(searchParams, deferred) {
      let modules;

      if (searchParams.module.length === 1)
        {modules = "module=" + searchParams.module[0]+ "&"+ modules;}
      else {
        for (let i = 0; i < searchParams.module.length; i++)
          {modules = "module=" + searchParams.module[i] + "&" + modules;}
      }

      const params = {modules : modules},
       options = {
        url: "entitlementGroups?{modules}",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options, params);
    };
    let fetchModuleNameDeferred;
    const fetchModuleName = function(deferred) {
      const options = {
        url: "enumerations/entitlementCategory",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchAccessPointTypeDeferred;
    const fetchAccessPointType = function(deferred) {
      const options = {
        url: "enumerations/accessPointType",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let createApplicationRolePolicyDeferred;
    const createApplicationRolePolicy = function(payload, deferred) {
      const options = {
        url: "applicationRolePolicies",
        data: payload,
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        },
        error: function(data, status, jqXHR) {
          deferred.reject(data, status, jqXHR);
        }
      };

      baseService.add(options);
    };

    return {
      getNewModel: function() {
        return new Model();
      },
      fetchModuleName: function() {
        fetchModuleNameDeferred = $.Deferred();
        fetchModuleName(fetchModuleNameDeferred);

        return fetchModuleNameDeferred;
      },
      fetchEntitlements: function(searchParams) {
        fetchEntitlementsDeferred = $.Deferred();
        fetchEntitlements(searchParams, fetchEntitlementsDeferred);

        return fetchEntitlementsDeferred;
      },
      createApplicationRolePolicy: function(payload) {
        createApplicationRolePolicyDeferred = $.Deferred();
        createApplicationRolePolicy(payload, createApplicationRolePolicyDeferred);

        return createApplicationRolePolicyDeferred;
      },
      fetchAccessPointType: function() {
        fetchAccessPointTypeDeferred = $.Deferred();
        fetchAccessPointType(fetchAccessPointTypeDeferred);

        return fetchAccessPointTypeDeferred;
      }
    };
  };

  return new MapTransactionModel();
});
