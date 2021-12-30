define([], function () {
    "use strict";

    const partybaseLocale = function () {
        return {
            root: {
                heading: {
                    PartyBase: "Party Base"
                },
                PartyBase: {
                    Cancel: "Cancel",
                    Back: "Back"
                },
                componentHeader: "Party Resource Access"
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

    return new partybaseLocale();
});