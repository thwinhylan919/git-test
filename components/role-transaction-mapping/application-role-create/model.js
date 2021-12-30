define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const ApplicationRolesCreateModel = function() {
    const baseService = BaseService.getInstance(),
      Model = function() {
        this.retailUser = "retailuser";
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
    let fetchAccessDeferred;
    const fetchAccess = function(searchParams, deferred) {
      const options = {
        url: "accessPoints?accessType={accessType}&accessPointStatus=Y",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options, searchParams);
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

    this.createApplicationRole = function(payload, successHandler, errorHandler) {
      const options = {
        url: "applicationRoles",
        data: payload,
        success: function(data) {
          successHandler(data);
        },
        error: function(data) {
          errorHandler(data);
        }
      };

      baseService.add(options);
    };

    return {
      getNewModel: function() {
        return new Model();
      },
      fetchUserGroupOptions: function() {
        fetchUserGroupOptionsDeferred = $.Deferred();
        fetchUserGroupOptions(fetchUserGroupOptionsDeferred);

        return fetchUserGroupOptionsDeferred;
      },
      fetchUserSegments: function(searchParams) {
        fetchUserSegmentsDeferred = $.Deferred();
        fetchUserSegments(searchParams, fetchUserSegmentsDeferred);

        return fetchUserSegmentsDeferred;
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
      fetchScopes: function() {
        fetchScopesDeferred = $.Deferred();
        fetchScopes(fetchScopesDeferred);

        return fetchScopesDeferred;
      }
    };
  };

  return new ApplicationRolesCreateModel();
});
