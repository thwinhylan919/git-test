define([], function() {
  "use strict";

  const pushUnbinding = function() {
    return {
      root: {
        androidDevice: "Android Devices",
        iOsDevice: "iOS Devices",
        Note: "Note: Disabling the service will unregister the device from receiving alerts via push notifications.",
        header: "Push Notifications",
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

  return new pushUnbinding();
});