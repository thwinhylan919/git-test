define([], function() {
  "use strict";

  const patternLogin = function() {
    return {
      root: {
        drawPattern: "Draw Pattern",
        close: "Close pattern login",
        closeAlt: "Click here to close pattern login",
        maximumRetrysExceeded: "Maximum number of attempts have been exceeded",
        invalidPin: "Invalid Pattern",
        loading: "Please wait for the request to complete"
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

  return new patternLogin();
});