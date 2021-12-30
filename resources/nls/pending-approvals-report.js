define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const PendingApprovalsReportLocale = function() {
    return {
      root: {
        pendingApprovals: {
          partyId: "Party ID",
          partyName: "Party Name"
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

  return new PendingApprovalsReportLocale();
});