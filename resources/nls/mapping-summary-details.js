define([], function () {
    "use strict";

    const mappingsummarydetailsLocale = function () {
        return {
            root: {
                heading: {
                    ResourceMappingSummary: "{attributeName} Mapping Summary"
                },
                attributeName: {
                    Program: "Program",
                    Facility: "Facility"
                },
                ProgramMappingSummary: {
                    NoProgramsmapped: "No Programs mapped.",
                    NoProgramFacilities: "No Facilities mapped.",
                    NoRemitterLists: "No Remitter Lists mapped.",
                    Map: "Map",
                    AttributeName: "Attribute Name",
                    AttributeNameTitle: "Click for Attribute Name",
                    PartySetupNotExist: "Party Resource Access is not maintained for the Party",
                    noData: "No details to display for the specified party and module combination.",
                    partySetupMissing: "{module} not maintained for the Party"
                },
                resourceType: "Resource Type",
                programsMapped: "Number of Programs Mapped",
                totalNoPrograms: "Total Number of Facilities",
                facilitiesMapped: "Number of Facilities Mapped",
                totalNoFacilities: "Total Number of Facilities",
                remitterListsMapped: "Number of Remitter Lists Mapped",
                totalNoRemitterLists: "Total Number of Remitter Lists"
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

    return new mappingsummarydetailsLocale();
});