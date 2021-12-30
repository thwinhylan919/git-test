define([
    "ojL10n!resources/nls/generic"
], function(Generic) {
    "use strict";

    const HOTPScreenLocale = function() {
        return {
            root: {
                verification: "Verification",
                verificationcode: "Verification Code",
                softTokenVerification: "Soft Token Verification",
                softTokenMessage: "Please enter the code appearing on your soft token application",
                instructions: "Open soft token application on your hand held device and login with your PIN. ,Enter the authorization code displayed on the soft token application and generate OTP. ,Enter the OTP in the text box below.",
                numberMsg: "Enter only numbers",
                referenceNo: "Reference Number",
                authorizationCode: "Authorization Code",
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

    return new HOTPScreenLocale();
});