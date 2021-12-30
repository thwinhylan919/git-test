define([
  "ojL10n!resources/nls/origination-generic"
], function(Generic) {
  "use strict";

  const cardFeesChargesLocale = function() {
    return {
      root: {
        applicationFees: "Application Fees",
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

  return new cardFeesChargesLocale();
});