define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";

  const InvestmentAccountLocale = function() {
    return {
      root: {
        buttonText : "Open an investment account",
        headerText : "Open Investment Accounts",
        messages: Messages,
        backToDashboard: "Back to Dashboard",
        generic: Generic,
        descriptionLine1: "To start  investing you need to first open an Investment Account.",
        descriptionLine2:"It just takes 5 minutes and you can do it online!",
        note: "Note:",
        noteDataLine1: "You need to be FATCA compliant to open an investment account.",
        noteDataLine2: "Check your FATCA compliance here.",
        altDesc1 : "You already have maximum number of investment accounts allowed - {account}",
        altDesc2 : "Please visit our branch or talk to your Relationship Manager for further queries.",
        goToWealthOverview : "Go to Wealth Overview"
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

  return new InvestmentAccountLocale();
});
