define([
  "baseService"
], function (BaseService) {
  "use strict";

  const RulesAdminModel = function () {
    const Model = function () {
        this.approvals = {
          partyId: "",
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