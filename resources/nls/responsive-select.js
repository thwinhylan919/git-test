define([], function() {
  "use strict";

  const selectLocale = function() {
    return {
      root: {
        closealt: "Close",
        closetitle: "Click here to close"
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

  return new selectLocale();
});