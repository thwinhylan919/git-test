define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";

  const ChangePasswordLocale = function() {
    return {
      root: {
        changePassword: {
          heading: "Change Password",
          passwordPolicy: "Password Policy",
          successMessage: "Password changed successfully!",
          successLoginFlow: "Password Changed Successfully",
          confirmationMessage: "Please click below to login.",
          confirmationMessageAlt: "Password changed",
          password: "Enter at least 8 characters including a number, one uppercase and lowercase letter.",
          enterPassword: "Please enter your new password",
          newPasswordLabel: "New Password",
          oldPasswordLabel: "Current Password",
          reEnterPasswordLabel: "Re-enter Password",
          passwordMatch: "The Password must match!",
          passwordMissMatch: "Please enter a different Password",
          showPasswordRule1: "Have {pwdMinLength} to {pwdMaxLength} characters",
          showPasswordRule2: "Have uppercase {mandatoryUpper}",
          mandatoryUpper: "(Minimum {nbrUpper} mandatory)",
          showPasswordRule3: "Have lowercase {mandatoryLower}",
          mandatoryLower: "(Minimum {nbrLower} mandatory)",
          showPasswordRule5: "Have numbers {mandatoryNumber}",
          mandatoryNumber: "(Minimum {nbrNumber} mandatory)",
          notAllowed: "(Not Allowed)",
          showPasswordRule7: "Have special characters {mandatorySpecialChar} {specialCharlist}",
          specialCharlist: "(Allowed characters are {specialCharList})",
          mandatorySpecialChar: "(Minimum {nbrSpecial} mandatory)",
          showPasswordRule4: "Not contain consecutive characters more than {nbrConsecutive}",
          showPasswordRule8: "Not contain identical characters more than {nbrIdentical}",
          showPasswordRule10: "Not contain your personal details ( {personalDetExclude} )",
          showPasswordRule6: "Not be a common password",
          changeYourPassword: "Please change your password for security reasons.",
          policyDisclaimer: "Click on information icon to see password policy",
          userName: "Username"
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

  return new ChangePasswordLocale();
});