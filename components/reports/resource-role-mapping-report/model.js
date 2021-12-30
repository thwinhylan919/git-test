define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const reportGenerationModel = function () {
    const Model = function () {
        this.reportParams = {
          childRole: null
        };
      },
      baseService = BaseService.getInstance();
    let fetchChildRoleDeferred;
    const fetchChildRole = function (enterpriseRoleId, deferred) {
      const params = {
          enterpriseRoleId: enterpriseRoleId
        },
        options = {
          url: "applicationRoles?enterpriseRole={enterpriseRoleId}",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchParentRoleDeferred;
    const fetchParentRole = function (deferred) {
      const options = {
        url: "enterpriseRoles?isLocal=true",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      getNewModel: function (dataModel) {
        return new Model(dataModel);
      },
      fetchChildRole: function (enterpriseRoleId) {
        fetchChildRoleDeferred = $.Deferred();
        fetchChildRole(enterpriseRoleId, fetchChildRoleDeferred);

        return fetchChildRoleDeferred;
      },
      fetchParentRole: function () {
        fetchParentRoleDeferred = $.Deferred();
        fetchParentRole(fetchParentRoleDeferred);

        return fetchParentRoleDeferred;
      }
    };
  };

  return new reportGenerationModel();
});