define([
    "ojL10n!resources/nls/generic",
    "ojL10n!resources/nls/obdx-locale"
], function(Generic, OBDXLocale) {
    "use strict";

    const RegistrationLocale = function() {
        return {
            root: {
                registration: {
                    headerName: "Registration",
                    pagetitle: {
                        getOnline: "Get Online!!",
                        forgotPassword: "Forgot Password"
                    },
                    buttons: {
                        continueButton: "Continue",
                        cancelButton: "Cancel",
                        okButton:"Ok"
                    },
                    creditCardDetails: {
                        cardNoLabel: "Credit Card Number",
                        nameLabel: "Name as on Card",
                        expiryDateLabel: "Credit Card Expiry Date",
                        cvvLabel: "CVV Number",
                        emailLabel: "Email Id",
                        dobLabel: "Date of Birth"
                    },
                    accountDetails: {
                        customerIdLabel: "Customer ID",
                        acctNoLabel: "Account Number",
                        firstNameLabel: "First Name",
                        lastNameLabel: "Last Name",
                        emailLabel: "Email ID",
                        dobLabel: "Date of Birth",
                        debitCardNoLabel: "Debit Card Number",
                        debitCardPinLabel: "Debit Card Pin"
                    },
                    messages: {
                        usernamePlaceholder: "Please enter your email ID",
                        haveAcct: "Have an account with Rook Bank?",
                        accountDetail: "Great! Give us some details about your account, so we can look you up!",
                        accountType: "Account Type",
                        debitcardPlaceholder: "8888 8989 8989 9898 989",
                        creditcardPlaceholder: "8888 8989 8989 9898",
                        mandatoryDebitCardNumber: "Debit Card Number is mandatory",
                        mandatoryDebitPin: "Debit Card Pin is mandatory",
                        agreementCheck: "Please accept the Terms and Conditions",
                        terms: "I agree to Terms and Conditions",
                        termsAndConditionsPopUp: "Futura Bank Terms and Conditions",
                        summaryMessage: "A link to generate your Username and Password has been sent to your registered email ID.",
                        clickHere: "Login to your bank account."
                    },
                    verification: {
                        verificationLabel: "Verification Code"
                    },
                    header: {
                        success: "Success"
                    }
                },
                generic: Generic,
                locale: OBDXLocale
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

    return new RegistrationLocale();
});