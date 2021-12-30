define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";

  const cardAdditionalPreferencesLocale = function() {
    return {
      root: {
        returnToTracker: "Return to Tracker",
        back: "Back",
        fillAdditional: "Please provide additional details for your application",
        additionalInfo: "Additional Information",
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

  return new cardAdditionalPreferencesLocale();
});