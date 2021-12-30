define([
  "ojL10n!resources/nls/generic"
], function (Generic) {
  "use strict";

  const pendingApprovalsLocale = function () {
    return {
      root: {
        pendingApprovalsDetails: {
          labels: {
            accountsFinancialList: "Table displaying account details",
            amountFinancialList: "Table displaying non account details",
            accountsNonFinancialList: "Table displaying account details",
            bulkFileList: "List of bulk Files",
            bulkRecordList: "List of Bulk Records",
            otherTransactionsList: "Other Transaction Details",
            payeeList: "Payee List Details",
            paymentList: "List of Payments",
            billPaymentList: "List of Bill Payments",
            tradeFinanceList: "Trade list Details",
            billerName: "Biller Name",
            billerLocation: "Biller Location",
            details: "Details",
            fromAccount: "From Account",
            amount: "Amount"
          }
        },
        generic: Generic,
        navBarDescription: "Pending Approvals"
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

  return new pendingApprovalsLocale();
});