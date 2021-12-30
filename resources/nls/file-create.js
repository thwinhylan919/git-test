define([], function () {
  "use strict";

  const FileUploadCreate = function () {
    return {
      root: {
        fileCreate: {
          userSelection: "User Type Selection",
          chooseUserType: "Select User Type on which you want to operate",
          workflowType: "Type",
          administrator: "Administrator",
          corporateUser: "Corporate User",
          create: "File Identifier Maintenance"
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

  return new FileUploadCreate();
});