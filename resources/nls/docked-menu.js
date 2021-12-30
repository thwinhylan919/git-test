define(
  [],
  function() {
    "use strict";

    const dockedMenu = function() {
      return {
        root: {
          labels: {
            dashboard: "Home",
            trends: "Trends",
            "dashboard-quick-links": "Quick Access",
            "payment-landing": "Payments",
            "demand-deposits": "Accounts",
            "term-deposits": "Term Deposit",
            loans: "Loans"
          },
          clickHere: "Click here to go to {details}",
          navBarDescription: "Docked Menu Navigation Bar",
          expandDockedButton: "Click to View Options"
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

    return new dockedMenu();
  }
);
