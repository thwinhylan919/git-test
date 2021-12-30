define([], function () {
  "use strict";

  return new function () {
    return {
      root: {
        title: "Balance Trends - Account Level (Top 5 Accounts)",
        groupToolTip: "Value Date:",
        valueToolTip: "Balance:",
        seriesToolTip: "Virtual Account Number:",
        buttonText: "View Trends",
        balanceTrends: "Balance Trends of Virtual Accounts",
        widgetCaption: "You are viewing balance trends of top 5 Virtual Accounts.",
        xAxisTitle: "Period",
        yAxisTitle: "Account Balance",
        lengendTitle: "Virtual Accounts",
        notifications: "Notifications",
        noData: "Get balance trends of Virtual Accounts",
        selectEntity: "Virtual Entity",
        selectCurrency: "Currency",
        selectText: "Select Virtual Entity and Currency to view details",
        errorMsg: "No data available.",
        ok: "Ok",
        error: "Error",
        widgetTitle: {
          xAxisTitle: "Value Date"
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
});