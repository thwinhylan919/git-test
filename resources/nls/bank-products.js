define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const BankProducts = function() {
    return {
      root: {
        productGroupDescription: {
          PAYDAY: "Payday Loan",
          AUTOLOANFLL: "Vehicle Loans",
          PERSONAL_LOAN: "Personal Loans",
          SAVINGS: "Savings",
          CHECKING: "Current Accounts",
          AUTOMOBILE: "Auto Loans",
          CREDIT_CARD: "CREDIT CARD"
        },
        alt: {
          productName: "Goto {productName}",
          productImage: "{productName} Logo"
        },
        headerName: "Product Selection",
        generic: Generic
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
es :true,
      "en-us": false,
      el: false
    };
  };

  return new BankProducts();
});