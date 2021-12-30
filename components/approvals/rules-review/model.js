define([
  "baseService"
], function (BaseService) {
  "use strict";

  const ApprovalRulesModel = function () {
    const baseService = BaseService.getInstance();

    return {
      fetchPartyDetails: function (partyId) {
        return baseService.fetch({
          url: "administration/parties/{partyId}"
        }, {
          partyId: partyId
        });
      },
      fetchRuleDetails: function (ruleId) {
        return baseService.fetch({
          url: "approvalRules/{ruleId}"
        }, {
          ruleId: ruleId
        });
      },
      getTransactionName: function (taskId) {
        return baseService.fetch({
          url: "resourceTasks/{taskId}"
        }, {
          taskId: taskId
        });
      },
      getWorkflowDetails: function (workFlowId) {
        return baseService.fetch({
          url: "approvalWorkflows/{workFlowId}"
        }, {
          workFlowId: workFlowId
        });
      }
    };
  };

  return new ApprovalRulesModel();
});