define([
  "ojL10n!resources/nls/origination-generic"
], function(Generic) {
  "use strict";

  const dashboardLocale = function() {
    return {
      root: {
        atotal: "Total Fees",
        noApplicationFees: "There are no application fees for this submission",
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