define([], function () {
  "use strict";

  return new function () {
    return {
      root: {
        title: "Top 5 Virtual Account Balances",
        groupToolTip: "Virtual Account Name:",
        valueToolTip: "Balance:",
        xAxisTitle: "Virtual Accounts",
        yAxisTitle: "Account Balance",
        notifications: "Notifications",
        selectVirtualEntity: "Virtual Entity",
        selectCurrency: "Currency",
        selectBoth: "Select Virtual Entity and Currency to view details",
        viewChartText: "You are viewing balances of top 5 Virtual Accounts",
        errorMsg: "No Virtual Accounts available for display. Please try a different combination",
        ok: "Ok",
        error: "Error"
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