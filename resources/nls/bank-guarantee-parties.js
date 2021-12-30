define([], function() {
  "use strict";

  const guaranteeDetailsLocale = function() {
    return {
      root: {
        labels: {
          partyID: "Party ID",
          branch: "Branch",
          dateOfApplication: "Date of Application",
          product: "Product",
          guaranteeType: "Type of Guarantee",
          FINANCIAL: "Financial",
          expiryDate: "Expiry Date",
          PERFORMANCE: "Performance",
          applicantDetails: "Applicant Details",
          applicantName: "Applicant Name",
          beneficiaryDetails: "Beneficiary Details",
          beneficiaryName: "Beneficiary Name",
          address: "Address",
          country: "Country",
          advisingBankDetails: "Advising Bank Details",
          issuingBankDetails: "Issuing Bank Details",
          productDetails: "Product Details",
          swiftCode: "Swift Code"
        },
        amendments: {
          amendmentDetailsHeader: "Amendment No {amendmentNumber}",
          lcRefNumber: "LC Reference Number",
          amendmentNumber: "Amendment Number",
          newExpiryDate: "Expiry Date(New)",
          dateOfIssue: "Date of Issue",
          dateOfAmendment: "Date of Amendment",
          additionalAmountCovered: "Additional Amount Covered",
          narrative: "Narrative",
          newLcAmount: "New LC Amount",
          amendButton: "Amend",
          amendmentTable: "Amendment Table"
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

  return new guaranteeDetailsLocale();
});