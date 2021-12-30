define([], function() {
  "use strict";

  const accordionLocale = function() {
    return {
      root: {
        orientation: "Orientation",
        loanRequirements: "Loan Requirements",
        savingsRequirements: "Savings Requirements",
        termDepositRequirements: "Term Deposit Requirements",
        application: "Application",
        personalDetails: "Personal Details",
        applicantInformation: "Applicant Information {applicant}",
        propertyInformation: "Property Information",
        vehicleInformation: "Vehicle Information",
        fundingInformation: "Funding Information",
        customizeCreditCard:"Customize your card",
        primaryInformation: "Primary Information {applicant}",
        proofOfIdentity: "Proof of Identity {applicant}",
        contactInformation: "Contact Information {applicant}",
        employmentInformation: "Employment Information {applicant}",
        featuresAndSpecifications: "Features",
        fundYourAccount: "Fund Your Account",
        fundYourDeposit: "Fund Your Deposit",
        setupYourDeposit: "Setup Your Deposit",
        financialTemplate: {
          name: "Financial Profile {index} <br> {applicantName}"
        },
        financialDetails: "Financial Details",
        financialDetailsReview: "Financial Details {index} <br> {applicantName}",
        income: "Income",
        expenses: "Expenses",
        assets: "Assets",
        liabilities: "Liabilities",
        currentAssets: "Current Assets",
        currentLiabilities: "Current Liabilities",
        offerDetails: "Offer Details",
        offers: "Offers",
        creditCardPreferences: "Credit Card Preferences",
        deliveryPreferences: "Delivery Preferences",
        addOnCardHolderDetails: "Add-On Card Holder Details",
        customizeYourCard: "Customize your Card",
        feesAndCharges: "Fees and Charges",
        review: "Review",
        submissionConfirmation: "Submission Confirmation",
        productTracking: "Product Tracking",
        repayments: "Repayments",
        applicationFees: "Application Fees",
        loanStatement: "Loan Statement",
        cardPreferences: "Card Preferences (optional)",
        balanceTransferDetails: "Balance Transfer Details",
        membershipLinkage: "Membership Linkages (optional)",
        accountConfiguration: "Account Configuration",
        accountSummary: "Account Summary",
        accountDetails: "Account Information",
        coApplicantInformation: "Co Applicant Information",
        coApplicantPrimaryInformation: "Co Applicant Primary Information",
        coApplicantProofOfIdentity: "Co Applicant Proof of Identity",
        coApplicantContactInformation: "Co Applicant Contact Information",
        coApplicantEmploymentInformation: "Co Applicant Employment Information",
        applicant: "- Applicant",
        coApplicant: "- Co Applicant",
        applicantName: "- {name}"
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

  return new accordionLocale();
});