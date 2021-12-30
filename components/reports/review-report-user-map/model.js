define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const reviewReportUserMapModel = function () {
    const
      baseService = BaseService.getInstance();
    let listAllReportsDeferred;
    const listAllReports = function (deferred, url) {
      const options = {
        url: url,
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchUserDetailsDeferred;
    const fetchUserDetails = function (deferred, userId) {
      const options = {
          url: "users/{userId}",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        },
        params = {
          userId: userId
        };

      baseService.fetch(options, params);
    };

    return {
      listAllReports: function (url) {
        listAllReportsDeferred = $.Deferred();
        listAllReports(listAllReportsDeferred, url);

        return listAllReportsDeferred;
      },
      fetchUserDetails: function (userId) {
        fetchUserDetailsDeferred = $.Deferred();
        fetchUserDetails(fetchUserDetailsDeferred, userId);

        return fetchUserDetailsDeferred;
      }
    };
  };

  return new reviewReportUserMapModel();
});