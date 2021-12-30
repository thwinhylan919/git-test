define([
  "ojL10n!lzn/alpha/resources/nls/origination-generic"
], function(Generic) {
  "use strict";

  const dashboardLocale = function() {
    return {
      root: {
        policyDetails: "Insurance Policy Details",
        premiumDetails: "Policy Premium Details",
        amount: "Premium Amount",
        periodicity: "Periodicity",
        generic: Generic
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      "en-us": false,
      el: true
    };
  };

  return new dashboardLocale();
});