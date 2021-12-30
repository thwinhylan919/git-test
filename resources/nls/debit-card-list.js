define([], function() {
  "use strict";

  const DebitCardListLocale = function() {
    return {
      root: {
        header: {
          debitCards: "Debit Cards"
        },
        applyDebitCard: "Apply for New Debit Card",
        noCards: "No cards to display",
        back: "Back",
        cardTitle: "Details for Debit card {cardNo}",
        cardAlt: "Click to see details for Debit card {cardNo}",
        manageCard: "Manage Card",
        cardStatus: {
          ACTIVE: true,
          INACTIVE: false
        },
        selectAccount: "Select Account"
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
es :true,
      "en-us": false,
      el: false
    };
  };

  return new DebitCardListLocale();
});