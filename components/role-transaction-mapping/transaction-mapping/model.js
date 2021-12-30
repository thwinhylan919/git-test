define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";

  const RoleTransactionMappingModel = function() {
    const baseService = BaseService.getInstance(),
      Model = function() {
        this.applicationRoleDTO = {
          applicationRoleName: null,
          applicationRoleDescription: null,
          applicationRoleDisplayName: null,
          enterpriseRole: null,
          accessPointType: null
        };

        this.modules = [];
        this.accessTransactionMapDTO = [{}];
      };
    let fetchEntitlementsDeferred;
    const fetchEntitlements = function(searchParams, deferred) {
      const options = {
        url: "entitlementGroups?module={module}&category={categoryName}&entitlement={entitlementName}",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options, searchParams);
    };
    let createApplicationRolePolicyDeferred;
    const createApplicationRolePolicy = function(payload, deferred) {
      const options = {
        url: "applicationRolePolicies",
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
      getNewModel: function() {
        return new Model();
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
      }
    };
  };

  return new RoleTransactionMappingModel();
});