define([], function () {
  "use strict";

  const APIGroupReviewLocale = function () {
    return {
      root: {
        groupCode: "API Group Name",
        groupDesc: "API Group Description",
        endPoint: "End Point Configuration",
        groupParameters: "Group Parameters",
        headerName: "API Group Builder",
        moduleName: "Module Name",
        categoryName: "Category Name",
        hostIP: "Host IP",
        hostPort: "Host Port",
        userName: "User Name",
        password: "Password",
        confirm: "Confirm",
        cancel: "Cancel",
        back: "Back",
        reviewHeading: "Review",
        reviewMessage: "You initiated a request for API Group. Please review details before you confirm!",
        authorizationRequired: "Authorization Required",
        authorizationType: "Authorization Type",
        yes: "Yes",
        no: "No"
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

  return new APIGroupReviewLocale();
});