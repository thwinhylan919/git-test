define([], function() {
  "use strict";

  const TermDepositRatesLocale = function() {
    return {
      root: {
        termDepositRates: {
          labels: {
            tdRatesHeader: "TD Rates",
            amount: "Amount",
            period: "Period",
            interestRate: "Interest Rate",
            details: "Term Deposit Rate List"
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

  return new TermDepositRatesLocale();
});