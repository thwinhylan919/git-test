define([], function () {
    "use strict";

    const mappingsummaryLocale = function () {
        return {
            root: {
                heading: { ProgramMappingSummary: "Program Mapping Summary" },
                ProgramMappingSummary: {
                    NoProgramsmapped: "No Programs mapped.",
                    Map: "Map"
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

    return new mappingsummaryLocale();
});