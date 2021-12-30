define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    PasswordPolicyReadModel = function() {
      const Model = function() {
        this.checkboxValues = {
          lowerCaseMandatory: "lowerCaseMandatory",
          upperMandatory: "upperMandatory",
          specialCharMandatory: "specialCharMandatory",
          numericMandatory: "numericMandatory"
        };
      };
      /**
       * This function fires a GET request to fetch the user groups options
       * and delegates control to the successhandler along with response data
       * once the details are successfully fetched
       *
       * @function fetchUserGroupOptions
       * @memberOf PasswordPolicyEditModel
       * @example PasswordPolicyEditModel.fetchUserGroupOptions();
       */
      let
        fetchUserGroupOptionsDeferred;
      const fetchUserGroupOptions = function(deferred) {
        const options = {
          url: "enterpriseRoles?isLocal=true",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.fetch(options);
      };
      let fetchPasswordPolicyDetailsDeferred;
      const fetchPasswordPolicyDetails = function(id, deferred) {
        const params = {id : id},
         options = {
          url: "passwordPolicy/{id}",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options, params);
      };
      let deletePasswordPolicyDeferred;
      const deletePasswordPolicy = function(id, deferred) {
        const options = {
          url: "passwordPolicy/{id}",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };

        baseService.remove(options, id);
      };

      return {
        getNewModel: function(modelData) {
          return new Model(modelData);
        },
        fetchUserGroupOptions: function() {
          fetchUserGroupOptionsDeferred = $.Deferred();
          fetchUserGroupOptions(fetchUserGroupOptionsDeferred);

          return fetchUserGroupOptionsDeferred;
        },
        fetchPasswordPolicyDetails: function(id) {
          fetchPasswordPolicyDetailsDeferred = $.Deferred();
          fetchPasswordPolicyDetails(id, fetchPasswordPolicyDetailsDeferred);

          return fetchPasswordPolicyDetailsDeferred;
        },
        deletePasswordPolicy: function(id) {
          deletePasswordPolicyDeferred = $.Deferred();
          deletePasswordPolicy(id, deletePasswordPolicyDeferred);

          return deletePasswordPolicyDeferred;
        }
      };
    };

  return new PasswordPolicyReadModel();
});
