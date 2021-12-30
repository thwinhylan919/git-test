define([], function () {
    "use strict";

    const otppreferenceLocale = function () {
        return {
            root: {
                myProfile: "My Profile",
                heading: {
                    preferredDeliveryModeforOTP: "Preferred Delivery Mode (Only for OTP)"
                },
                otpPreferenceType: "OTP Preference Type",
                dispatchMethod: "Dispatch Method",
                sms: "SMS",
                email: "Email",
                both: "Both",
                note: "Note: The above configured dispatch method is applicable only if OTP is set up as the transaction authentication mode by the bank.",
                updatePreference: "Update User Preference"
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

    return new otppreferenceLocale();
});