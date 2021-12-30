define([], function() {
  "use strict";

  const AlertActionCardLocale = function() {
    return {
      root: {
        PI: "Profile",
        CH: "Savings & Current",
        TD: "Term Deposits",
        LN: "Loans",
        PC: "Payments",
        manageAlerts: "Manage Alerts",
        subscription: {
          title: "Alerts Subscription"
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

  return new AlertActionCardLocale();
});