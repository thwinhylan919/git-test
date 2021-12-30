define([], function() {
  "use strict";

  const crossborderSweep = function() {
    return {
      root: {
        header: {
          crossBorderCurrencyHeader: "Top 5 Cross Currency Sweeps"
        },
        labels: {
          crossBorderSweepTable:"Cross Border Sweep Details",
          currencyList:"Currency List",
          structure:"Structure",
          sweepOut:"Sweep Out",
          sweepIn: "Sweep In",
          exchangeRate:"Exchange Rate",
          details:"Cross Currency Sweeps",
          noData: "No Cross Currency Sweeps Available",
          subData: "Check this section for cross border currency sweeps"
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

  return new crossborderSweep();
});