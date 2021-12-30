define([], function() {
  "use strict";

  const MutualFundsRiskProfileLocale = function() {
    return {
      root: {
        riskProfileTitle: "Risk Profile",
        kyrpButton: "Know your risk Profile",
        investAccountLabel1: "Please select the investment account to do the risk profiling",
        investAccountLabel2: "Investment Account",
        selectLabel: "Select",
        createText: "Risk profile is about knowing an investor's risk appetite. Somebody with a low risk appetite should ideally have in low risk asset allocation typically involving bonds/debt based instrument. Equity is part of the asset allocation to those investors who can take some risk in their portfolio.",
        createTextPara2: "Risk profiles do change as the personal financial circumstances of investor changes and hence risk profiling should be done periodically.",
        create: "Create",
        crpButton: "Calculate Risk Profile",
        header1: "Risk Profile",
        line1: "Investment Account",
        line2: "Your Risk Profile is :",
        line3: "Recommended Allocation as per your Risk Profile",
        cat1: "Debt Funds",
        cat2: "Equity Funds",
        button1: "Agree",
        button2: "Disagree",
        button3: "Cancel",
        backToDashboard: "Back to Wealth Overview",
        button4: "Back to Dashboard",
        buttonKnowProfile: "Know Your Risk Profile",
        riskProfileSelcted: "Risk Profile Confirmation",
        questionnaireDetailsLabel1: "Your asset allocation and investment decisions are closely linked to your Risk Profile.",
        questionnaireDetailsLabel2: "Please answer the following {noOfQuestions} questions to determine your Risk Profile.",
        prevButton: "Back",
        nextButton: "Next"
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

  return new MutualFundsRiskProfileLocale();
});
