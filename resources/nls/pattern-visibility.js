define([], function() {
  "use strict";

  const pushUnbinding = function() {
    return {
      root: {
        patternVisiblity: "Pattern Visibility",
        iOsDevice: "iOS Devices",
        Note: "Note: Disabling or Enabling this would hide or show the pattern while login in via pattern login",
        header: "Pattern Visibility",
        patternNotSetUp: "Pattern login is not setup."
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

  return new pushUnbinding();
});
