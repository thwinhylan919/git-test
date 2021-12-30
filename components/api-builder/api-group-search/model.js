define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const APIGroupSearchModel = function () {
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
    let getGroupDetailsDeferred;
    const getGroupDetails = function (deferred, groupCode) {
      const options = {
          url: "builder/api?apiGroup={groupCode}",
          version: "ext",
          success: function (result, status, xhr) {
            deferred.resolve(result, status, xhr);
          },
          error: function (data) {
            deferred.reject(data);
          }
        },
        params = {
          groupCode: groupCode
        };

      baseService.fetch(options, params);
    };

    return {
      getApiGroups: function () {
        getApiGroupsDeferred = $.Deferred();
        getApiGroups(getApiGroupsDeferred);

        return getApiGroupsDeferred;
      },
      getGroupDetails: function (groupCode) {
        getGroupDetailsDeferred = $.Deferred();
        getGroupDetails(getGroupDetailsDeferred, groupCode);

        return getGroupDetailsDeferred;
      }
    };
  };

  return new APIGroupSearchModel();
});