define([
  "ojL10n!resources/nls/origination-generic"
], function(Generic) {
  "use strict";

  const dashboardLocale = function() {
    return {
      root: {
        view: "View",
        applications: "Application Summary",
        fees: "Application Fees",
        documents: "Documents",
        offer: "Offer",
        statusHistory: "Status History",
        accountSummary: "Account Summary",
        logo: "{accordionName} Logo",
        alt: {
          expand: "Expand"
        },
        title: {
          expand: "Expand"
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

  return new dashboardLocale();
});