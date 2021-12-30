define(["baseService"], function (BaseService) {
  "use strict";

  const WorkflowViewModel = function () {
    /**
     * BaseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance(),
      Model = function () {
        return {
          UserGroup: {
            name: null,
            type: null,
            partyId: null,
            unary: false,
            users: []
          },
          workflowPayload: {
            name: null,
            description: null,
            workFlowId: null,
            partyId: null,
            version: null,
            steps: [{
              sequenceNo: "1",
              userGroup: {
                id: null,
                name: null,
                partyId: null,
                unary: false,
                users: [{
                  userId: null,
                  firstName: null,
                  lastName: null
                }]
              }
            }]
          }
        };
      },
      UserModel = function () {
        return {
          userID: null,
          userName: null
        };
      };

    return {
      getNewModel: function (modelData) {
        return new Model(modelData);
      },
      getUserModel: function () {
        return new UserModel();
      },
      readWorkflow: function (workflowId) {
        return baseService.fetch({
          url: "approvalWorkflows/{workflowId}"
        }, {
          workflowId: workflowId
        });
      },
      fetchUserList: function (partyId) {
        return baseService.fetch({
          url: "users?partyId={partyId}"
        }, {
          partyId: partyId
        });
      },
      updateWorkflow: function (workflowUpdatePayload, workflowId) {
        return baseService.update({
          url: "approvalWorkflows/{workflowId}",
          data: workflowUpdatePayload
        }, {
          workflowId: workflowId
        });
      },
      saveModel: function (userGroupModel, userGroupId) {
        return baseService.update({
          url: "userGroups/{userGroupId}"
        }, {
          userGroupId: userGroupId,
          data: userGroupModel
        });
      },
      createWorkflow: function (workflowCreatePayload) {
        return baseService.add({
          url: "approvalWorkflows",
          data: workflowCreatePayload
        });
      }
    };
  };

  return new WorkflowViewModel();
});