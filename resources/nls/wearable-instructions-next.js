define(["ojL10n!resources/nls/generic"], function (Generic) {
  "use strict";

  const wearableInstructionsLocale = function () {
    return {
      root: {
        IOS: {
          imageTitle: "Pair your Apple Watch with your iPhone before starting with the registration process.",
          step1header: "<b>Step 1: Installation of the Application on Apple Watch</b>",
          step1: {
            step11: "Pair the Apple Watch with your iPhone from the Watch Menu",
            step12: "Click on 'Install' button against the Application on iPhone in the Watch Menu",
            step13: "Application gets installed on the Apple Watch"
          },
          step2header: "<b>Step 2: Registration of Apple Watch for Application along with PIN definition</b>",
          step2: {
            step21: "Step 2: Registration of Apple Watch for Application along with PIN definition",
            step22: "Set your 4 digit Watch Banking PIN to access Application from the Apple Watch. Ensure your Apple Watch is paired with the iPhone during PIN definition.",
            step23: "Using this PIN login to Application directly from your Apple Watch"
          }
        },
        ANDROID: {
          imageTitle: "Pair your Android Watch with your Android Phone before starting with the registration process.",
          step1header: "<b>Step 1: Installation of the Application on Android Watch</b>",
          step1: {
            step11: "Pair the Android Watch with your Android Phone from the Watch Menu",
            step12: "Click on 'Install' button against the Application on Android Phone in the Watch Menu",
            step13: "Application gets installed on the Android Watch"
          },
          step2header: "<b>Step 2: Registration of Android Watch for Application along with PIN definition</b>",
          step2: {
            step21: "Step 2: Registration of Android Watch for Application along with PIN definition",
            step22: "Set your 4 digit Watch Banking PIN to access Application from the Android Watch. Ensure your Android Watch is paired with the iPhone during PIN definition.",
            step23: "Using this PIN login to Application directly from your Android Watch"
          }
        },
        header: "Wearable Instructions",
        imageTitle: "Wearable Watch",
        imageAlt: "Image of a Wearable Watch",
        error: {
          MULTIPLE_WATCHES_CONNECTED: "You have connected multiple watches. Please connect only one and continue.",
          WATCH_NOT_CONNECTED: "You have not connected any watches. Please connect one and continue.",
          APP_NOT_FOUND: "Application not found in the watch connected."
        },
        generic: Generic
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
es :true,
      "en-us": false,
      el: false
    };
  };

  return new wearableInstructionsLocale();
});