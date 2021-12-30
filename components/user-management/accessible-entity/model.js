define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const accessibleEntityModel = function () {
    const baseService = BaseService.getInstance();
    let fetchAccessDeferred;
    const fetchAccess = function (searchParams, deferred) {
      const options = {
        url: "accessPoints?accessType={accessType}&accessPointStatus=Y",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options, searchParams);
    };
    let fetchUserLimitOptionsDeferred;
    const fetchUserLimitOptions = function (deferred, businessEntity, assignableEntitiesData) {
      const params = {
        assignableEntitiesData: assignableEntitiesData
      },
        options = {
          url: "limitPackages?assignableEntities={assignableEntitiesData}",
          success: function (data) {
            deferred.resolve(data);
          }
        };

      if (businessEntity) {
        options.headers = {
          "X-Target-Unit": businessEntity
        };
      }

      baseService.fetch(options, params);
    };

    return {
      fetchUserLimitOptions: function (businessEntity, assignableEntitiesData) {
        fetchUserLimitOptionsDeferred = $.Deferred();
        fetchUserLimitOptions(fetchUserLimitOptionsDeferred, businessEntity, assignableEntitiesData);

        return fetchUserLimitOptionsDeferred;
      },
      fetchAccess: function (searchParams) {
        fetchAccessDeferred = $.Deferred();
        fetchAccess(searchParams, fetchAccessDeferred);

        return fetchAccessDeferred;
      }
    };
  };

  return new accessibleEntityModel();
});
