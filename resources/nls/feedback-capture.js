define([], function() {
  "use strict";

  return new function() {
    return {
      root: {
        feedbackText: "Please rate your overall experience",
        inputPlaceHolder: "Your comments (Optional)",
        submit: "Submit",
        thankYouQuote: "Thank you for your feedback!",
        skip: "Skip",
        neverAskMeAgain: "Never ask me again",
        errorMsg : "Message",
        noGenericFeedbackErrorMsg : "The transaction you are attempting is currently unavailable.",
        ok : "OK"

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
});