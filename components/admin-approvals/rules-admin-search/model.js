define([
  "baseService"
], function (BaseService) {
  "use strict";

  const RulesAdminModel = function () {
    const Model = function () {
        this.approvals = {
          description: "",
          party: {
            value: null,
            displayValue: null
          },
          initiatorUserGroup: "",
          ruleName: "",
          workflowId: "",
          ruleDetailsFetched: null
        };
      },
      baseService = BaseService.getInstance();

    return {
      getNewModel: function (modelData) {
        return new Model(modelData);
      },
      getTransactions: function (taskType) {
        return baseService.fetch({
          url: "resourceTasks?taskType={taskType}&aspects=approval"
        }, {
          taskType: taskType
        });
      },
      fetchDetails: function (ruleParams) {
        return baseService.fetch({
          url: "approvalRules?partyId={partyId}&description={description}&initiatorUserGroup={initiatorUserGroup}&ruleName={ruleName}&workflowId={workflowId}"
        }, {
          partyId: ruleParams.partyId,
          description: ruleParams.description,
          initiatorUserGroup: ruleParams.initiatorUserGroup,
          ruleName: ruleParams.ruleName,
          workflowId: ruleParams.workflowId
        });
      }
    };
  };

  return new RulesAdminModel();
});