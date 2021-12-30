define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";

  const InvestmentAccountLocale = function() {
    return {
      root: {
        openAccountHeader: "Open Investment Account",
        personalDetails: "Personal Details",
        contactDetails: "Contact Details",
        nominationDetails: "Nomination Details",
        fatca: "FATCA",
        descriptionLine1: "To start  investing you need to first open an Investment Account.",
        descriptionLine2:"It just takes 5 minutes and you can do it online!",
        note: "Note:",
        noteDataLine1: "You need to be FATCA compliant to open an investment account.",
        noteDataLine2: "Check your FATCA compliance here.",
        startInvest: "Start Investing...",
        backToWealthDashboard : "Back To Wealth Overview",
        helpPara1: "Whether you call it 'investing' or 'saving for the future', setting some money apart and making it grow is one of the wisest things to do and you have made that decision, congratulations!",
        helpPara2: "Our wealth management offering currently has mutual funds. We equip you with information & analysis so that you can buy/sell mutual funds online, all by yourself.",
        helpPara3: "So go ahead and open your Investment Account and join thousands of our customers who are saving & growing money everyday!",
        messages: Messages,
        buttonText : "Open an investment account",
        headerText : "Open Investment Accounts",
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

  return new InvestmentAccountLocale();
});
