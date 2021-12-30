define([
  "ojL10n!lzn/alpha/resources/nls/origination-generic"
], function(Generic) {
  "use strict";

  const dashboardLocale = function() {
    return {
      root: {
        offer: "Offer",
        accountType: "Account Type",
        individual: "Individual",
        joint: "Joint",
        accountHolder: "Account Holder",
        interestRate: "Interest Rate",
        minimumBalance: "Minimum Balance",
        depositAmount: "Deposit Amount",
        term: "Term",
        interestPayout: "Interest Payment",
        maturityDate: "Maturity Date",
        applicantFullName: "Applicant Name",
        requestedAmount: "Requested Amount",
        approvedAmount: "Approved Amount",
        purpose: "Purpose",
        tenure: "Tenure",
        interestRatePercent: "{interestRate}%",
        repaymentAmount: "Repayment Amount",
        repaymentFrequency: "Repayment Frequency",
        coApplicant: "Co Applicant",
        loanDate: "Loan Date",
        purposeType: "Loan Purpose",
        nominateForFees: "Nominate for fees",
        cardType: "Card Type",
        downloadApplicationDocumentClick: "Download Application Documents",
        downloadApplicationDocumentClickTitle: "Click For Download Application Documents",
        offerName: "Offer Name",
        approvedLimit: "Approved Credit Limit",
        addOnCardOpted: "Add-On Card Holders",
        applicationFee: "Application Fees",
        noOfDependents: "Number Of Dependents",
        deliveryMode: {
          HOME: "Home",
          POSTAL: "Postal",
          CURRENT_ADDRESS: "Temporary Address",
          BRANCH: "Branch",
          POST: "Post",
          ONLINE: "Online",
          BOTH: "Post & Online"
        },
        noMembership: "No linkages defined",
        reviewAddress: "{line1}, {line2}, {city} {state} {zip}",
        reviewAddress2: "{line1}, {city} {state} {zip}",
        branchAddress: "{branch}, {line1}, {line2}, {city} {state} {zip}",
        branchAddress2: "{branch}, {line1}, {city} {state} {zip}",
        salFirstLast: "{salutation} {firstName} {lastName}",
        salFirstMiddleLast: "{salutation} {firstName} {middleName} {lastName}",
        salFirstMiddleLastSuffix: "{salutation} {firstName} {middleName} {lastName} {suffix}",
        salFirstLastSuffix: "{salutation} {firstName} {lastName} {suffix}",
        balanceTransferOpted: "Balance Transfers",
        cardCustomizations: "Card Customizations",
        pinDelivery: "Pin Delivery",
        cardDelivery: "Card Delivery",
        statementDelivery: "Statement Delivery",
        membershipLinkage: "Membership Linkages",
        membershipNumber: "Membership Number",
        membershipName: "Membership Name",
        deliveryPreferences: "Delivery Preferences",
        applicationForm: "View Complete Application",
        tenureWithDays: "{years} year(s) {months} month(s)",
        generic: Generic
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      "en-us": false,
      el: true
    };
  };

  return new dashboardLocale();
});