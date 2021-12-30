define([], function () {
  "use strict";

  const AmountInputLocale = function () {
    return {
      root: {
        currencyValidation: "Invalid Currency",
        amountValidation: "Please enter a valid amount",
        minAmountValidation: "Please enter more than minimum amount",
        maxAmountValidation: "Please enter less than maximum amount",
        currency: "Currency",
        underflow: "The Amount must be greater than or equal to {min}",
        overflow: "The Amount must be less than or equal to {max}",
        inRange: "Enter Amount between {min} and {max}"
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
      es: true,
      "en-us": false,
      el: false
    };
  };

  return new AmountInputLocale();
});