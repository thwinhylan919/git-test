define(function () {
    "use strict";

    const businessDetailsOverview = function () {
        return {
            root: {
                businessDetails: {
                    businessDetailsHeader: "Business Details",
                    businessDetailsDescription: "Please verify & update your business details.",
                    businessNature: "What is the nature of your business?",
                    turnoverccy: "Currency in which you deal with",
                    OperatingProfit: "What is your operating profit for the year?",
                    placeholderProfit: "Enter the current year Operating profit",
                    placeholdetExport: "Export import license number",
                    exportImportLicenceNo: "Enter your export import license number",
                    select: "Select",
                    currentYear: "Current Year",
                    balanceSheetSize: "Specify your balance sheet size",
                    placeholderBalance: "Enter your balance sheet size",
                    currentYearNetProfit: "What is your net profit for the year?",
                    placeholderYear: "Enter current year Net profit",
                    save: "Save",
                    cancel: "Cancel",
                    back: "Back",
                    cancelMessage: "Are you sure you want to cancel the operation?",
                    yes: "Yes",
                    no: "No",
                    reviewwarning: "Warning"
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

    return new businessDetailsOverview();
});