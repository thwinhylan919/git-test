define([], function() {
  "use strict";

  const deviceUnbinding = function() {
    return {
      root: {
        feedbackPreferences: "Feedback Preferences",
        Note: "Note : Disabling this will disable the feedback window after every transaction.",
        settings: "Settings"
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
es :true,
      "en-us": false,
      el: false
    };
  };

  return new deviceUnbinding();
});
