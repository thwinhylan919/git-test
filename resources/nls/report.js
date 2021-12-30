define([
    "ojL10n!resources/nls/generic"
  ],
  function(Generic) {
    "use strict";

    const Report = function() {
      return {
        root: {
          wallet: {
            report: {
              Com: "Completed",
              Pen: "Pending",
              all: "All",
              debitsOnly: "Debits Only",
              creditsOnly: "Credits Only",
              kycManagement: "KYC Management",
              reports: "Reports"
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

    return new Report();
  });