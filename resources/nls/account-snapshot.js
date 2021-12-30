define(["ojL10n!resources/nls/generic"], function (Generic) {
  "use strict";

  const snapShotregistration = function () {
    return {
      root: {
        goToDashoard: "Go To Dashboard",
        disableQuickSnapShot: "Disable Quick Snapshot",
        successfullyDisabled: "Do you want to disable Snapshot?",
        snapshotDisabled: "Warning",
        yes: "Yes",
        no: "No",
        CasaAccounts: "Current and Savings Account",
        MyAccount: "My Account",
        ddSubText: "{product} | {accountType}",
        accountType: {
          CON: "Conventional",
          ISL: "Islamic"
        },
        savingsOrCurrent: {
          SAVIN: "Savings A/C",
          CACCR: "Current A/C"
        },
        disableQuickSnapshot: "Disable Account Snapshot",
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

  return new snapShotregistration();
});