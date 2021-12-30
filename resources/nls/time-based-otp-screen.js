define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";

  const TOTPScreenLocale = function() {
    return {
      root: {
        verification: "Verification",
        verificationcode: "One Time Password",
        softTokenVerification: "Soft Token Verification",
        softTokenMessage: "Please follow the steps to generate an OTP (One Time Password)",
        instructions: "Open Soft Token Application on your hand held device and login with your PIN. ,Enter the OTP displayed on the screen in the text box below.",
        numberMsg: "Enter only numbers",
        referenceNo: "Reference Number",
        togglePasswordTitle: "Click to toggle password",
        togglePasswordAlt: "Toggle Password",
        notNumberMsg: "Please Enter Only Numbers",
        correctOTPMsg: "Enter Correct OTP",
        allowedAttempts: "Attempts Left",
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

  return new TOTPScreenLocale();
});
