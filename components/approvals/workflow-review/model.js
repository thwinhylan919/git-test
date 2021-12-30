define([
  "baseService"
], function (BaseService) {
  "use strict";

  /**
   * This file contains the Tech Agnostic Service
   * consisting of all the REST services APIs for the product component.
   *
   * @namespace CoApp~service
   * @class ProductService
   * @extends BaseService {@link BaseService}
   */
  const UserGroupReviewModel = function () {
    const UserModel = function () {
        this.userID = null;
        this.userName = null;
      },
      baseService = BaseService.getInstance();

    return {
      fetchUserDetails: function (userId) {
        return baseService.fetch({
          url: "users/{userId}"
        }, {
          userId: userId
        });
      },
      validateUser: function (userId) {
        return baseService.fetch({
          url: "users/{userId}"
        }, {
          userId: userId
        });
      },
      createUser: function (userId) {
        return baseService.add({
          url: "users/{userId}"
        }, {
          userId: userId
        });
      },
      getUserModel: function () {
        return new UserModel();
      },
      saveModel: function (userGroupModel, userGroupId) {
        return baseService.update({
          url: "userGroups/{userGroupId}",
          data: userGroupModel
        }, {
          userGroupId: userGroupId
        });
      }
    };
  };

  return new UserGroupReviewModel();
});