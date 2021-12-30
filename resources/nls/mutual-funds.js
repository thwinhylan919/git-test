define([], function() {
  "use strict";

  const MutualFundsCommonLocale = function() {
    return {
      root: {
        header1: "Risk Profile",
        line1: "Investment Account",
        line2: "Your Risk Profile is :",
        line3: "Recommended Allocation as per your Risk Profile",
        Cat1: "Debt Funds",
        Cat2: "Equity Funds",
        button1: "Agree",
        button2: "Disagree",
        button3: "Cancel",
        button4: "Back to Dashboard",
        createText1:"Fund allocator distributes the money you want to invest in a portfolio that is recommended for your risk profile.",
        createText2:"These mutual fund portfolios have been arrived at after analyzing their performance and reaction market volatility.",
        buttonKnowProfile: "Know Your Risk Profile",
        riskProfileSelcted: "Risk Profile Confirmation",
        modalWindowHeader: "Select",
        ok: "Ok",
        popUpOption1: "Choose your risk profile type",
        popUpOption2: "Take the assessment again",
        save: "Save",
        back: "Back",
        validatorMessage:"You must select a Risk Profile",
        editRiskProfile: "Edit Risk Profile",
        reviewText:"Your risk profile {riskprofile} has been successfully saved for chosen account.",
        selectRiskProfile: "Select your risk profile",
        assetAllocation: "Asset Allocation",
        investor: "As a {investor} investor you are",
        confirmationMessage: "Your risk profile has been successfully saved for chosen account.",
        completed: "Completed",
        riskProfileTitle:"Risk Profile",
        riskProfileConfirmation:"Risk Profile",
        wealthDashboard: "Wealth Dashboard",
        mutualFunds:{
            purchaseAnotherFund: "Purchase Fund",
            switchFund: "Switch Another Fund",
            redeemFund: "Redeem Fund",
            wealthDashboard: "Wealth Overview",
            purchaseTitle: "Click Here to Purchase Fund",
            switchTitle: "Click Here to Switch Another Fund",
            redeemTitle: "Click Here to Redeem Fund",
            changeRiskProfile:  "Change Risk Profile",
            dashboardTitle: "Click Here for Wealth Dashboard"
        },
        changeRiskProfile:  "Change Risk Profile",
        backToDashboard: "Back to Dashboard"

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

  return new MutualFundsCommonLocale();
});
