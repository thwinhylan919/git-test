define([], function () {
  "use strict";

  const sideMenu = function () {
    return {
      root: {
        header: "My Preferences",
        primaryAccountNumber: "Primary Account Number",
        backToDashboard: "Back To Dashboard",
        menuItems: {
          MyProfile: "Profile",
          primaryAccount: "Primary Account Number",
          alerts: "Alerts/Notifications",
          thirdPartyApps: "Third Party Applications",
          securityAndLogin: "Security and Login",
          themes:"Themes",
          settings: "Settings",
          otpPreference: "2 Factor Authentication"
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

  return new sideMenu();
});