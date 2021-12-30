define([
  "ojL10n!resources/nls/origination-generic"
], function(Generic) {
  "use strict";

  const cardPreferencesLocale = function() {
    return {
      root: {
        cardTypePrimary: "Primary Card",
        customizeCard: "Customize your card to reflect you personality and interests",
        nameOnCard: "Name on Card",
        cardDesign: "Card Design",
        imageOnCard: "Image On Card",
        continue: "Continue",
        cardImage: "Card Image",
        docTypeIdForImageUpload: "Image on card",
        cardImageTitle: "click to download Card Image",
        messages: {
          cardDesign: "Please select a card design",
          nameOnCard: "Please enter a valid card name",
          error: "Error",
          noFile: "No file selected. Please select a file to upload",
          successMessage: "Successfully uploaded the file"
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

  return new cardPreferencesLocale();
});