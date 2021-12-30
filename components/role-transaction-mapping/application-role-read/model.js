define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const ApplicationRoleReadModel = function() {
    const baseService = BaseService.getInstance();

    this.getNewModel = function() {
      return new this.Model();
    };

    let fetchUserGroupOptionsDeferred;
    const fetchUserGroupOptions = function(deferred) {
      const options = {
        url: "enterpriseRoles?isLocal=true",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
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
    let fetchUserSegmentsDeferred;
    const fetchUserSegments = function(searchParams, deferred) {
      const options = {
        url: "segments?enterpriseRole={selectedUser}",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options, searchParams);
    };
    let fetchAccessDeferred;
    const fetchAccess = function(accessType, deferred) {
      const options = {
        url: "accessPoints?accessType={accessType}&accessPointStatus=Y",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options, accessType);
    };
    let fetchRoleTransactionMappingDeferred;
    const fetchRoleTransactionMapping = function(appRoleId, deferred) {
      const params = {appRoleId : appRoleId} ,
       options = {
        url: "applicationRolePolicies/{appRoleId}?isLocal=true",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options,params);
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
    let fetchScopesDeferred;
    const fetchScopes = function(deferred) {
      const options = {
        url: "accessPointScopes",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let deleteAccessDeferred;
    const deleteAccess = function(appRoleId, deferred) {
      const params = {appRoleId : appRoleId} ,
       options = {
        url: "applicationRolePolicies/{appRoleId}?isLocal=true",
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };

      baseService.remove(options, params);
    };

    return {
      fetchUserGroupOptions: function() {
        fetchUserGroupOptionsDeferred = $.Deferred();
        fetchUserGroupOptions(fetchUserGroupOptionsDeferred);

        return fetchUserGroupOptionsDeferred;
      },
      fetchAccessPointType: function() {
        fetchAccessPointTypeDeferred = $.Deferred();
        fetchAccessPointType(fetchAccessPointTypeDeferred);

        return fetchAccessPointTypeDeferred;
      },
      fetchAccess: function(searchParams) {
        fetchAccessDeferred = $.Deferred();
        fetchAccess(searchParams, fetchAccessDeferred);

        return fetchAccessDeferred;
      },
      fetchModuleName: function() {
        fetchModuleNameDeferred = $.Deferred();
        fetchModuleName(fetchModuleNameDeferred);

        return fetchModuleNameDeferred;
      },
      fetchRoleTransactionMapping: function(appRoleId) {
        fetchRoleTransactionMappingDeferred = $.Deferred();
        fetchRoleTransactionMapping(appRoleId, fetchRoleTransactionMappingDeferred);

        return fetchRoleTransactionMappingDeferred;
      },
      fetchScopes: function() {
        fetchScopesDeferred = $.Deferred();
        fetchScopes(fetchScopesDeferred);

        return fetchScopesDeferred;
      },
      deleteAccess: function(appRoleId) {
        deleteAccessDeferred = $.Deferred();
        deleteAccess(appRoleId, deleteAccessDeferred);

        return deleteAccessDeferred;
      },
      fetchUserSegments: function(searchParams) {
        fetchUserSegmentsDeferred = $.Deferred();
        fetchUserSegments(searchParams, fetchUserSegmentsDeferred);

        return fetchUserSegmentsDeferred;
      }
    };
  };

  return new ApplicationRoleReadModel();
});
