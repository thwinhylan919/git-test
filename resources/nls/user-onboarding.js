define([], function() {
    "use strict";

    const TransactionLocale = function() {
        return {
            root: {
                payments: {
                    peertopeer: {
                        registration: "Registration",
                        globalpayee: {
                            firstName: "First Name",
                            lastName: "Last Name",
                            mobileNumber: "Mobile Number",
                            phoneNumber: "Phone Number",
                            email: "Email",
                            aliasValue: "Alias Value",
                            aliasType: "Alias Type",
                            userName: "User Name",
                            password: "Password",
                            passwordMatch: "Password doesn't match",
                            confirmPassword: "Confirm Password",
                            otpmsg: "An OTP has been sent to you for confirming the recipient",
                            resendotp: "Resend OTP",
                            enterotp: "Enter OTP",
                            accountNumber: "Account Number",
                            accountName: "Account Name",
                            branch: "Branch",
                            payeeType: "Payee Type",
                            accountWith: "Account with",
                            thisBank: "This Bank",
                            otherBank: "Other Bank",
                            ifsc: "IFSC Code",
                            lookupifsccode: "Lookup IFSC Code",
                            transferTo: "Transfer To",
                            accountInfo: "Account Information",
                            confirmation: "Confirmation",
                            userCreatedMsg: "User Created Successfully. Please Login to Continue",
                            review: "Review",
                            otpValidation: "Payee validation",
                            dob: "Date of Birth"
                        }
                    }
                },
                common: {
                    select: "Select",
                    back: "Back",
                    bankname: "Futura Bank",
                    submit: "Submit",
                    success: "Successful",
                    edit: "Edit",
                    update: "Update",
                    add: "Add",
                    cancel: "Cancel",
                    confirm: "Confirm",
                    initiate: "Initiate",
                    create: "Create",
                    done: "Done",
                    pleaseSelect: "Please Select",
                    search: "Search",
                    yes: "Yes",
                    no: "No",
                    reset: "Reset",
                    save: "save",
                    ok: "Ok",
                    verify: "Verify",
                    login: "Login"
                },
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
                    policyDisclaimer: "Click on info icon to see password policy"
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

    return new TransactionLocale();
});