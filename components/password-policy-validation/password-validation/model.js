define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Model file for changing password. This file contains the model definition
   * for change-password and exports the PasswordValidationModel model which can be used
   * as a component.
   *
   * @namespace ChangePassword~PasswordValidationModel
   * @class
   * @property {Object} Model - Object containing the old and new password's values
   * @property {string} Model.oldPassword - value of old password entered
   * @property {string} Model.changedPassword - value of new password entered
   */
  const PasswordValidationModel = function() {
    const Model = function() {
        this.oldPassword = null;
        this.changedPassword = null;
      },
      baseService = BaseService.getInstance();
    let changePasswordDeferred, fetchPasswordPolicyDeferred;
    const changePassword = function(payload, deferred) {
        const options = {
          url: "me/credentials",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.update(options);
      },
      fetchPasswordPolicy = function(searchParams, deferred) {
        let roles = "roles=" + searchParams.roles[0];

        if (searchParams.roles.length >= 1) {
          for (let i = 1; i < searchParams.roles.length; i++) {
            roles = roles + "&roles=" + searchParams.roles[i];
          }
        }

        const
          options = {
            url: "passwordPolicy?{roles}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };

        baseService.fetch(options, roles);
      },
      /**
       * Function executes the request to logout.
       *
       * @function logOut
       * @memberOf PasswordValidationModel
       **/
      logOut = function() {
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage("logout");
        }

        const options = {
          url: "session",
          success: function() {
            const form = document.createElement("form");

            form.action = "/logout.";
            document.body.appendChild(form);

            setTimeout(function() {
              window.location = "/index.html?module=login";
            }, 1200);

            form.submit();
          }
        };

        baseService.remove(options);
      };

    return {
      getNewModel: function() {
        return new Model();
      },
      changePassword: function(payload) {
        changePasswordDeferred = $.Deferred();
        changePassword(payload, changePasswordDeferred);

        return changePasswordDeferred;
      },
      fetchPasswordPolicy: function(params) {
        fetchPasswordPolicyDeferred = $.Deferred();
        fetchPasswordPolicy(params, fetchPasswordPolicyDeferred);

        return fetchPasswordPolicyDeferred;
      },
      logOut: function() {
        return logOut();
      }
    };
  };

  return new PasswordValidationModel();
});
