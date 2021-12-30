define([], function() {
  "use strict";

  const TermsAndConditionsLocale = function() {
    return {
      root: {
        pageTitle: {
          header: "Terms and Conditions"
        },
        fieldname: {
          terms: "Please accept the terms and conditions"
        },
        buttons: {
          agree: "Agree"
        }
      },
      ar: false,
      en: false,
es :true,
      "en-us": false
    };
  };

  return new TermsAndConditionsLocale();
});