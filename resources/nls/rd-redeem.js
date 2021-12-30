define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const redeemRD = function() {
    return {
      root: {
        header: {
          redemption: "Redemption"
        },
        pageHeader: {
          redemptionDetails: "Redemption Details",
          payoutDetails: "Payout Details"
        },
        redemptionDetails: {
          accountNumber: "Account Number",
          redeemableAmount: "Redeemable Amount",
          redemptionType: "Redemption Type",
          penalty: "Charges/Penalty",
          finalRedemptionAmount: "Final Redemption Amount",
          redeemType: {
            P: "Partial",
            F: "Full"
          }
        },
        payoutDetails: {
          confirmAccountNumber: "Confirm Principal & Interest Credit Account Number",
          accountNoValidation: "Account Numbers do not match.",
          validationMessage: "Input account number field first",
          creditAccountNum: "Principal & Interest Credit Account Number",
          payTo: "Pay To",
          accountName: "Account Name",
          bankCode: "Bank Code",
          lookUpBankCode: "Look Up Bank Code"
        },
        validate: {
          holdingPattern: "This facility is available for singly held deposits only."
        },
        redeem: "Redeem",
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

  return new redeemRD();
});