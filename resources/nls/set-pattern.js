define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const setPattern = function() {
    return {
      root: {
        patternLock: "Set Pattern",
        confirmPattern: "Confirm Pattern",
        couldntSetupPattern: "Unable to setup Pattern",
        undo: "Undo",
        clickHereToUndo: "Click here to undo the pattern",
        patternDoesNotMatch: "Pattern does not match",
        pleaseEnterPattern: "Please draw pattern",
        patternVisiblity: "Pattern Visibility",
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

  return new setPattern();
});