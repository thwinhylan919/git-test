define([], function() {
  "use strict";

  const topFiveSweeps = function() {
    return {
      root: {
        header:{
          topFiveSweep:"Top 5 Sweeps in {currency}"
        },
        labels:{
          topFiveSweep:"Top Five Sweeps",
          details:"Top Five Sweeps",
          noData: "No Top Five Sweeps Available",
          subData: "Check this section for top five sweeps"
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

  return new topFiveSweeps();
});