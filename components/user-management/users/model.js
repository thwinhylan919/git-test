define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const UsersModel = function() {
    const baseService = BaseService.getInstance();
    /**
     * Function to get new instance of ApplicationRolesCreateModel
     *
     * @function
     * @memberOf UsersModel
     * @returns Model
     */
    let
      /**
       * This function fires a GET request to fetch the user groups options
       * and delegates control to the successhandler along with response data
       * once the details are successfully fetched
       *
       * @function fetchUserGroupOptions
       * @memberOf UsersCreateModel
       * @example UsersCreateModel.fetchUserGroupOptions();
       */
      fetchUserGroupOptionsDeferred;
    const fetchUserGroupOptions = function(deferred) {
      const params = {
          isLocal: true
        },
        options = {
          url: "enterpriseRoles?isLocal={isLocal}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchCountryDeferred;
    const fetchCountry = function(deferred) {
      const options = {
        url: "enumerations/country",
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
      fetchCountry: function() {
        fetchCountryDeferred = $.Deferred();
        fetchCountry(fetchCountryDeferred);

        return fetchCountryDeferred;
      },
      fetchUserGroupOptions: function() {
        fetchUserGroupOptionsDeferred = $.Deferred();
        fetchUserGroupOptions(fetchUserGroupOptionsDeferred);

        return fetchUserGroupOptionsDeferred;
      }
    };
  };

  return new UsersModel();
});