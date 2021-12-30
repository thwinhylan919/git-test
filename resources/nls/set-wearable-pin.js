define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const setPin = function() {
    return {
      root: {
        wearableSetPin: {
          header: "Set Pin"
        },
        wearableResetPin: {
          header: "Reset Pin"
        },
        common: {
          confirmPin: "Confirm Pin",
          setPin: "Set Pin",
          numberMsg: "Invalid Input",
          pinDidntMatch: "Pin did not Match",
          couldntSetupPin: "Unable to set pin.",
          pinShouldhaveOnlyNumber: "A pin should have only numbers.",
          generic: Generic
        }
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

  return new setPin();
});