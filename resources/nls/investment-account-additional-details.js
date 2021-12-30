define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";

  const NominationDetailsLocale = function() {
    return {
      root: {
        primaryAsset : "Primary Asset",
        primaryLiabilities : "Primary Liabilities",
        investments : "Investments",
        relatives : "Relatives",
        openAccountHeader: "Open Investment Account",
        navDescription : "Navigation bar for additional details section",
        messages: Messages,
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

  return new NominationDetailsLocale();
});
