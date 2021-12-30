define(["ojL10n!resources/nls/generic"], function(Generic) {
    "use strict";

    const networkPreference = function() {
        return {
            root: {
                networkPreference: {
                    header: "Network Preference Maintenance",
                    networkPreferenceDefinition: "Network Preference Definition",
                    networkInfo:"Identify which network is to be suggested for each rule outcome.",
                    resolvedNetwork: "Resolved Networks",
                    priority: "Priority",
                    errorMessage: "Please correct priority allocation. Same priority cannot be assigned to multiple networks.",
                    generic: Generic
                }
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

    return new networkPreference();
});