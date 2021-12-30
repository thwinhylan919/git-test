define(["ojL10n!resources/nls/generic", "ojL10n!resources/nls/trade-finance-common", "ojL10n!resources/nls/trade-finance-errors"], function(Generic, tradeFinanceCommon, tradeFinanceErrors) {
  "use strict";

  const creditLineLocale = function() {
    return {
      root: {
        generic: Generic,
        common: tradeFinanceCommon,
        tradeFinanceErrors: tradeFinanceErrors,
        lineId: "{lineId}{serialNumber}",
        lineName:"{mainLine}{serialNumber}",
        labels: {
          all: "All",
          customerName: "Customer Name",
          overallLimit: "Overall Limit",
          partyId: "Party Id",
          mainLine: "Main Line",
          lineId: "Line ID",
          startDate: "Start Date",
          expiryDate: "Expiry Date",
          lineAmount: "Line Amount",
          utilizedAmount: "Utilized Amount",
          outstandingAmount: "Outstanding Amount",
          revolvingValues: "Revolving Values",
          notApplicable: "N/A",
          true: "Yes",
          false: "No"
        },
        heading: {
          lineLimit: "Line Limits Utilization"
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

  return new creditLineLocale();
});