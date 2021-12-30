define([
  "ojL10n!resources/nls/generic"
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
es :true,
      "en-us": false,
      el: true
    };
  };

  return new dashboardLocale();
});