define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const networkPreference = function() {
    return {
      root: {
        networkPreference: {
          errorMessage:"This maintenance is currently applicable only for India region.",
          header:"Network Preference Maintenance",
          networkInfo:"Identify which network is to be suggested for each rule outcome.",
          reviewHeader:"You initiated a request for Network Configuration Rule. Please review details before you confirm!",
          networkPreferenceDefinition:"Network Preference Definition",
          resolvedNetwork:"Resolved Networks",
          priority:"Priority",
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

  return new networkPreference();
});