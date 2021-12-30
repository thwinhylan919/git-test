define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const FileApprovalLocale = function() {
    return {
      root: {
        fileApproval: {
          reject: "Reject",
          approve: "Approve",
          otherTransactionsApproval: "Other Transactions Approval",
          selectedTransactions: "Selected Transactions ({count})",
          remarks: "Remarks",
          cancel: "Cancel",
          confirm: "Confirm",
          bulkFileApproval: "Bulk File Approval",
          ITG: "Internal Funds Transfer",
          DTF: "Domestic Funds Transfer",
          ITR: "International Funds Transfer",
          MIX: "Mixed Funds Transfer",
          DP: "Domestic Payee",
          ILP: "International Payee",
          IP: "Internal Payee",
          MPY: "Mixed Payee",
          VAT: "Virtual Account",
          VAS: "Virtual Account Structure"
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

  return new FileApprovalLocale();
});