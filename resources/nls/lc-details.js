define([], function () {
  "use strict";

  const LCDetailsLocale = function () {
    return {
      root: {
        labels: {
          draft: "Draft {srNo}",
          issueDate: "Issue Date",
          expiryDate: "Expiry Date",
          abovetolerance: "Above(+)",
          address: "Address",
          addDraft: "Add Another Draft",
          applicantDetails: "Applicant Details",
          applicantName: "Applicant Name",
          beneficiaryDetails: "Beneficiary Details",
          beneficiaryName: "Beneficiary Name",
          branchID: "Branch",
          country: "Country",
          paymentDetails:"Payment Details",
          creditAvailableBy: "Credit Available By",
          creditAvailableWith: "Credit Available With",
          creditDaysFrom: "Credit Days From",
          cumulative: "Cumulative",
          dateOfApplication: "Date of Application",
          dateofExpiry: "Date of Expiry",
          DAYS: "Days",
          draftAmount: "Draft Amount",
          drafts: "Drafts",
          draweeBank: "Drawee Bank",
          incoterm: "Incoterms",
          lcAmountDetails: "LC Amount Details",
          sgAmountDetails: "Shipping Guarantee Amount Details",
          billAmountDetails: "Bill Amount Details",
          lcAmount: "LC Amount",
          sgAmount: "Shipping Guarantee Amount",
          shippingGuaranteeAmount: "Shipping Guarantee Amount",
          MONTHS: "Months",
          nonCumulative: "Non Cumulative",
          placeOfExpiry: "Place of Expiry",
          partyID: "Party ID",
          productDetails: "Product Details",
          product: "Product",
          productOperation: "Product Operation",
          percent: "%",
          revolving: "Revolving",
          revolvingType: "Revolving Type",
          repeatFrequency: "Repeat Frequency",
          srNo: "Sr No",
          tenor: "Tenor",
          TIME: "Time",
          tolerance: "Tolerance",
          newTolerance: "Tolerance(New)",
          totalExposure: "Total Exposure",
          transferable: "Transferable",
          underTolaranceWithPercent: "Under(-) {tolarance} %",
          newUnderTolaranceWithPercent: "Under(-) {tolarance} %",
          aboveTolaranceWithPercent: "Above(+) {tolarance} %",
          newAboveTolaranceWithPercent: "Above(+) {tolarance} %",
          undertolerance: "Under(-)",
          VALUE: "Value",
          autoReinstatement: "Auto Reinstatement",
          currency: "Currency",
          swiftCode: "Swift Code",
          bankAddress: "Bank Address",
          bankName: "Bank Name",
          bankDetails: "Bank Details",
          confirmationInstruction: "Confirmation Instruction",
          without: "Without",
          requestedConfirmationParty: "Requested Confirmation Party"
        },
        InstCodeAddress: "<br>{code}<br> {line1}<br> {line2}<br> {line3}<br> {city}<br> {country}",
        bankCodeAddress: "<br>{line1}<br> {line2}<br> {line3}<br> {city}<br> {country}",
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
        },
        transferableType: {
          ACCEPTANCE: "Acceptance",
          DEFFEREDPAYMENT: "Deferred Payment",
          MIXEDPAYMENT: "Mixed Payment",
          NEGOTIATION: "Negotiation",
          PAYMENT: "Payment",
          SIGHTPAYMENT: "Sight Payment"
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

  return new LCDetailsLocale();
});
