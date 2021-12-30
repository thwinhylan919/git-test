define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const amendRD = function() {
    return {
      root: {
        header: {
          amend: "Edit Maturity Instruction"
        },
        accountNumber: "Account Number",
        rollOverType: {
          A: "Close on Maturity"
        },
        confirmAccountNumber: "Confirm Principal & Interest Credit Account Number",
        accountNoValidation: "Account Numbers do not match.",
        validationMessage: "Input account number field first",
        maturityInstruction: "Maturity Instruction",
        creditAccountNum: "Principal & Interest Credit Account Number",
        payTo: "Pay To",
        accountName: "Account Name",
        bankCode: "Bank Code",
        lookUpBankCode: "Look Up Bank Code",
        pleaseSelect: "Please Select",
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

  return new amendRD();
});