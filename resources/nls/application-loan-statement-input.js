define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";

  const applicationLoanStatementInputLocale = function() {
    return {
      root: {
        yes: "Yes",
        no: "No",
        statementRequired: "Do you require a statement?",
        done: "Done",
        required: "* Required",
        frequency: "Frequency",
        correspondencePref: "Correspondence Preference",
        email: "Email",
        post: "Post",
        continue: "Continue",
        messages: {
          statementFrequency: "Please select a statement frequency"
        },
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

  return new applicationLoanStatementInputLocale();
});