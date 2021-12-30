define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";

  const ForgotUserIdLocale = function() {
    return {
      root: {
        forgotUserId: {
          buttons: {
            continueButton: "Continue",
            resendButton: "Resend Code",
            cancelButton: "Cancel",
            logInButton: "Login",
            submitButton: "Submit",
            resetButton: "Submit",
            ok: "Ok"
          },
          messages: {
            clickHere: "Login to your bank account.",
            usernameEmail: "Username sent successfully on your email address / mobile number.",
            enterDetails: "To retrieve your Username, please enter your email address and date of birth registered in your bank account.",
            usernamePlaceholder: "Please enter your email ID"
          },
          details: {
            nameLabel: "Email",
            forgotUserName: "Don't remember your Username ?",
            codeNotReceived: "Didn't get the code",
            dobLabel: "Date of Birth"
          },
          header: {
            forgotUserName: "Forgot Username",
            signUpLabel: "Sign Up",
            success : "Successful"
          }
        },
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

  return new ForgotUserIdLocale();
});