define([
    "jquery",
    "baseService"
  ],
  function($, BaseService) {
    "use strict";

    const baseService = BaseService.getInstance();
    let params;
    const UserProfileMaintenanceModel = function() {
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
      let fetchUserProfileMaintenanceDeferred;
      const fetchUserProfileMaintenance = function(deferred) {
        const options = {
          url: "profileConfig",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.fetch(options);
      };

      return {
        fetchUserGroupOptions: function() {
          fetchUserGroupOptionsDeferred = $.Deferred();
          fetchUserGroupOptions(fetchUserGroupOptionsDeferred);

          return fetchUserGroupOptionsDeferred;
        },
        fetchUserProfileMaintenance: function() {
          fetchUserProfileMaintenanceDeferred = $.Deferred();
          fetchUserProfileMaintenance(fetchUserProfileMaintenanceDeferred);

          return fetchUserProfileMaintenanceDeferred;
        }
      };
    };

    return UserProfileMaintenanceModel();
  });
