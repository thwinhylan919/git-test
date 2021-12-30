define([], function() {
    "use strict";

    const PoolInstructionsLocale = function() {
        return {
            root: {
                specification: "Specification",
                pleaseSelect: "Please Select",
                reallocationMethod: "Reallocation Method",
                update: "Update",
                currency: "Currency : {currencyCode}",
                branch: "Branch : {branchCode}",
                priority : "Priority {number}",
                accountCheck: {
                    true: "External",
                    false: "Internal"
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

    return new PoolInstructionsLocale();
});