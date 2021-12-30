define([], function() {
  "use strict";

  const LoanActionCardLocale = function() {
    return {
      root: {
        cardData: {
          newLoan: {
            title: "New Loan",
            description: "Select products to fulfil <br/>your financial needs",
            imgDesc: "New Loan"
          },
          loanCalculator: {
            title: "Loan Calculator",
            description: "Check your eligibility!",
            imgDesc: "Loan Calculator"
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

  return new LoanActionCardLocale();
});