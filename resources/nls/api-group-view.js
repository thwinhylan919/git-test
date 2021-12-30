define([], function () {
  "use strict";

  const APIGroupViewLocale = function () {
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
        edit: "Edit",
        cancel: "Cancel",
        back: "Back",
        authorizationRequired: "Authorization Required",
        authorizationType: "Authorization Type",
        yes: "Yes",
        no: "No",
        token: "Token",
        note: "Note",
        description1: "API Group can be created for a set of pass through API(s) falling under a module. All the parameters that are common for an API Group can be configured here.",
        description2: "To view the list of all the API(s) falling under a group, simply click on Service Details link against the module name in the search results.",
        groupDescription: "API Group Description",
        groupCode: "API Group Name",
        endPointConfig: "End Point Configuration"
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

  return new APIGroupViewLocale();
});