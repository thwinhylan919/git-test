define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";

  const TransactionLocale = function() {
    return {
      root: {
        upiRequestMoney: {
          makeAnotherTransfer:"Make Another Request"
        },
        headers: {
          expiryDate: "Valid Till",
          remarks: "Note",
          creditVPAId: "Receive Funds in",
          placeHolder: "Please Select",
          accountTransferDetails: "Request From",
          debitVPAId: "Enter a new VPA",
          amount: "Amount",
          requestMoney: "Request Money",
          request: "Request",
          reviewRequestMoneyUpi: "You have initiated a request to receive money. Please review the details before you confirm!",
          accountNo: "Account Number:{accountNumber}",
          refresh: "Reset Payee",
          title: "Click here to {reference}",
          displayName: "{group} - {payee}",
          vpa: "VPA",
          accountName: "Account Name",
          alt: "Click here to {reference}"

        },
        generic: Generic
      }
    };
  };

  return new TransactionLocale();
});
