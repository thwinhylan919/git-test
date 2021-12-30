define([], function() {
  "use strict";

  const portfoliosummarywidgetLocale = function() {
    return {
      root: {
        heading: {
          TopFunds: "Top & Bottom Funds"
        },
        TopFunds: {
          fundName: "Funds Name",
          price: "Price",
          change: "% Change",
          asOnDate: "Values as on {asOnDate}"
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

  return new portfoliosummarywidgetLocale();
});
