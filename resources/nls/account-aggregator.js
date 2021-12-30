define([], function() {
  "use strict";

  const AboutLocale = function() {
    return {
      root: {
        header: "Welcome To <span class='account-aggregator__headerName'>FuturaMax</span>",
        subHeader: "Link Your Savings, checking, loan accounts or credit cards maintained with the same or other banks with FuturaMax. Manage your money at one place and track your spends across banking relationships.",
        linkAccount : "Link Account",
        imgTitle: "Account Aggregator",
        title: "What do we offer",
        investmentHeader: "Track Investments",
        investmentContent: "Single view of your accounts across multiple banks",
        category: "Categorize Spends",
        categoryContent: "Categorize your transactions for better understanding of your spending habits",
        spendPattern: "View Spend Patterns",
        spendPatternContent: "View a graph and make smarter financial decisions by tracking your spends",
        budget: "Setup and track Budgets",
        budgetContent: "Setup a budget! Track financial goals and relative performance"
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

  return new AboutLocale();
});
