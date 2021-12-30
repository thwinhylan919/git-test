define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const ReviewMailerEditModel = function () {
    const baseService = BaseService.getInstance();
    let listEnterpriseRolesDeferred;
    const listEnterpriseRoles = function (deferred) {
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
    let fetchUserSegmentsDeferred;
    const fetchUserSegments = function (searchParams, deferred) {
      const options = {
        url: "segments?enterpriseRole={selectedUser}&status=ENABLED",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options, searchParams);
    };
    let updateMailerDeferred;
    const updateMailer = function (payload, deferred) {
      const options = {
        url: "mailers",
        data: payload,
        success: function (data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        },
        error: function (data, status, jqXHR) {
          deferred.reject(data, status, jqXHR);
        }
      };

      baseService.update(options);
    };

    return {
      listEnterpriseRoles: function () {
        listEnterpriseRolesDeferred = $.Deferred();
        listEnterpriseRoles(listEnterpriseRolesDeferred);

        return listEnterpriseRolesDeferred;
      },
      fetchUserSegments: function (searchParams) {
        fetchUserSegmentsDeferred = $.Deferred();
        fetchUserSegments(searchParams, fetchUserSegmentsDeferred);

        return fetchUserSegmentsDeferred;
      },
      updateMailer: function (payload) {
        updateMailerDeferred = $.Deferred();
        updateMailer(payload, updateMailerDeferred);

        return updateMailerDeferred;
      }
    };
  };

  return new ReviewMailerEditModel();
});