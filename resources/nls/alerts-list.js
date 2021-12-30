define([], function() {
  "use strict";

  const alertsList = function() {
    return {
      root: {
        header: "Manage Alerts",
        labels: {
          "alerts-profile": "Profile",
          "alerts-casa": "Saving & Current",
          "alerts-td": "Term Deposits",
          "alerts-loans": "Loans",
          "alerts-payments": "Payments",
          "push-deregistration": "Push De-registration",
          navBarDescription: "Navigation Bar to select action"
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

  return new alertsList();
});
