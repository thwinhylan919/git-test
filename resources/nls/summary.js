define([], function() {
  "use strict";

  const summaryLocale = function() {
    return {
      root: {
        summary: {
          summary: "Summary",
          cardTitle: "Credit Cards",
          totalcreditlimit: "Total Credit Limit",
          availablecredit: "Total Available Limit",
          noData: "You do not have any credit card with us.",
          bottomText: "Apply for a new?"
        },
        cardCount: "{count} Cards"
      }
    };
  };

  return new summaryLocale();
});