define([], function() {
  "use strict";

  const oracleLive = function() {
    return {
      root: {
        fullName: "{firstName} {lastName}"
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
es :true,
      "en-us": false,
      el: false
    };
  };

  return new oracleLive();
});