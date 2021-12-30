define([], function () {
    "use strict";

    const userbaseLocale = function () {
        return {
            root: {
                heading: {
                    SearchResults: "Search Results"
                },
                SearchResults: {
                    Cancel: "Cancel",
                    Back: "Back"
                },
                componentHeader: "User Resource Access",
                applyPartyLevel: "Apply Party Level Changes Automatically"
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

    return new userbaseLocale();
});