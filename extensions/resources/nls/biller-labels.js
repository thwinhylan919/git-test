define([], function () {
  "use strict";

  const QuickPaymentsLocale = function () {
    return {
      root: {
              MSISDN:"Mobile Number MSISDN",
              PinId:"Pin Id",
              SerialNumber:"Serial Number",
              partnerRefNo:"Partner Reference Number"
      },
      ar: false,
      en: false,
      es: true,
      "en-us": false
    };
  };

  return new QuickPaymentsLocale();
});