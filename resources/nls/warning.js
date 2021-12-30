define([], function() {
  "use strict";

  const WarningLocale = function() {
    return {
      root: {
        message: "Your password is about to expire in {passwordExpiryDays} days, please change your password at the earliest",
        changePassword: "Change Password"
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

  return new WarningLocale();
});