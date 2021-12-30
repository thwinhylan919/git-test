define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";

  const reviewScanToPay = function() {
    return {
      root: {
        header: "Scan To Pay",
        transferTo: "Transfer To",
        transferFrom: "Transfer From",
        amount: "Amount",
        notes: "Notes (Optional)",
        reviewHeading : "Review",
        reviewMessage : "You initiated a request for Transfer. Please review details before you confirm!",
        generic: Generic
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

  return new reviewScanToPay();
});
