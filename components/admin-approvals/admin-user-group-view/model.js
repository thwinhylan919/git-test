define([
  "baseService"
], function (BaseService) {
  "use strict";

  const UserGroupViewModel = function () {
    /**
     * BaseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance(),
      Model = function () {
        this.UserGroup = {
          name: null,
          type: "CUSTOMER",
          version: null,
          partyId: null,
          unary: false,
          users: []
        };
      },
      UserModel = function () {
        return {
          userID: null,
          userName: null,
          showUserName: null
        };
      };

    return {
      getNewModel: function (modelData) {
        return new Model(modelData);
      },
      fetchUserList: function () {
        return baseService.fetch({
          url: "users?userGroup=Administrator"
        });
      },
      validateUser: function (userId) {
        return baseService.fetch({
          url: "users/{userId}"
        }, {
          userId: userId
        });
      },
      getUserModel: function () {
        return new UserModel();
      },
      deleteUserFromGroup: function (userGroupId) {
        return baseService.remove({
          url: "userGroups/{userGroupId}"
        }, {
          userGroupId: userGroupId
        });
      },
      fetchUserGroup: function (userId) {
        return baseService.fetch({
          url: "userGroups/{userId}"
        }, {
          userId: userId
        });
      },
      deleteUserGroup: function (userGroupId) {
        return baseService.remove({
          url: "userGroups/{userGroupId}"
        }, {
          userGroupId: userGroupId
        });
      },
      editUserGroup: function (userGroupId) {
        return baseService.remove({
          url: "userGroups/{userGroupId}"
        }, {
          userGroupId: userGroupId
        });
      },
      saveModel: function (userGroupModel, userGroupId) {
        return baseService.update({
          url: "userGroups/{userGroupId}",
          data: userGroupModel
        }, {
          userGroupId: userGroupId
        });
      },
      createUserGroup: function (userGroupModel) {
        return baseService.add({
          url: "userGroups",
          data: userGroupModel
        });
      }
    };
  };

  return new UserGroupViewModel();
});