define([], function() {
    "use strict";

    const UserLoginConfigurationLocale = function() {
        return {
            root: {
                pageTitle: {
                    header: "User Login Flow",
                    termsAndConditions: "Terms and Conditions"
                },
                fieldname: {
                    agree: "I agree to the terms and conditions.",
                    line1: "Thank You for choosing Futura Bank as your Banking needs partner.",
                    line2: "We welcome you to the Futura Bank family.",
                    line3: "Happy Banking!!!"
                },
                buttons: {
                    search: "Search",
                    acceptButton: "Accept",
                    skip: "Skip"
                },
                messages: {
                    agreeButtonNotSelected: "Please accept the terms and conditions"
                }
            },
            ar: false,
            en: false,
es :true,
            "en-us": false
        };
    };

    return new UserLoginConfigurationLocale();
});