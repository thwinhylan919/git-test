define([], function() {
  "use strict";

  const AboutLocale = function() {
    return {
      root: {
        header: "System Administrator"
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