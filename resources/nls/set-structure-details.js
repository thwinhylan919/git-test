define([
    "ojL10n!resources/nls/generic"
], function(Generic) {
    "use strict";

    const setStructureDetails = function() {
        return {
            root: {
                createAccountStructure: "Create Account Structure",
                structureParameters: "Structure Parameters",
                structureDescription: "Structure Description",
                structureType: "Structure Type",
                startDate: "Start Date",
                endDate: "End Date",
                interestMethod: "Interest Method",
                reallocationMethod: "Reallocation Method",
                structurePriority: "Structure Priority",
                defaultInstructionDetails: "Default Instructions Details",
                instructionType: "Instruction Type",
                defaultFrequency: "Default Frequency",
                reverseFrequency: "Reverse Frequency",
                centralAccount: "Central Account",
                pleaseSelect: "Please Select",
                centralDistribution: "Central Distribution",
                infoText: "Below selected instructions will get applied to all the parent-child account pairs by default",
                structurePriorityErrorMessage: "Invalid structure priority",
                defaultInstructionsWarning: "Default instruction will be applied for all the account pairs. Ensure to update the complete instruction details in subsequent step. You may choose to modify the instruction set for specific account pair. Do you want to proceed?",
                generic: Generic
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

    return new setStructureDetails();
});