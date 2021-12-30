define([], function() {
  "use strict";

  const Locale = function() {
    return {
      root: {
        structureHeader: "Tabular Structure",
        partyName: "Party Name",
        vAccName: "Virtual Account Name",
        vAccNumber: "Virtual Account Number",
        bal: "Balances",
        accountLinked: "Account Linked",
        type: "Type",
        action : "Action",
        accountBalanceDetails :"Account Balance Details",
        viewAccountBalanceDetails : "View More",
        instructions :"Instruction"
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

  return new Locale();
});
