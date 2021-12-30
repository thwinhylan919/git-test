define([
  "baseService"
], function (BaseService) {
  "use strict";

  /**
   * This file contains all the REST services APIs for the bank-look-up component.
   *
   * @class BankLookUpModel
   * @extends BaseService {@link BaseService}
   * @property {Object} baseService - baseService instance through which all the rest calls will be made.
   */
  const WorkflowValidateModel = function () {
    this.approvals = {
      partyId: null,
      userType: "ADMIN",
      partyName: null,
      workflowDetailsFetched: false,
      additionalDetails: "",
      userTypeLabel: ""
    };

    const baseService = BaseService.getInstance(),
      Model = function () {
        this.approvals = {
          partyId: null,
          userType: "ADMIN",
          partyName: null,
          workflowDetailsFetched: false,
          additionalDetails: "",
          userTypeLabel: "",
          workflowCode: null,
          workflowName: "",
          workflowDescription: ""
        };
      };

    return {
      getNewModel: function () {
        return new Model();
      },
      /**
       * This function uses baseService's fetch to GET the bank details data from defined URL as specified in the lookUpUrl variable.
       * @function fetchDetails
       *
       * @param {String} lookUpUrl - String indicating the URL with which the details are to be fetched.
       * @param {Object} deferred - deferred object being passed which handles resolution or rejection of data.
       */
      fetchDetails: function (workflowId, desc) {
        return baseService.fetch({
          url: "approvalWorkflows?workflowName={workflowId}&description={desc}"
        }, {
          workflowId: workflowId,
          desc: desc
        });
      }
    };
  };

  return new WorkflowValidateModel();
});