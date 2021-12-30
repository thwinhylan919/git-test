define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const redeemRD = function() {
    return {
      root: {
        header: {
          amend: "Edit Maturity Instruction",
          reviewHeader: "You Initiated a request for Edit Maturity Instruction. Please review details before you confirm!"
        },
        accountNumber: "Account Number",
        rollOverType: {
          A: "Close on Maturity"
        },
        maturityInstruction: "Maturity Instruction",
        creditAccountNum: "Principal & Interest Credit Account Number",
        payTo: "Pay To",
        payoutType: {
          I: "Internal Account",
          O: "Own Account",
          E: "Domestic Bank Account"
        },
        confirmScreenLabels: {
          recurringDepositNumber: "Recurring Deposit Number",
          createSuccessMessage: "Request Submitted Successfully."
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

  return new redeemRD();
});