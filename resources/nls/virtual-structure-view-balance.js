define(function() {
  "use strict";

  const viewstructuretree = function() {
    return {
      root: {
        accountNumber: "Account Number",
        accountCurrency: "Account Currency",
        ownBalance: "Own Balance",
        childContri: "Child Contributions",
        totalbal: "Total Balance",
        overdraftAmt: "Overdraft Amount",
        blockeAmt: "Blocked Amount",
        unauthorizedDeb: "Unauthorized Debit",
        blockedChildContri: "Blocked Child Contributions",
        benefitsFromPool: "Benefit from Pool",
        avlBal: "Available Balance",
        effectAvlBal: "Effective Available Balance",
        unAuthCredit: "Unauthorized Credit",
        ok: "OK",
        accordionText: "Currency wise Child Contributions"
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

  return new viewstructuretree();
});
