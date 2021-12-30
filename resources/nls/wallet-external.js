define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const TransactionLocale = function() {
    return {
      root: {
        wallet: {
          merchant: {
            cancel: "Cancel",
            done: "Done"
          },
          dummyMerchant: {
            merchantcode: "Merchant Code",
            succStatUrlFlag: "Success static URL Flag",
            failStatUrlFlag: "Failure Static URL Flag",
            merchantrefno: "Merchant Reference Number",
            txnamount: "Transaction Amount",
            txnCurrency: "Transaction Currency"
          },
          pay: {
            succcessful: "Success!",
            successMsg: "Transaction Successful",
            failure: "Fail!",
            failureMsg: "Unable to complete the transaction.Please contact bank administrator",
            referenceNum: "Reference Number is {refnumber}"
          }
        },
        generic: Generic
      }
    };
  };

  return new TransactionLocale();
});
