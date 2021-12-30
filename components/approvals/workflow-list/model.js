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
      searchWorkflow: function (searchURL) {
        return baseService.fetch({
          url: searchURL
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

  return new WorkflowSearchModel();
});