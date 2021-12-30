define([
  "baseService"
], function (BaseService) {
  "use strict";

  const UserGroupListModel = function () {
    const baseService = BaseService.getInstance(),
      Model = function () {
        this.approvals = {
          partyId: null,
          userType: "CUSTOMER",
          partyName: null,
          partyDetailsFetched: false,
          additionalDetails: "",
          userTypeLabel: ""
        };
      };

    return {
      getNewModel: function () {
        return new Model();
      },
      /**
       * FetchUserGroupSearchList - fetch the user group with given details.
       *
       * @param  {string} userType - User type.
       * @param  {string} partyId - Party id.
       * @param  {string} userGroupName - User group name.
       * @param  {string} userId - User unique identifier.
       *
       *  @return {Promise}  Returns the promise object.
       */
      fetchUserGroupSearchList: function (userType, partyId, userGroupName, userId) {
        return baseService.fetch({
          url: "userGroups?partyId={partyId}&userGroupName={userGroupName}&userId={userId}&userGroupType={userType}"
        }, {
          partyId: partyId,
          userGroupName: userGroupName,
          userId: userId,
          userType: userType
        });
      },
      /**
       * FetchDetails - fetch the user group details for given user group.
       *
       * @param  {string} userGroupType - User group type.
       * @param  {string} partyId - Party id.
       * @param  {string} userGroupName - User group name.
       * @param  {string} description - User group description.
       *
       *  @return {Promise}  Returns the promise object.
       */
      fetchDetails: function (userGroupType, partyId, userGroupName, description) {
        return baseService.fetch({
          url: "userGroups?partyId={partyId}&userGroupName={userGroupName}&description={description}&userGroupType={userGroupType}"
        }, {
          partyId: partyId,
          userGroupName: userGroupName,
          description: description,
          userGroupType: userGroupType
        });
      }
    };
  };

  return new UserGroupListModel();
});