define([], function () {
    "use strict";

    const SecurityMenu = function () {
        return {
            root: {
                header: "Security Settings",
                labels: {
                    changePassword: "Change Password",
                    setSecurityQuestion: "Set Security Question",
                    managePin: "Manage Pin",
                    managePattern: "Manage Pattern",
                    manageTouchID: "Manage Touch ID",
                    manageFaceID: "Manage Face ID",
                    deviceUnbinding: "Alternate Login",
                    pushUnbinding: "Push Notifications",
                    wearableSetPin: "Set Wearable Pin",
                    wearableResetPin: "Reset Wearable Pin",
                    patternVisiblity: "Pattern Visibility",
                    smsAndMissedCallBanking: "SMS and Missed Call Banking",
                    generate: "Generate",
                    publicKeyDescription: "Public and Private key pair helps to encrypt information that ensures data is protected during transmission. Whatever is encrypted with a Public Key may only be decrypted by its corresponding Private Key and vice versa. You can click to generate the key pair.",
                    jwtDescription: "To encrypt and decrypt a JWT, you need a symmetric key which can be generated by clicking the generate button.",
                    publicPrivateKeys: "Public and Private Key Pair",
                    jwtKeys: "JWT Encryption Key",
                    securityKeys: "Security Keys",
                    ok: "Ok",
                    confirmation: "Confirmation",
                    confirmationMessageKeyPair: "Private and Public Key Pair generated successfully!",
                    yes: "Yes",
                    no: "No",
                    yesNoMessgeJwtKey: "Existing JWT tokens issued will no longer be valid with the new key, Do you want to proceed with generation of encryption key?",
                    confirmationMessgeJwtKey: "JWT encryption key generated successfully!"
                },
                errors: {
                    WATCH_NOT_CONNECTED: "You have not connected any watches. Please connect one and continue."
                },
                clickHere: "Click Here To {action}"
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

    return new SecurityMenu();
});