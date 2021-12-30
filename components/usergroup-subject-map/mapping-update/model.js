define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const UserGroupSubjectMapUpdateModel = function() {
    const baseService = BaseService.getInstance();
    /**
     * In case more than one instance of model is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf ExclusionModel~ExclusionModel
     */
    let
      updateMappingsDeferred;
    const updateMappings = function(payload, mappingId, deferred) {
      const params = {
          mappingId: mappingId
        },
        options = {
          url: "userGroupSubjectMap/{mappingId}",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };

      baseService.update(options, params);
    };

    return {
      updateMappings: function(payload, mappingId) {
        updateMappingsDeferred = $.Deferred();
        updateMappings(payload, mappingId, updateMappingsDeferred);

        return updateMappingsDeferred;
      }
    };
  };

  return new UserGroupSubjectMapUpdateModel();
});