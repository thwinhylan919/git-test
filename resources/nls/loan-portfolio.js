define([], function() {
  "use strict";

  const LoanAccountOverviewLocale = function() {
    return {
      root: {
        accountDetails: {
          labels: {
            loanPortfolio: "Loan Portfolio",
            noData: "No data to display",
            myAccountType: "Type Of Account Held",
            conventionalAccount: "Conventional",
            islamicAccount: "Islamic"
          }
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

  return new LoanAccountOverviewLocale();
});
