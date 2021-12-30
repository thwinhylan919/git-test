define(
  [],
  function() {
    "use strict";

    const SpendTransactionCard = function() {
      return {
        root: {
          categorizedTransaction: {
            recategorize: "Edit",
            split: "Split",
            menu: "Menu"
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

    return new SpendTransactionCard();
  }
);