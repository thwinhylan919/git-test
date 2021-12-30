define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const RoleTransactionUpdateModel = function() {
    const baseService = BaseService.getInstance(),
      Model = function() {
        this.applicationRoleDTO = {
          applicationRoleId: null,
          applicationRoleName: null,
          applicationRoleDescription: null,
          applicationRoleDisplayName: null,
          enterpriseRole: null,
          accessPointType: null,
          accessPointScope: null,
          version: null
        };

        this.modules = [];
        this.accessTransactionMapDTO = [];
        this.roleSegmentMap = [];
      };
    let fetchEntitlementsDeferred;
    const fetchEntitlements = function(searchParams, deferred) {
      let modules;

      if (searchParams.module.length === 1)
        {modules = "module=" + searchParams.module[0]+ "&" + modules;}
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
    let updateRoleTransactionDeferred;
    const updateRoleTransaction = function(payload, deferred) {
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

      baseService.update(options);
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
      updateRoleTransaction: function(payload) {
        updateRoleTransactionDeferred = $.Deferred();
        updateRoleTransaction(payload, updateRoleTransactionDeferred);

        return updateRoleTransactionDeferred;
      }
    };
  };

  return new RoleTransactionUpdateModel();
});
