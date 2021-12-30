define([], function () {
    "use strict";

    const programmanagementglobalLocale = function () {
        return {
            root: {
                heading: {
                    CreateProgram: "Create Program",
                    CreateProgramModal: "Program Attributes"
                },
                CreateProgramModal: {
                    MinTenorAllowed: "Min Tenor Allowed",
                    MinFinance: "Min Finance %",
                    MaxTenorAllowed: "Max Tenor Allowed",
                    MaxFinance: "Max Finance %",
                    ProgramTenor: "Program Tenor",
                    NoofCounterparties: "No Of Counterparties",
                    WithRecourse: "With Recourse",
                    GraceDays: "Grace Days"
                },
                CreateProgram: {
                    PartyName: "Party Name",
                    PartyIDpartyId: "Party ID : {partyId}",
                    ProgramType: "Program Type",
                    Status: "Status",
                    ProgramId: "Program ID",
                    ProgramName: "Program Name",
                    ViewAttributes: "View Attributes",
                    ViewAttributesTitle: "View Attributes"
                },
                componentHeader: "Create Program",
                firstStep: "Program Parameters",
                secondStep: "Link Counter Parties",
                yes: "Yes",
                no: "No"
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

    return new programmanagementglobalLocale();
});