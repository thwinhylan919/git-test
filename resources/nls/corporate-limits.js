define([], function() {
  "use strict";

  const corporateLimitsLogLocale = function() {
    return {
      root: {
        corporateLimitsDetails: {
          labels: {
            title: "Corporate Limits"
          }
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

  return new corporateLimitsLogLocale();
});