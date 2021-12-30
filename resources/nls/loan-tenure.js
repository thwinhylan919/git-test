define([
  "ojL10n!resources/nls/origination-generic"
], function(Generic) {
  "use strict";

  const loanTenureLocale = function() {
    return {
      root: {
        tenure_year: "Years",
        tenure_month: "Months",
        messages: {
          months: "Please select no of month(s)",
          years: "Please select no of year(s)",
          month: "Please select a month",
          year: "Please select a year",
          loanTenure: "Please specify Loan Tenure"
        },
        loanTerm: "Loan Term",
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

  return new loanTenureLocale();
});