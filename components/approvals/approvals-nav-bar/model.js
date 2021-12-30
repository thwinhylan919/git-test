define([
  "baseService"
], function (BaseService) {
  "use strict";

  const ApprovalNavBarModel = function () {
    const baseService = BaseService.getInstance(),
      Model = function () {
        this.approvals = {
          partyFirstName: null,
          partyLastName: null,
          userType: "CUSTOMER",
          partyName: null,
          partyDetailsFetched: false,
          additionalDetails: "",
          userTypeLabel: "",
          party: {
            value: "",
            displayValue: ""
          }
        };
      };

    return {
      getNewModel: function () {
        return new Model();
      },
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
      fetchMe: function () {
        return baseService.fetch({
          url: "me"
        });
      },
      fetchMeWithParty: function () {
        return baseService.fetch({
          url: "me/party"
        });
      }
    };
  };

  return new ApprovalNavBarModel();
});