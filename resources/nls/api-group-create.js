define([], function () {
  "use strict";

  const APIGroupCreateLocale = function () {
    return {
      root: {
        groupCode: "API Group Name",
        groupDesc: "API Group Description",
        endPoint: "End Point Configuration",
        select: "Select",
        groupParameters: "Group Parameters",
        headerName: "API Group Builder",
        hostIP: "Host IP",
        hostPort: "Host Port",
        userName: "User Name",
        password: "Password",
        save: "Save",
        cancel: "Cancel",
        back: "Back",
        yes: "Yes",
        no: "No",
        authorizationRequired: "Authorization Required?",
        authorizationType: "Authorization Type",
        basic: "Basic",
        bearer: "Bearer",
        token: "Token",
        note: "Note",
        description1: "API Group can be created for a set of pass through API(s) falling under a module. All the parameters that are common for an API Group can be configured here.",
        description2: "To view the list of all the API(s) falling under a group, simply click on Service Details link against the module name in the search results.",
        togglePassword: "Toggle Password",
        invalidGroupCode: "Please enter a valid Group Name",
        invalidGroupDesc: "Please enter valid Group Description",
        invalidHostIP: "Please enter a valid Host IP",
        invalidHostPort: "Please enter a valid Host Port",
        invalidUserName: "Please enter a valid User Name",
        invalidPassword: "Please enter a valid Password",
        invalidToken: "Please enter a valid Token"
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
es :true,
      "en-us": false,
      el: false
    };
  };

  return new APIGroupCreateLocale();
});