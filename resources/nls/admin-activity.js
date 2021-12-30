define([], function () {
  "use strict";

  return new function () {
    return {
      root: {
        adminActivity: {
          labels: {
            heading: "Quick Links",
            groups: {
              OnBoarding: "Onboarding",
              Approvals: "Approvals",
              AccountAccess: "Account Access",
              FileUpload: "File Upload",
              UserManagement: "User Management",
              PartyPreferences: "Party Preferences",
              WorkflowManagement: "Workflow Management",
              ApprovalRules: "Rules Management",
              PartyAccountAccess: "Party Account Access",
              UserAccountAccess: "User Account Access",
              FileIdentifierMaintenance: "File Identifier Maintenance",
              UserFileIdentifierMapping: "User File Identifier Mapping",
              OriginationAdmin: "Origination Administrator",
              WorkflowConfiguration: "Workflow Configuration",
              ResourceAccess: "Resource Access",
              PartyResourceAccess: "Party Resource Access",
              UserResourceAccess: "User Resource Access",
              Configuration: "Configuration",
              OTHERS: "Others",
              ServiceRequestsInfo: "Request Processing",
              Feedback: "Feedback",
              UserHelpDesk: "User Help Desk"
            }
          }
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
});