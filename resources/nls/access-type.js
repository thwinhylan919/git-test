define([], function () {
    "use strict";

    const accesstypeLocale = function () {
        return {
            root: {
                heading: { AccessType: "Access Type" },
                AccessType: {
                    NewFacilityMapping: "New {attributeName} Mapping",
                    AUTO: "Auto",
                    MANUAL: "Manual"
                },
                attributeName: {
                    Program: "Program",
                    Facility: "Facility"
                },
                tooltip: {
                    autoManualMessageProgmams: "Select <strong>Auto</strong> if you wish to allow access to all future Programs. Select <strong>Manual</strong> if you wish to allow specific access to all future Programs.",
                    autoManualMessageFacilities: "Select <strong>Auto</strong> if you wish to allow access to all future Facilities. Select <strong>Manual</strong> if you wish to allow specific access to all future Facilities.",
                    autoManualMessageRemitterLists: "Select <strong>Auto</strong> if you wish to allow access to all future Remitter Lists. Select <strong>Manual</strong> if you wish to allow specific access to all future Remitter Lists."
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

    return new accesstypeLocale();
});