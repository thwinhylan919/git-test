define([
  "ojL10n!lzn/beta/resources/nls/origination-generic"
], function(Generic) {
  "use strict";

  const cardDeliveryPreferencesLocale = function() {
    return {
      root: {
        pinDelivery: "Pin Delivery",
        cardDelivery: "Card Delivery",
        statementDelivery: "Statement Delivery",
        selectBranch: "Select Branch",
        reviewAddress: "{line1}, {line2}, {city} {state} {zip}",
        reviewAddress2: "{line1}, {city} {state} {zip}",
        tempAddress: "Temporary Address",
        online: "Online",
        post: "Post",
        both: "Both",
        home: "Home",
        branch: "Branch",
        messages: {
          pinDelivery: "Please select a valid pin delivery mode",
          cardDelivery: "Please select a valid card delivery mode",
          statementDelivery: "Please select a valid statement delivery mode",
          selectBranch: "Please select a valid bank branch"
        },
        generic: Generic
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      "en-us": false,
      el: true
    };
  };

  return new cardDeliveryPreferencesLocale();
});