define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const ChequeStopUnblock = function() {
    return {
      root: {
        chequeDetails: {
          chequeDetails: "Give Cheque Details",
          number: "Number",
          range: "Range",
          chequeNumber: "Cheque Number",
          from: "From",
          to: "To"
        },
        messages: {
          chequeNumber: "Please enter a valid cheque number"
        },
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

  return new ChequeStopUnblock();
});