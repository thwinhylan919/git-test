define([], function() {
  "use strict";

  const performanceAnalysisLocale = function() {
    return {
      root: {
        heading: {
          InvestmentAllocation: "Performance Analysis"
        },
        InvestmentAllocation: {
          xAxisTitle: "Investment Period",
          yAxisTitle: "Annualized Returns in %",
          yearsSuffix: "{count} Years",
          monthsSuffix: "{count} Months",
          yearSuffix: "{count} Years",
          monthSuffix: "{count} Months"
        }
      },
      ar:true,
      fr:true,
      cs:true,
      sv:true,
      en:false,
es :true,
      "en-us":false,
      el:true};
  };

  return new performanceAnalysisLocale();
});
