define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const entityLimitModel = function () {
    const baseService = BaseService.getInstance();
    let fetchUserLimitOptionsDeferred;
    const fetchUserLimitOptions = function (deferred, businessEntity) {
      const params = {
          businessEntity: businessEntity
        },
         options = {
          url: "limitPackages?businessEntity={businessEntity}",
          success: function (data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
    };

    return {
      fetchUserLimitOptions: function (businessEntity) {
        fetchUserLimitOptionsDeferred = $.Deferred();
        fetchUserLimitOptions(fetchUserLimitOptionsDeferred, businessEntity);

        return fetchUserLimitOptionsDeferred;
      }
    };
  };

  return new entityLimitModel();
});