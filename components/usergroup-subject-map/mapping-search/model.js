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
        url: "userGroups?userGroupType=ADMIN",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchMappinListDeferred;
    const fetchMappinList = function(parameters, deferred) {
      const params = {
          mappingCode: parameters.mappingCode,
          mappingDescription: parameters.mappingDesc,
          groupId: parameters.groupId
        },
        options = {
          url: "userGroupSubjectMap?mappingCode={mappingCode}&mappingDescription={mappingDescription}&groupId={groupId}",
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
    };

    return {
      fetchUserGroupList: function() {
        fetchUserGroupListDeferred = $.Deferred();
        fetchUserGroupList(fetchUserGroupListDeferred);

        return fetchUserGroupListDeferred;
      },
      fetchMappinList: function(parameters) {
        fetchMappinListDeferred = $.Deferred();
        fetchMappinList(parameters, fetchMappinListDeferred);

        return fetchMappinListDeferred;
      },
      init: function() {
        const modelInitialized = true;

        return modelInitialized;
      }
    };
  };

  return new UserGroupSubjectMapSearchModel();
});