define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const reviewUserUpdateModel = function() {
    let params;
    const baseService = BaseService.getInstance();
    let fetchUserLimitOptionsDeferred;
    const fetchUserLimitOptions = function(deferred, businessEntity) {
      const options = {
        url: "limitPackages",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      if (businessEntity) {
        options.headers = {
          "X-Target-Unit": businessEntity
        };
      }

      baseService.fetch(options);
    };
    let getEnterpriseRolesDeferred;
    const getEnterpriseRoles = function(deferred) {
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

      baseService.fetch(options, params);
    };
    let fetchChildRoleDeferred;
    const fetchChildRole = function(enterpriseRoleId, deferred) {
      const params = {enterpriseRoleId : enterpriseRoleId},
       options = {
        url: "applicationRoles?filterSegmentedRole=true&accessPointType=INT&enterpriseRole={enterpriseRoleId}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options, params);
    };
    let fetchDeviceDataDeferred;
    const fetchDeviceData = function(id, deferred) {
      const params = {
          deviceId: id
        },
        options = {
          url: "mobileClient/{deviceId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
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

    return {
      fetchChildRole: function(enterpriseRoleId) {
        fetchChildRoleDeferred = $.Deferred();
        fetchChildRole(enterpriseRoleId, fetchChildRoleDeferred);

        return fetchChildRoleDeferred;
      },
      fetchUserLimitOptions: function(businessEntity) {
        fetchUserLimitOptionsDeferred = $.Deferred();
        fetchUserLimitOptions(fetchUserLimitOptionsDeferred, businessEntity);

        return fetchUserLimitOptionsDeferred;
      },
      fetchUserGroupOptions: function() {
        fetchUserGroupOptionsDeferred = $.Deferred();
        fetchUserGroupOptions(fetchUserGroupOptionsDeferred);

        return fetchUserGroupOptionsDeferred;
      },
      fetchDeviceData: function(Parameters) {
        fetchDeviceDataDeferred = $.Deferred();
        fetchDeviceData(Parameters, fetchDeviceDataDeferred);

        return fetchDeviceDataDeferred;
      },
      getEnterpriseRoles: function() {
        getEnterpriseRolesDeferred = $.Deferred();
        getEnterpriseRoles(getEnterpriseRolesDeferred);

        return getEnterpriseRolesDeferred;
      },
      fetchAccess: function(searchParams) {
        fetchAccessDeferred = $.Deferred();
        fetchAccess(searchParams, fetchAccessDeferred);

        return fetchAccessDeferred;
      },
      fetchUserSegments: function(searchParams) {
        fetchUserSegmentsDeferred = $.Deferred();
        fetchUserSegments(searchParams, fetchUserSegmentsDeferred);

        return fetchUserSegmentsDeferred;
      },
      /**
       * ListAccessPointGroup - fetches the AccessPointGroup List.
       *
       * @returns {Promise}  Returns the promise object.
       */
      listAccessPointGroup: function() {
        const options = {
          url: "accessPointGroups"
        };

        return baseService.fetch(options);
      }
    };
  };

  return new reviewUserUpdateModel();
});
