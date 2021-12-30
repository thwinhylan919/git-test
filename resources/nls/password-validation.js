define([], function() {
  "use strict";

  const PasswordValidationLocale = function() {
    return {
      root: {
        passwordValidation: {
          messages: {
            heading: "Change Password",
            passwordPolicy: "Password Policy",
            successMessage: "Successful!",
            successLoginFlow: "Password Changed Successfully",
            confirmationMessage: "Your password has been changed",
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
            showPasswordRule7: "Have special characters {mandatorySpecialChar} {specialCharlist}",
            mandatorySpecialChar:"(Minimum {nbrSpecial} mandatory)",
            specialCharlist:"(Allowed characters are {specialCharList})",
            notAllowed: "(Not Allowed)",
            showPasswordRule4: "Not contain consecutive characters more than {nbrConsecutive}",
            showPasswordRule8: "Not contain identical characters more than {nbrIdentical}",
            showPasswordRule9: "Not contain your personal details ( {personalDetExclude} )",
            showPasswordRule6: "Not be a common password",
            showPasswordRule10: "Not be the same password as any of the last {pwdHistorySize} passwords",
            changeYourPassword: "Please change your password for security reasons.",
            policyDisclaimer: "Click on information icon to see password policy"
          },
          passwordPolicy: "Click to show password policy",
          passwordPolicyAlt: "View Password policy"
        }
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

  return new PasswordValidationLocale();
});
