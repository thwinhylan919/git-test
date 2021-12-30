define([], function () {
    "use strict";

    const createprogramparametersLocale = function () {
        return {
            root: {
                heading: {
                    CreateProgram: "Create Program",
                    HelpPanelSection: "Help Panel Section"
                },
                CreateProgram: {
                    TypeofProgram: "Type of Program",
                    ProgramName: "Program Name",
                    ProgramCode: "Program Code",
                    ProgramCodeError: "Please enter a valid Program Code",
                    ProgramNameError: "Please enter a valid Program Name",
                    ValidityFrom: "Validity From",
                    ValidityTo: "Validity To",
                    AutoAcceptInvoice: "Auto Accept Invoice",
                    NumberofdaysforAutoAcceptance: "Number of days for Auto Acceptance",
                    AutoFinance: "Auto Finance",
                    autoFinance: "auto finance",
                    autoFinanceTitle: "Click here for more details",
                    autoFinanceText: "Auto Finance more details",
                    autoFinanceDetails: "On selection all uploaded invoices would be Auto Financed",
                    toDateError: "Program end date should be greater than start date.",
                    UploadDocuments: "Upload Documents",
                    ChooseFile: "Choose File",
                    UploadedDocuments: "Uploaded Documents",
                    UploadMoreDocuments: "Upload More Documents",
                    UploadMoreDocumentsTitle: "Click for Upload More Documents",
                    DisbursementCurrency: "Disbursement Currency",
                    DisbursementMode: "Disbursement Mode",
                    Next: "Next",
                    Cancel: "Cancel",
                    Back: "Back"
                },
                HelpPanelSection: {},
                componentHeader: "Create Program",
                yes: "Yes",
                no: "No",
                editProgramHeader: "Edit Program",
                selectPlaceholder: "Select"
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

    return new createprogramparametersLocale();
});