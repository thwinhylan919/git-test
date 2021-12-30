define([], function () {
    "use strict";

    const createprogramreviewLocale = function () {
        return {
            root: {
                heading: {
                    ReviewBanner: "Review Banner",
                    ProgramDetails: "Program Details",
                    LinkCounterParties: "Link Counter Parties"
                },
                ReviewBanner: {},
                ProgramDetails: {
                    TypeofProgram: "Type of Program",
                    ProgramName: "Program Name",
                    ProgramCode: "Program Code",
                    ProgramValidityFrom: "Program Validity From",
                    ProgramValidityTo: "Program Validity To",
                    AutoAcceptInvoice: "Auto Accept Invoice",
                    Numberofdaysforautoacceptance: "Number of days for auto acceptance",
                    AutoFinance: "Auto Finance",
                    DisbursementCurrency: "Disbursement Currency",
                    DisbursementMode: "Disbursement Mode"
                },
                LinkCounterParties: {
                    CounterPartiesList: "Counter Parties List",
                    initials: "initials",
                    CounterPartyName: "Counter Party Name",
                    id: "Id - {spokeId}",
                    CounterPartyId: "Counter Party Id",
                    CounterPartyValue: "Counter Party Value",
                    address: "address",
                    Confirm: "Confirm",
                    Cancel: "Cancel",
                    Back: "Back"
                },
                componentHeader: "Create Program",
                editComponentHeader: "Edit Program",
                reviewScreen: {
                    reviewCaption: "REVIEW",
                    reviewHeader: "You initiated a request for Program Creation. Please review details before you confirm!",
                    editHeader: "You initiated a request for Program Update. Please review details before you confirm!"
                },
                Buttons: {
                    editprogram: "Edit Program",
                    editprogramTitle: "Edit"
                },
                confirmScreen: {
                    viewProgram: "View Program",
                    scfDashboard: "Supply Chain Dashboard",
                    dashboard: "Go to Dashboard",
                    programName: "Program Name:",
                    programId: "Program ID:",
                    confirmMessage: "Your request has been initiated successfully !",
                    navigationText: "What would you like to do next?"
                },
                autofields: {
                    yes: "Yes",
                    no: "No"
                },
                checkBoxLabel: "Select check box to select the card or list item",
                avatarLabel: "Initials for a particular spoke",
                noData: "-"
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

    return new createprogramreviewLocale();
});