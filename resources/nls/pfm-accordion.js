define([], function() {
  "use strict";

  const FinancialSummaryLocale = function() {
    return {
      root: {
        labels: {
          SPN: "Spends",
          BDG: "Budget",
          GOL: "Goals"
        },
        noBudgets: "Control your spends. Create Budget now",
        activeBudgets: "{count} Active Budgets",
        noGoals: "Set your goals and we will help you achieve it",
        activeGoals: "{count} Active Goals",
        noSpends: "There are no spends for this month."
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

  return new FinancialSummaryLocale();
});