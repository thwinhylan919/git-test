define([], function() {
  "use strict";

  const TransactionLocale = function() {
    return {
      root: {
        wallet: {
          jobs: "Pay | Receive | Save | Transfer",
          declaration: "You now own a digital wallet!",
          congratulations: "Congratulations !",
          getStarted: "Get Started",
          properties: "Simple, Quick and Secure",
          andMuchMore: "...and much more!"
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

  return new TransactionLocale();
});