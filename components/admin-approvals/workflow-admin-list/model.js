define([
  "baseService"
], function (BaseService) {
  "use strict";

  const WorkflowSearchModel = function () {
    const baseService = BaseService.getInstance(),
      Model = function () {
        this.workflowSearch = {
          name: null,
          description: null,
          steps: [{
            sequenceNo: "1",
            paneldto: {
              panelId: null
            }
          }]
        };

        this.approvals = {
          partyId: null,
          userType: "ADMIN",
          partyName: null,
          workflowDetailsFetched: false,
          additionalDetails: "",
          userTypeLabel: "",
          workflowCode: null,
          workflowDescription: ""
        };
      };

    return {
      getNewModel: function () {
        return new Model();
      },
      searchWorkflow: function (workflowName, description) {
        return baseService.fetch({
          url: "approvalWorkflows?workflowName={workflowName}&description={description}"
        }, {
          workflowName: workflowName,
          description: description
        });
      }
    };
  };

  return new WorkflowSearchModel();
});