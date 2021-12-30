define([
  "ojL10n!resources/nls/origination-generic"
], function(Generic) {
  "use strict";

  const dashboardLocale = function() {
    return {
      root: {
        fillAdditional: "Please provide additional details for your application",
        return: "Return to Tracker",
        back: "Back",
        additionalInfo: "Additional Information",
        confirmText: "Confirm Account Configuration",
        errorMessageReSubmit: "Account configuration and preferences have already been confirmed for the application.",
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