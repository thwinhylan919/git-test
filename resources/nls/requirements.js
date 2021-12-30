define([
  "ojL10n!resources/nls/origination-generic"
], function (Generic) {
  "use strict";

  const requirementsLocale = function () {
    return {
      root: {
        coApplicant: "Is there a co-applicant?",
        relation: "Specify relationship with primary applicant",
        isExistingUser: "Is Co-applicant an existing user ?",
        verify: "Verify",
        userIdOfCoApplicant: "Co-applicant Customer ID",
        modeOfPreference: "Send Verification Code via",
        UserVerifyEmailClick: "Click to verify email",
        none: "None",
        one: "One",
        two: "Two",
        noCoApplicants: "Holding Pattern",
        email: "Co-applicant's registered email address",
        sms: "Co-applicant's registered phone number",
        verified: "Verified",
        verifyCoApp: "Co-applicant Customer ID needs to be verified using Verification Code",
        termYears: "{years} Year(s)",
        termMonths: "{months} Month(s)",
        casa: {
          title: "Demand Deposit Requirements",
          header: "Help us understand your savings requirements",
          currencyLabel: "Which currency would you like to open your account ?"
        },
        loan: {
          title: "Loan Requirements",
          header: "Help us understand your loan requirements",
          loanAmount: "How much would you like to borrow ?",
          purpose: "What is your purpose for this loan ?",
          loanPurposeLabel: "Loan Purpose",
          tenure_year: "Tenure Years",
          tenure: "Tenure",
          term: "Loan Term",
          years: "Years",
          months: "Months",
          autoloanAmount: "Loan Amount",
          purchasePrice: "Estimated Value",
          downPaymentRequired: "Down payment towards Vehicle Purchase",
          downPaymentAmount: "Down payment Amount",
          repaymentFrequency: "How often would you like to make repayments ?",
          loanEstimate: "Your estimated Loan Repayment amount will be <strong>{amount} </strong>{frequency}",
          primaryApplicant: "Primary Applicant",
          loanPurpose: "{purposeType}-{description}",
          firstHome: "Is this the first time you are purchasing a house?",
          firstHome_toolTip: "First Home Owner Grant is a one-off payment to encourage and assist first home buyers to buy or build a residential property for use as their principal place of residence.<br>For more details on this please contact the banker.",
          firstHome_toolTipAltMessage: "Why we need this information?",
          firstHome_toolTipTitle: "Why we need this information? tooltip"
        },
        purposes: {
          education: "Education",
          debitConsolidation: "Debit Consolidation",
          homeRenovations: "Home Renovations",
          householdGoods: "Household Goods",
          travelAndHoliday: "Travel and Holiday",
          wedding: "Wedding",
          funeral: "Funeral",
          medicalExpenses: "Medical Expenses",
          utilityBill: "Utility Bill",
          other: "Other"
        },
        messages: {
          frequency: "Please select interest payout frequency",
          purpose: "Please select the loan purpose",
          years: "Please select no of year(s)",
          repaymentFrequency: "Please select repayment frequency",
          coappId: "Please enter Co-applicant Customer ID",
          modeOfPreference: "Please select the preferred mode to send OTP",
          currency: "Please select a currency"
        },
        submitRequirement: "Click here to Submit Loan Requirements",
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

  return new requirementsLocale();
});