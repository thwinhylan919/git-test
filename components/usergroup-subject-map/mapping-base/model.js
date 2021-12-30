define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const UserGroupSubjectBaseModel = function() {
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

    return {
      fetchUserGroupList: function() {
        fetchUserGroupListDeferred = $.Deferred();
        fetchUserGroupList(fetchUserGroupListDeferred);

        return fetchUserGroupListDeferred;
      }
    };
  };

  return new UserGroupSubjectBaseModel();
});