define([], function() {
  "use strict";

  const bgCommitmentLocale = function() {
    return {
      root: {
        labels: {
          applicantRefNo: "Applicant Contract Ref No",
          beneficiaryRefNo: "Beneficiary Contract Ref No",
          guaranteeAmount: "Guarantee Amount",
          effectiveDate: "Effective Date",
          closureDate: "Closure Date",
          expiryDate: "Guarantee Expiry Date",
          expiryPlace: "Place of Expiry",
          currency: "Currency",
          validityType: "Validity Type",
          limited:"Limited",
          unlimited:"Unlimited",
          expiryCondition:"Expiry Condition"
        },
        errors: {
          invalidAmountErrorMessage: "Amount should be greater than 0",
          bgAmountError: "Amount should be lesser than 1 trillion"
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

  return new bgCommitmentLocale();
});