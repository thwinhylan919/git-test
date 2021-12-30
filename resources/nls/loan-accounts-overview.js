define([], function() {
  "use strict";

  const LoanAccountOverviewLocale = function() {
    return {
      root: {
        accountDetails: {
          labels: {
            loansOverview: "Loan and Finances Overview",
            currency: "Currency",
            totalBorrowing: "Total Borrowing  ({amount})",
            currentOutstanding: "Current Outstanding  ({amount})",
            noData: "No data to display",
            conventionalAccount: "Conventional",
            islamicAccount: "Islamic",
            myAccountType: "Type Of Account Held"
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
