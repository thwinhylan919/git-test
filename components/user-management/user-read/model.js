define([
  "jquery",
  "baseService"
  ], function($, BaseService) {
  "use strict";

  /**
   * Model for UsersCreateModel section.
   *
   * @namespace UsersCreateModel code~UsersCreateModel
   * @class
   */
  const UserReadModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @private
     */
    const baseService = BaseService.getInstance();
    let
      fetchChildRoleDeferred;
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
    let fetchAccessDeferred;
    const fetchAccess = function(searchParams, deferred) {
      const options = {
        url: "accessPoints?accessType=All",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options, searchParams);
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
    let resetPasswordDeferred;
    const resetPassword = function(username, deferred) {
      const params = {
          userId: username
        },
        options = {
          url: "users/{userId}/resetCredentials",
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        };

      baseService.update(options, params);
    };
    let readUserDeferred;
    const readUser = function(id, deferred) {
        const params = {
            userId: id
          },
          options = {
            url: "users/{userId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };

        baseService.fetch(options, params);
      },
      downloadUserDetails = function(id) {
        const params = {
            userId: id
          },
          options = {
            url: "users/{userId}/?media=text/csv&mediaFormat=csv"
          };

        baseService.downloadFile(options, params);
      };
    let fetchDeviceCountDeferred;
    const fetchDeviceCount = function(username, deferred) {
      const params = {
          userId: username
        },
        options = {
          url: "mobileClient/registeredDevices/{userId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchDeviceCountForPushNotificationDeferred;
    const fetchDeviceCountForPushNotification = function(username, deferred) {
      const params = {
          userId: username
        },
        options = {
          url: "mobileClient/registeredPushToken/{userId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
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
      resetPassword: function(username) {
        resetPasswordDeferred = $.Deferred();
        resetPassword(username, resetPasswordDeferred);

        return resetPasswordDeferred;
      },
      readUser: function(Parameters) {
        readUserDeferred = $.Deferred();
        readUser(Parameters, readUserDeferred);

        return readUserDeferred;
      },
      downloadUserDetails: function(Parameters) {
        downloadUserDetails(Parameters);
      },
      fetchDeviceCount: function(Parameters) {
        fetchDeviceCountDeferred = $.Deferred();
        fetchDeviceCount(Parameters, fetchDeviceCountDeferred);

        return fetchDeviceCountDeferred;
      },
      fetchDeviceCountForPushNotification: function(Parameters) {
        fetchDeviceCountForPushNotificationDeferred = $.Deferred();
        fetchDeviceCountForPushNotification(Parameters, fetchDeviceCountForPushNotificationDeferred);

        return fetchDeviceCountForPushNotificationDeferred;
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

  return new UserReadModel();
});