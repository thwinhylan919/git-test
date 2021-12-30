define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const UserGroupSubjectMapSearchModel = function() {
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
      fetchUserGroupListDeferred;
    const fetchUserGroupList = function(deferred) {
      const options = {
        url: "userGroups",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let createMappingDeferred;
    const createMappings = function(payload, deferred) {
      const options = {
        url: "userGroupSubjectMap",
        data: payload,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.add(options);
    };

    return {
      createMappings: function(payload) {
        createMappingDeferred = $.Deferred();
        createMappings(payload, createMappingDeferred);

        return createMappingDeferred;
      },
      fetchUserGroupList: function() {
        fetchUserGroupListDeferred = $.Deferred();
        fetchUserGroupList(fetchUserGroupListDeferred);

        return fetchUserGroupListDeferred;
      }
    };
  };

  return new UserGroupSubjectMapSearchModel();
});