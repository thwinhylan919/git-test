define([
    "ojL10n!resources/nls/generic"
], function(Generic) {
    "use strict";

    const ViewTabularStructure = function() {
        return {
            root: {
                structure: {
                    labels: {
                        structureHeader: "Tabular Tree Structure",
                        instructionDetailsTitle: "View Instruction Details",
                        reallocationMethod: "Reallocation Method",
                        partyName: "Party Name",
                        accountName: "Account Name",
                        accountNumber: "Account Number",
                        accountType: "Account Type",
                        accountBalance: "Account Balance",
                        accountLinked: "Linked Accounts",
                        type: "Type",
                        view: "View",
                        instructions: "Instructions",
                        actions: "Actions",
                        update: "Update",
                        moreOptionsAlt: "Click here for more options",
                        moreOptionsTitle: "Click here for more options",
                        instructionDetails: "Instruction Details",
                        priority : "Priority",
                        accountCheck: {
                            true: "External",
                            false: "Internal"
                        }
                    },
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

    return new ViewTabularStructure();
});