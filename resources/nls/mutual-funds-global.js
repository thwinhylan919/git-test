define([], function() {
  "use strict";

  const MutualFundsGlobal = function() {
    return {
      root: {
        schemeDetailsBar: {
          schemeNameLabel: "Scheme Name",
          latestPriceLabel: "Latest Price",
          fundHouseLabel: "Fund House",
          fundCategoryLabel: "Fund Category",
          suitabilityLabel: "Scheme Suitability",
          recommendedFundLabel: "Recommended Fund",
          viewMore: "View More",
          yes: "Yes",
          no: "No"
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

  return new MutualFundsGlobal();
});