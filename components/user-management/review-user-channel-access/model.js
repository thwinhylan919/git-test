define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const ReviewUserChannelAccessModel = function() {
    const baseService = BaseService.getInstance();
    let deleteUserDeferred ,grantUserDeferred;
    const deleteUser = function(username, payload, deferred) {
      const params = {
        userId: username
      },
        options = {
          url: "users/" + username + "/revoke",
          data: payload,
          success: function (data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function (data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
        }
      };

      baseService.add(options, params);
    },
     grantUser = function (username, deferred) {
      const params = {
          userId: username
        },
        options = {
          url: "users/" + username + "/grant",
          success: function (data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        };

      baseService.add(options, params);
    };

    return {
      deleteUser: function(username, payload) {
        deleteUserDeferred = $.Deferred();
        deleteUser(username, payload, deleteUserDeferred);

        return deleteUserDeferred;
      },
      grantUser: function (username) {
        grantUserDeferred = $.Deferred();
        grantUser(username, grantUserDeferred);

        return grantUserDeferred;

      }
    };
  };

  return new ReviewUserChannelAccessModel();
});