define([], function () {
  "use strict";

  const APIGroupEditLocale = function () {
    return {
      root: {
        groupParameters: "Group Parameters",
        headerName: "API Group Builder",
        moduleName: "Module Name",
        categoryName: "Category Name",
        hostIP: "Host IP",
        hostPort: "Host Port",
        userName: "User Name",
        password: "Password",
        save: "Save",
        cancel: "Cancel",
        back: "Back",
        authorizationRequired: "Authorization Required",
        authorizationType: "Authorization Type",
        token: "Token",
        yes: "Yes",
        no: "No",
        basic: "Basic",
        bearer: "Bearer",
        note: "Note",
        description1: "API Group can be created for a set of pass through API(s) falling under a module. All the parameters that are common for an API Group can be configured here.",
        description2: "To view the list of all the API(s) falling under a group, simply click on Service Details link against the module name in the search results.",
        togglePassword: "Toggle Password"
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

  return new APIGroupEditLocale();
});