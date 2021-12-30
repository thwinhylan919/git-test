define([], function() {
  "use strict";

  const deviceUnbinding = function() {
    return {
      root: {
        androidDevice: "Android Devices",
        iOsDevice: "iOS Devices",
        Note: "Note: Unregistering will disable alternate login from all mobile devices.",
        header: "Registered Phones/Tablets",
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