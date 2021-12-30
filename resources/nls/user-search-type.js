define([], function () {
  "use strict";

  const UserSearchTypeLocale = function () {
    return {
      root: {
        chooseUserType: "Select User Type on which you want to operate",
        userSelection: "User Type Selection",
        administrator: "Administrator",
        user: "User File Identifier Mapping",
        corporateUser: "Corporate User"
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

  return new UserSearchTypeLocale();
});