define([
  "baseService"
], function (BaseService) {
  "use strict";

  const approvalsRulesModel = function () {
    const Model = function () {
        return {
          rulesSearchPayload: {
            ruleName: "",
            userGroupName: "",
            name: "",
            approvalRequired: ""
          },
          approvals: {
            userType: "CUSTOMER",
            partyName: null,
            partyFirstName: "",
            partyLastName: "",
            partyDetailsFetched: false,
            additionalDetails: "",
            userTypeLabel: null,
            party: {
              value: null,
              displayValue: null
            }
          }
        };
      },
      baseService = BaseService.getInstance();

    return {
      searchRules: function (searchURL) {
        return baseService.fetch({
          url: searchURL
        });
      },
      getUserGroupsList: function (partyId, userType) {
        return baseService.fetch({
          url: "userGroups?partyId={partyId}&userGroupType={userType}"
        }, {
          partyId: partyId,
          userType: userType
        });
      },
      getWorkflow: function (partyId) {
        return baseService.fetch({
          url: "approvalWorkflows?partyId={partyId}"
        }, {
          partyId: partyId
        });
      },
      getPartyDetails: function (partyId) {
        return baseService.fetch({
          url: "administration/parties/{partyId}"
        }, {
          partyId: partyId
        });
      },
      deleteRule: function (ruleId) {
        return baseService.remove({
          url: "approvalRules/{ruleId}"
        }, {
          ruleId: ruleId
        });
      },
      getNewModel: function (dataModel) {
        return new Model(dataModel);
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

  return new approvalsRulesModel();
});