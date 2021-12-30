define(["ojL10n!resources/nls/generic"], function(Generic) {
    "use strict";

    const facilityapplicationLocale = function() {
        return {
            root: {
                generic: Generic,

                heading: {
                    FacilityRequirements: "Facility Requirements",
                    UploadDocs: "Upload Documents"
                },
                viewFacilitySubmittedApplication: "Facility Application Summary",
                viewColateralSubmittedApplication: "Collateral Application Summary",
                componentHeader: "Facility Application",
                sanctionedAmount: "Sanctioned Amount",
                utilizedAmount: "Utilized Amount",
                availableAmount: "Available Amount",
                collateralAmount: "Collateral Amount",
                expiryDate: "Expiry Date",
                fundingType: "Funding Type",
                facilityType: "Facility Type",
                revolvingLine: "Revolving Line",
                home: "Home",
                facilityDescription: "Enter your facility requirements, so as to serve you better",
                facilityRequirements: "Facility Requirements",
                facilityRequirementDetails: "Facility Requirement Details",
                addSubFacility: "Add Sub Facility",
                amendFacility: "Amend Facility",
                progressValue: "{number} % Utilized",
                amendFacilityAmount: "How much facility amount do you need?",
                facilityDurationLabel: "For how long do you need this facility?",
                fundsRequiredLabel: "In which category funds are required?",
                purposeOfFund: "What is the purpose of this fund?",
                instructions: "Do you have any specific instructions for us?",
                bankInstructions: "Instructions for bank",
                update: "Update",
                AmendFacility: "Amend Facility",
                facilityAmount: "Facility Amount",
                tenure: "Tenure",
                amendedDetails: "Amended Details",
                yearPlaceholder: "Year",
                monthPlaceholder: "Month",
                purposePlaceholder: "Specify your purpose",
                instructionsPlaceholder: "Specify your instructions",
                All: "All",
                TermLoan: "TERM LOAN",
                chooseFacility: "Choose Facility",
                facilityId: "Facility Id",
                ProjectFinance: "PROJECT FINANCE",
                WorkingCapitalFinance: "WORKING CAPITAL",
                AccountReceivableFinance: "ACCOUNT RECEIVABLES",
                OverDraftFinance: "OVER DRAFT FINANCE",
                Guarantee: "GUARANTEE",
                LettersofCredit: "LETTER OF CREDIT",
                addFacility: "Add Facility",
                add: "Add",
                addFacilityDescription: "Multiple facilities and sub facilities requirement can be added here",
                editDetails: "Edit Details",
                editFacility: "Edit Facility",
                removeFacility: "Remove Facility",
                editFacilityDetails: "Edit Facility Details",
                invalidDescription: "Enter less than 80 characters",
                invalidInstructions: "Enter less than 400 characters",
                createWarningMessage: "Please create at least one facility",
                amendWarningMessage: "Please amend at least one facility",
                showMore: "Show More",
                showLess: "Show Less",
                noDocumentUploaded: "No Documents Uploaded",
                appliedOn: "On {ondate}",
                ApplicationTracker: {
                    facilityApplied: "Facility applied for {facilityAmount}"
                },
                processStatus: {
                    SUBMITTED: "Submitted",
                    IN_PROGRESS: "In Progress",
                    DRAFT: "Draft",
                    COMPLETED: "Completed"
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

    return new facilityapplicationLocale();
});