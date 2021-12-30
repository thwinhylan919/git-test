define(["ojL10n!resources/nls/mapping-train"], function (MappingTrain) {
    "use strict";

    const attributedetailsLocale = function () {
        return {
            root: {
                heading: {
                    AttributeDetails: "Attribute Details"
                },
                AttributeDetails: {
                    Edit: "Edit",
                    Next: "Next",
                    Delete: "Delete",
                    Cancel: "Cancel",
                    Back: "Back",
                    deleteMessageParty: "Are you sure you want to delete {attributeName} mapping setup for party {partyId} - {partyName}?",
                    deleteMessageUser: "Are you sure you want to delete {attributeName} mapping setup for {username} and party {partyId} - {partyName}?",
                    yes: "Yes",
                    no: "No"
                },
                componentHeaderUser: "User Resource Access",
                componentHeaderParty: "Party Resource Access",
                mappingTrain: MappingTrain
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

    return new attributedetailsLocale();
});