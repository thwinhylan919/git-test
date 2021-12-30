define([], function() {
  "use strict";

  const ErrorPageLocale = function() {
    return {
      root: {
        code: "404",
        error: "Error.",
        message: "Sorry, page not found!"
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

  return new ErrorPageLocale();
});