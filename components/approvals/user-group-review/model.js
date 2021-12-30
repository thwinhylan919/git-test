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
    const Model = function () {
        this.UserModel = {
          userID: null,
          userName: null
        };
      },
      baseService = BaseService.getInstance();

    return {
      getNewModel: function (modelData) {
        return new Model(modelData);
      },
      fetchPartyDetails: function (partyId) {
        return baseService.fetch({
          url: "administration/parties/{partyId}"
        }, {
          partyId: partyId
        });
      },
      validateUser: function (userId) {
        return baseService.fetch({
          url: "users/{userId}"
        }, {
          userId: userId
        });
      }
    };
  };

  return new UserGroupReviewModel();
});