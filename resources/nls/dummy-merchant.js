define(["ojL10n!resources/nls/messages-payments"], function(Messages) {
  "use strict";

  const TransactionLocale = function() {
    return {
      root: {
        merchant: {},
        dummyMerchant: {
          appBaseURL :"Base URL",
          appDefaultVersion :"Default URL",
          merchantcode: "Merchant Code",
          succStatUrlFlag: "Success static URL Flag",
          failStatUrlFlag: "Failure Static URL Flag",
          txnDate: "Transaction Date",
          accnoflag: "Account Number In Request",
          accnumber: "User Account Number",
          merchantrefno: "Merchant Reference Number",
          checksum: "Checksum Value",
          txnamount: "Transaction Amount",
          txnCurrency: "Transaction Currency",
          submit: "Submit",
          servicecharges: "Service Charges",
          additionalDetailOne: "Additional Detail One",
          additionalDetailTwo: "Additional Detail Two",
          additionalDetailThree: "Additional Detail Three"
        },
        messages: Messages
      }
    };
  };

  return new TransactionLocale();
});