define(function () {
    "use strict";

    const loadRequirementsOverview = function () {
        return {
            root: {
                loadRequirements: {
                    loadRequirementsHeader: "Loan Requirements",
                    loanAmountDetails: "Loan Amount Details",
                    amountNeeded: "Enter the amount of loan that you require",
                    loanAmountDetailsDiscription: "Please let us know your requirement so as to serve you better.",
                    loanAmount: "Enter loan Amount",
                    currencyType: "Currency",
                    year: "Year",
                    month: "Month",
                    durationOfLoan: "For how long do you need this loan?",
                    specificInstruction: "Do you have any specific instructions for us?",
                    specificInstructionDescription: "Specify Your Instructions",
                    save: "Save",
                    cancel: "Cancel",
                    back: "Back",
                    cancelMessage: "Are you sure you want to cancel the operation?",
                    yes: "Yes",
                    no: "No",
                    reviewwarning: "Warning",
                    linkFacilities: "Link Facilities",
                    noFacilitiesAvailable: "No Facilities are Available",
                    loanAmountDescription: "Please let us know your requirement so as to serve you better.",
                    facilityAmount: "Facility Amount",
                    availableAmount: "Available Amount",
                    cardHeading: "Facility",
                    priority: "Priority",
                    percentage: "Percentage",
                    youCanFacilitiesAvailable: "You can link multiple facilities for your loan requirement.",
                    selected: "Selected",
                    all: "All",
                    verticleSlash: "|",
                    view: "View:"
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

    return new loadRequirementsOverview();
});