define([], function() {
  "use strict";

  const TermDepositAnalysis = function() {
    return {
      root: {
        savingsCalculator: {
          header: "How Much Would You Like To Deposit",
          monthlyIncome: "Amount",
          monthlyExpenses: "Your Average Monthly Expenses",
          for: "Duration",
          years: "Years",
          interest: "@ Interest",
          savingOf: "You get back",
          avgInstallment: "Average Installment {value}/month",
          loanOffersText: "More Details",
          months: "Months",
          days: "Days",
          savings_td_calculator_title: "Savings Calculator",
          note: "* This calculation is for conventional deposits only.",
          back: "Back",
          reduceInterest: "Reduce Interest Rate",
          reduceInterestTitle: "Click here to reduce Interest Rate",
          increaseInterest: "Increase Interest Rate",
          increaseInterestTitle: "Click here to increase Interest Rate",
          validate: "Please enter the rate of interest"
        }
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
es :true,
      "en-us": false,
      el: false
    };
  };

  return new TermDepositAnalysis();
});