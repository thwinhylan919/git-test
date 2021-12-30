define([], function() {
  "use strict";

  const AboutLocale = function() {
    return {
      root: {
        homePage:"Home Page",
        headerTxt:"Access Denied",
        bodyTxt:"Sorry, You are not authorized to access this page",
        goBack:"You can go back to:"
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

  return new AboutLocale();
});