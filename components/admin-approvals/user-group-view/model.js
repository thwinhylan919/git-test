define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const UserGroupViewModel = function() {
    /**
     * BaseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance(),
      Model = function() {
        return {
          UserGroup: {
            name: null,
            type: "CUSTOMER",
            version: null,
            partyId: null,
            unary: false,
            users: []
          }
        };
      },
      UserModel = function() {
        return {
          userID: null,
          userName: null
        };
      };
    let fetchUserListDeferred;
    const fetchUserList = function(deferred) {
      const options = {
        url: "users?userGroup=Administrator",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let saveModelDeferred;
    const saveModel = function(model, userGroupId, deferred) {
      const options = {
          url: "userGroups/{userGroupId}",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        },
        params = {
          userGroupId: userGroupId,
          model: model
        };

      baseService.update(options, params);
    };
    let createUserGroupDeferred;
    const createUserGroup = function(model, deferred) {
      const options = {
          url: "userGroups",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        },
        params = {
          model: model
        };

      baseService.add(options, params);
    };
    let deleteUserFromGroupDeferred;
    const deleteUserFromGroup = function(userGroupId, deferred) {
      const options = {
          url: "userGroups/{userGroupId}",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          userGroupId: userGroupId
        };

      baseService.remove(options, params);
    };
    let fetchUserGroupDeferred;
    const fetchUserGroup = function(deferred, userId) {
      const options = {
          url: "userGroups/{userId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          userId: userId
        };

      baseService.fetch(options, params);
    };
    let deleteUserGroupDeferred;
    const deleteUserGroup = function(userGroupId, deferred) {
      const options = {
          url: "userGroups/{userGroupId}",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          userGroupId: userGroupId
        };

      baseService.remove(options, params);
    };
    let editUserGroupDeferred;
    const editUserGroup = function(userGroupId, deferred) {
      const options = {
          url: "userGroups/{userGroupId}",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          userGroupId: userGroupId
        };

      baseService.remove(options, params);
    };
    let validateUserDeferred;
    const validateUser = function(userId, deferred) {
      const options = {
        url: "users/{userId}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options, {
        userId: userId
      });
    };

    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      fetchUserList: function() {
        fetchUserListDeferred = $.Deferred();
        fetchUserList(fetchUserListDeferred);

        return fetchUserListDeferred;
      },
      validateUser: function(userId) {
        validateUserDeferred = $.Deferred();
        validateUser(userId, validateUserDeferred);

        return validateUserDeferred;
      },
      getUserModel: function() {
        return new UserModel();
      },
      deleteUserFromGroup: function(userGroupId) {
        deleteUserFromGroupDeferred = $.Deferred();
        deleteUserFromGroup(userGroupId, deleteUserFromGroupDeferred);

        return deleteUserFromGroupDeferred;
      },
      fetchUserGroup: function(userId) {
        fetchUserGroupDeferred = $.Deferred();
        fetchUserGroup(fetchUserGroupDeferred, userId);

        return fetchUserGroupDeferred;
      },
      deleteUserGroup: function(userGroupId) {
        deleteUserGroupDeferred = $.Deferred();
        deleteUserGroup(userGroupId, deleteUserGroupDeferred);

        return deleteUserGroupDeferred;
      },
      editUserGroup: function(userGroupId) {
        editUserGroupDeferred = $.Deferred();
        editUserGroup(userGroupId, editUserGroupDeferred);

        return editUserGroupDeferred;
      },
      saveModel: function(userGroupModel, userGroupId) {
        saveModelDeferred = $.Deferred();
        saveModel(userGroupModel, userGroupId, saveModelDeferred);

        return saveModelDeferred;
      },
      createUserGroup: function(userGroupModel) {
        createUserGroupDeferred = $.Deferred();
        createUserGroup(userGroupModel, createUserGroupDeferred);

        return createUserGroupDeferred;
      }
    };
  };

  return new UserGroupViewModel();
});