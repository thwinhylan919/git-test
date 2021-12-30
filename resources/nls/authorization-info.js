define([], function() {
  "use strict";

  const OriginationLocale = function() {
    return {
      root: {
        searchEnt: "Search entitlements and map them with the policy",
        searchResult: "Search Results",
        mappingDetails: "Mapping Details",
        delWarning: "Delete Warning",
        delConfirm: "Are you sure you want to delete this object?",
        mapDet: "Mapping Details",
        mapRoles: "Mapped Roles",
        customer: "Party",
        targetType: "Target Type",
        roleType: "Role Type",
        roleName: "Role Name",
        resourcePresent: "Resource already present in list.",
        noRes: "Please select resource to be added.",
        effect: "Effect",
        permit: "Permit",
        deny: "Deny",
        service: "Service",
        serviceResponse: "Service Response",
        uiComponent: "User Interface Component",
        page: "Page",
        perform: "Perform",
        showValue: "Show Value",
        showEnabled: "Show Enabled",
        view: "View",
        approve: "Approve",
        actionType: "Action Type",
        resourceType: "{resourceType}",
        authorizationSystem: "Authorization System",
        resourceSelectionMandatory: "Resource must have at least one action type selected",
        enRolePresent: "Enterprise Role {roleName} is already present in the list",
        appRolePresent: "Application Role {appRoleName} is already present in the list",
        selectCatgeory: "Please select category"
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

  return new OriginationLocale();
});
