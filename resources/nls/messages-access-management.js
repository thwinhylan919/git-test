define([], function() {
  "use strict";

  const AccessManagementMessagesLocale = function() {
    return {
      root: {
        tooltip: {
          autoManualMessage: "Select <strong>Auto</strong> if you wish to allow access to all future {accountType1} accounts. Select <strong>Manual</strong> if you wish to allow specific access to all future {accountType} accounts"
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

  return new AccessManagementMessagesLocale();
});