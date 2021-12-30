define([], function () {
    "use strict";

    const attributelistLocale = function () {
        return {
            root: {
                heading: {
                    ResourceMappingSummary: "{attributeName} Mapping"
                },
                ResourceMapping: {
                    MapAllPrograms: "Map All Programs",
                    MapAllFacilities: "Map All Facilities",
                    MapAllRemitterLists: "Map All Remitter Lists",
                    AttributeList: "Attribute List",
                    applyPartyLevel: "Apply Party Level Changes Automatically"
                },
                attributeCheckbox: "Select check box for {attributeName}",
                attributeName: {
                    Program: "Program",
                    Facility: "Facility"
                },
                attributeIdHeader: "{attributeName} ID",
                attributeNameHeader: "{attributeName} Name",
                status: "Status"
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

    return new attributelistLocale();
});