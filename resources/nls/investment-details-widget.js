define([], function() {
  "use strict";

  const investmentdetailswidgetLocale = function() {
    return {
      root: {
        heading: {
          InvestmentAllocation: "Investment Accounts"
        },
        InvestmentAllocation: {
          marketValue: "Market Value",
          amountInvested: "Amt. Invested"
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

  return new investmentdetailswidgetLocale();
});
