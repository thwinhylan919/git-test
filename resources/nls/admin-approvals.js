define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";

  const ApprovalsLocale = function() {
    return {
      root: {
        pageTitle: {
          approvals: "Approvals"
        },
        moduleName: {
          approvals: "Administrator Approvals"
        },
        common: {
          add: "Add",
          approvalDetails: "Approval Details",
          cancelMaintenanceMsg: "Are you sure you want to cancel this maintenance",
          confirmation: "Confirmation",
          empty: "This field cannot be empty",
          invalidError: "Invalid User ID",
          partyid: "Party ID",
          partyname: "Party Name",
          placeholder: {
            pleaseSelect: "Please Select",
            selectUser: "Select User"
          },
          userGroup: "Group Members"
        },
        rules: {
          approvalsRequired: "Approval Required",
          ruleCode: "Rule Code",
          ruleDescription: "Rule Description",
          ruleName: "Rule Name",
          moredetails: "Click for more detail"
        },
        headers: {
          adminUserGroupMaintenance: "Administrator User Group Maintenance",
          adminWorkflowMaintenance: "Administrator Workflow Maintenance",
          review: "Review",
          rulesAdmin: "Administrator Approval Rules",
          view: "View",
          workflowDetails: "View Workflow",
          workflowModify: "Modify Workflow"
        },
        messages: Messages,
        generic: Generic,
        info: {
          noData: "No data to display."
        },
        headings: {
          rulesAdmin: "Administrator Rules Maintenance"
        }
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
es :true,
      "en-us": false,
      el: true
    };
  };

  return new ApprovalsLocale();
});
