define([
  "baseService"
], function (BaseService) {
  "use strict";

  const approvalsRulesModel = function () {
    const Model = function () {
        return {
          approvals: {
            party: {
              value: null,
              displayValue: null
            },
            userType: "CUSTOMER",
            partyName: null,
            ruleDetailsFetched: false,
            additionalDetails: "",
            userTypeLabel: "",
            selectedTransaction: ""
          },
          rulesCreatePayload: {
            approvalRequired: null,
            ruleId: null,
            ruleName: null,
            version: null,
            description: null,
            initiatorUserGroup: {
              id: null,
              name: null,
              partyId: null,
              unary: false,
              users: [{
                userId: null
              }]
            },
            party: null,
            workflowDto: {
              name: null,
              workFlowId: null
            },
            associatedRuleCriterias: []
          }
        };
      },
      baseService = BaseService.getInstance();

    return {
      createRules: function (rulesCreatePayload) {
        return baseService.add({
          url: "approvalRules",
          data: rulesCreatePayload
        });
      },
      fetchPartyDetails: function (partyId) {
        return baseService.fetch({
          url: "administration/parties/{partyId}"
        }, {
          partyId: partyId
        });
      },
      updateRules: function (rulesCreatePayload, ruleId) {
        return baseService.update({
          url: "approvalRules/{ruleId}",
          data: rulesCreatePayload
        }, {
          ruleId: ruleId
        });
      },
      fetchRule: function (ruleId) {
        return baseService.fetch({
          url: "approvalRules/{ruleId}"
        }, {
          ruleId: ruleId
        });
      },
      getWorkflowDetails: function (workFlowId) {
        return baseService.fetch({
          url: "approvalWorkflows/{workFlowId}"
        }, {
          workFlowId: workFlowId
        });
      },
      deleteRule: function (ruleId) {
        return baseService.remove({
          url: "approvalRules/{ruleId}"
        }, {
          ruleId: ruleId
        });
      },
      getUserType: function () {
        return baseService.fetch({
          url: "approvals/userType"
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
      getUserGroupsList: function (partyId, userType) {
        return baseService.fetch({
          url: "userGroups?partyId={partyId}&userGroupType={userType}"
        }, {
          partyId: partyId,
          userType: userType
        });
      },
      getUserAccounts: function (partyId) {
        return baseService.fetch({
          url: "accountAccess?partyId={partyId}&accountType=CSA"
        }, {
          partyId: partyId
        });
      },
      getNonFinancialTransactionRules: function (taskType) {
        return baseService.fetch({
          url: "ruleCriteria?taskType={taskType}&userType=ADMIN"
        }, {
          taskType: taskType
        });
      },
      getAdminTransactionRules: function (taskType) {
        return baseService.fetch({
          url: "ruleCriteria?taskType={taskType}&userType=ADMIN"
        }, {
          taskType: taskType
        });
      },
      getTransactions: function (taskType) {
        return baseService.fetch({
          url: "resourceTasks?taskType={taskType}&aspects=approval"
        }, {
          taskType: taskType
        });
      },
      getTransactionName: function (taskId) {
        return baseService.fetch({
          url: "resourceTasks/{taskId}"
        }, {
          taskId: taskId
        });
      },
      getLocalCurrency: function () {
        return baseService.fetch({
          url: "bankConfiguration"
        });
      },
      getNewModel: function () {
        return new Model();
      }
    };
  };

  return new approvalsRulesModel();
});