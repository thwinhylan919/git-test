define([], function () {
  "use strict";

  const oracleLivePreference = function () {
    return {
      root: {
        oracleLivePreferences: "Live Help",
        Note: "Note : Disabling this will disable the oracle live feature.",
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

  return new oracleLivePreference();
});