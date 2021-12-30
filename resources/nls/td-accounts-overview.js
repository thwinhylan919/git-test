define([], function() {
  "use strict";

  const TermDepositAccountOverviewLocale = function() {
    return {
      root: {
        accountDetails: {
          labels: {
            tdOverview: "TD Accounts Overview",
            investments: "Investment ({amount})",
            currentBalance: "Current Balance ({amount})",
            maturityAmount: "Maturity Amount ({amount})",
            title: "Term Deposits",
            header: "Current Position",
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

  return new TermDepositAccountOverviewLocale();
});
