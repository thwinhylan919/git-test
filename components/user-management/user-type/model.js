define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Model for UserTypeModel section.
   *
   * @namespace UserTypeModel code~UserTypeModel
   * @class
   */
  const UserTypeModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @private
     */
    const baseService = BaseService.getInstance();
    let params,
      modelInitialized = false,
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
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
      const options = {
        url: "enterpriseRoles?isLocal=true",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options, params);
    };
    let showPartyDetailsDeferred;
    const showPartyDetails = function(deferred) {
      const options = {
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
      init: function() {
        modelInitialized = true;

        return modelInitialized;
      },
      fetchUserGroupOptions: function() {
        fetchUserGroupOptionsDeferred = $.Deferred();
        fetchUserGroupOptions(fetchUserGroupOptionsDeferred);

        return fetchUserGroupOptionsDeferred;
      },
      showPartyDetails: function() {
        showPartyDetailsDeferred = $.Deferred();
        showPartyDetails(showPartyDetailsDeferred);

        return showPartyDetailsDeferred;
      }
    };
  };

  return new UserTypeModel();
});