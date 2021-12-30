define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";

  const TransactionLocale = function() {
    return {
      root: {
        wallet: {
          dashboardActivity: {
            miniStatement: "Mini Statement",
            moreDetails: "More Details",
            dr: "Dr",
            cr: "Cr",
            header: "Statement"
          }
        },
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

  return new TransactionLocale();
});