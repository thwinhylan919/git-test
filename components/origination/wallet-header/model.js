define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const headerModel = function() {
    const baseService = BaseService.getInstance(),
      logOut = function() {
        const options = {
          url: "session",
          success: function() {
            const form = document.createElement("form");

            form.action = "/logout.";
            document.body.appendChild(form);
            form.submit();
          }
        };

        baseService.remove(options);
      };
    let checkLoginStatusDeferred;
    const checkLoginStatus = function(deferred) {
      const options = {
        showMessage: false,
        url: "me",
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
      logOut: function() {
        logOut();
      },
      checkLoginStatus: function() {
        checkLoginStatusDeferred = $.Deferred();
        checkLoginStatus(checkLoginStatusDeferred);

        return checkLoginStatusDeferred;
      }
    };
  };

  return new headerModel();
});