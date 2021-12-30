define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const APIGroupViewModel = function () {
    const baseService = BaseService.getInstance();

    let getApiGroupsDeferred;
    const getApiGroups = function (deferred) {
      const options = {
        url: "builder/apiGroup",
        version: "ext",
        success: function (result, status, xhr) {
          deferred.resolve(result, status, xhr);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      getApiGroups: function () {
        getApiGroupsDeferred = $.Deferred();
        getApiGroups(getApiGroupsDeferred);

        return getApiGroupsDeferred;
      }
    };
  };

  return new APIGroupViewModel();
});