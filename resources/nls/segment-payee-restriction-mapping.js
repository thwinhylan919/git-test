define([
    "ojL10n!resources/nls/generic"
], function(Generic) {
    "use strict";

    const payeeSegementMapping = function() {
        return {
            root: {
                payeeSegment: {
                    notMaintained: "Payee Restriction Setup for this user segment has not been set up yet",
                    setUpNow: "Set Up Now",
                    labels: {
                        userSegments: "User Segment",
                        enterpriseRole: "User Type",
                        view: "View"
                    },
                    header: "Payee Restriction Setup",
                    messages: {
                        pleaseSelect: "Please select"
                    }
                },
                common: Generic.common
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

    return new payeeSegementMapping();
});