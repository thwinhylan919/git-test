define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const ApplicationRolesSearchModel = function() {
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
      }
    };
  };

  return new ApplicationRolesSearchModel();
});