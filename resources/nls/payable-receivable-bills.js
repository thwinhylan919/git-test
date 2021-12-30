define([], function() {
  "use strict";

  const payableReceivableBillsLogLocale = function() {
    return {
      root: {
        payableReceivableBillsDetails: {
          labels: {
            title: "Bills Receivable/Payable",
            receivable: "Receivable",
            payable: "Payable",
            standloneBills: "Standalone Bills",
            billsUnderLc: "Bills Under LC",
            receivableLegendText: "Receivable ({currency})",
            payableLegendText: "Payable ({currency})",
            noData: "No data to display"
          },
          tooltip: {
            group: "Group : {group}",
            value: "Value : {value}"
          }
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

  return new payableReceivableBillsLogLocale();
});