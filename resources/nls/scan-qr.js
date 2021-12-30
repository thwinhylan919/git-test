define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";

  const scanToPay = function() {
    return {
      root: {
        invalidQRCodePopupMessage: "QR code scanned is not valid, do you wish to scan another code?",
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

  return new scanToPay();
});