define([], function() {
  "use strict";

  const ApprovalsLocale = function() {
    return {
      root: {
        pageTitle: {
          approvals: "Approvals"
        },
        moduleName: {
          approvals: "Approvals"
        },
        navLabels: {
          workflow: "Approval Workflows",
          userGroup: "User Group",
          rule: "Approval Rules",
          chooseUserType: "Select User Type on which you want to operate",
          userSelection: "User Type Selection",
          adminUser: "Administrative User",
          corporateUser: "Corporate User",
          workflowType: "Workflow Type",
          ruleType: "Rule Type"
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
