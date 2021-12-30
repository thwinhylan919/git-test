define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const ReviewUserStatusModel = function() {
    const baseService = BaseService.getInstance();
    let lockStatusDeferred;
    const lockStatus = function(username, payload, deferred) {
      const params = {
          userId: username
        },
        options = {
          url: "users/{userId}/lock",
          data: payload,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        };

      baseService.add(options, params);
    };
    let unlockStatusDeferred;
    const unlockStatus = function(username, deferred) {
      const params = {
          userId: username
        },
        options = {
          url: "users/{userId}/unlock",
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        };

      baseService.add(options, params);
    };

    return {
      lockStatus: function(username, payload) {
        lockStatusDeferred = $.Deferred();
        lockStatus(username, payload, lockStatusDeferred);

        return lockStatusDeferred;
      },
      unlockStatus: function(username) {
        unlockStatusDeferred = $.Deferred();
        unlockStatus(username, unlockStatusDeferred);

        return unlockStatusDeferred;
      }
    };
  };

  return new ReviewUserStatusModel();
});