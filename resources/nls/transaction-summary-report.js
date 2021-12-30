define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const TransactionSummaryReportLocale = function() {
    return {
      root: {
        transactionSummary: {
          dateFrom: "From",
          dateTo: "To",
          accountBranch: "Account Number",
          select: "Select",
          duration: "Duration",
          variable: "{Account}~{Branch}"
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

  return new TransactionSummaryReportLocale();
});