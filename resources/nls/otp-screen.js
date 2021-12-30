define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";

  const OTPScreenLocale = function() {
    return {
      root: {
        verification: "Verification",
        message: "A verification code has been sent to your registered mobile number. Please enter that code below to complete the process.",
        verificationcode: "Verification Code",
        resendcode: "Resend Code",
        resendCodeTitle: "Click here to resend code",
        softTokenVerification: "Soft Token Verification",
        softTokenMessage: "Please Enter the code appearing on your soft token application",
        resendcode_msg: "Did not get the code?",
        invalidOTP: "Invalid OTP",
        togglePasswordTitle: "Click to toggle password",
        togglePasswordAlt: "Toggle Password",
        otpPageSection: "One Time Verification",
        resentMsg: "OTP sent successfully",
        otpResentMsg : "One Time Verification code (OTP) has been resent successfully!",
        referenceNo: "Reference Number",
        numberMsg: "Enter Only Numbers",
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

  return new OTPScreenLocale();
});