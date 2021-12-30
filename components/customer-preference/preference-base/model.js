define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const PreferenceBaseModel = function() {
    const baseService = BaseService.getInstance();
    /**
     * Function to get new instance of ApplicationRolesCreateModel
     *
     * @function
     * @memberOf PreferenceBaseModel
     * @returns Model
     */
    let
      modelInitialized = false,
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      /**
       * This function fires 'GET' for LimitGroups of particular party id
       * @memberOf PreferenceBaseModel
       **/
      fetchLimitGroupsDeferred;
    const fetchLimitGroups = function(search_params, deferred) {
      const params = {
          assignableEntities: JSON.stringify(search_params.assignableEntities)
        },
        options = {
          url: "limitPackages?assignableEntities={assignableEntities}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };

    return {
      init: function() {
        modelInitialized = true;

        return modelInitialized;
      },
      fetchLimitGroups: function(params) {
        fetchLimitGroupsDeferred = $.Deferred();
        fetchLimitGroups(params, fetchLimitGroupsDeferred);

        return fetchLimitGroupsDeferred;
      }
    };
  };

  return new PreferenceBaseModel();
});