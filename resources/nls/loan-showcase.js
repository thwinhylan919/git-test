define([], function() {
  "use strict";

  const loanShowCase = function() {
    return {
      root: {
        header: "Get instance loan with in principle approval.",
        viewProducts: "View Products"
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

  return new loanShowCase();
});