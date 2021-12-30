define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const UserCreationModel = function() {
    const Model = function() {
        this.username = null;
        this.password = null;
        this.registrationId = null;
      },
      baseService = BaseService.getInstance();
    let createLogInDeferred, fetchPasswordPolicyDeferred;
    const createLogIn = function(registrationId, payload, deferred) {
        const options = {
          url: "registration/" + registrationId + "/credentials",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.add(options);
      },
      fetchPasswordPolicy = function(deferred) {
        const options = {
          url: "passwordPolicy",
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
      getNewModel: function() {
        return new Model();
      },
      createLogIn: function(registrationId, payload) {
        createLogInDeferred = $.Deferred();
        createLogIn(registrationId, payload, createLogInDeferred);

        return createLogInDeferred;
      },
      fetchPasswordPolicy: function() {
        fetchPasswordPolicyDeferred = $.Deferred();
        fetchPasswordPolicy(fetchPasswordPolicyDeferred);

        return fetchPasswordPolicyDeferred;
      }
    };
  };

  return new UserCreationModel();
});