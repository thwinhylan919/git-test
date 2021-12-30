define([], function() {
  "use strict";

  const portfoliosummarywidgetLocale = function() {
    return {
      root: {
        heading: {
          PortfolioSummary: "Portfolio Summary"
        },
        PortfolioSummary: {
          investedValue: "Invested Value",
          currentValue: "Current Value",
          profitLoss: "Profit/Loss",
          rateOfReturn: "Rate of Return",
          dividends: "Dividends",
          reports: "View Reports",
          realisedGainLoss: "Realized Gain/Loss",
          sips: "SIPs",
          investmentDetails: "Investment Details",
          message: "* Indicates change over previous value",
          investmentAccount: "Open another Investment Account",
          statisticsMessage: "(Following are consolidated figures for all your investment accounts)",
          asOnDate: "As on {asOnDate}",
          legendValue: "{currency}*"
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
