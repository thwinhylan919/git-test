define([], function() {
  "use strict";

  const DashboardPaymentsLocale = function() {
    return {
      root: {
        payments: {
          name: "Payments",
          description: "Make Your Payments",
          primary_description: "Payments",
          upcomingPayments: "Upcoming Payments",
          featureText: "Transfer Money, <br>Pay Bills...",
          moreInfo: "More Options",
          moreInfoText: "Click for More Options"
        },
        pfm: {
          name: "Personal Finance Management",
          primary_description: "Financial Management",
          featureText: "Goals, <br>Spend Analysis..."
        }
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
es :true,
      "en-us": false,
      el: false
    };
  };

  return new DashboardPaymentsLocale();
});
