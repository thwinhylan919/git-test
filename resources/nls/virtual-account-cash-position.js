define(["ojL10n!resources/nls/generic"], function (Generic) {
  "use strict";

  return new function () {
    return {
      root: {
        header: {
          cashPosition: "Cash Positions - Overall",
          headerValue: "Details of Virtual Accounts in selected Balance Range",
          error: "Error"
        },
        labels: {
          title: "Virtual Accounts",
          axisTitle: "Balance in Thousand",
          xAxisTitle: "Number of Virtual Accounts",
          viewAll: "View All",
          date: "Date",
          amount: "Amount",
          totalAccounts: "Total Accounts",
          totalBalance: "Total Balance",
          balance: "Balance",
          graphHeader: "Number of Accounts in Balance Range",
          tabHeader: "Accounts in Balance Range",
          tabFooter: "Total Balance in the selected range",
          navigation: "Navigation",
          transactionHeader: "Details of Virtual Accounts in selected Balance Range",
          amountRange: "{from}K to {to}K",
          aboveRange: "Above {value}K",
          belowRange: "Below {value}K",
          credit: "Cr",
          debit: "Dr",
          notifications: "Notifications",
          selectEntity: "Virtual Entity",
          selectCurrency: "Currency",
          selectBoth: "Select Virtual Entity and Currency to view details",
          errorMsg: "No Virtual Accounts available for display. Please try a different combination",
          ok: "Ok"
        },
        generic: Generic
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