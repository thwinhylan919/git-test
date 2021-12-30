define(["ojL10n!resources/nls/generic"], function(Generic) {
    "use strict";

    const RecordViewNonFinancialLocale = function() {
        return {
            root: {
                recordViewNonFinancial: {
                    uploadedFiles: "Uploaded Files Inquiry",
                    recordView: "Record View",
                    recordDetails: "Record Details",
                    fileName: "File Name",
                    recordRefNo: "Record Ref No",
                    rStatus: "Record Status",
                    payeeDetails: "Payee Details",
                    payeeType: "Payee Type",
                    payeeName: "Payee Name",
                    accountType: "Account Type",
                    accountName: "Account Name",
                    accountNumber: "Account Number",
                    branch: "Branch",
                    nickName: "Nickname",
                    accessType: "Access Type",
                    payVia: "Pay Via",
                    ifscCode: "IFSC Code",
                    swiftCode: "Swift/NCC Code",
                    bankName: "Bank Name",
                    bankAddress: "Bank Address",
                    country: "Country",
                    city: "City",
                    back: "Back",
                    draftType: "Draft Type",
                    draftFavouring: "Draft Favouring",
                    draftPayableAt: "Draft Payable at",
                    deliverDraftTo: "Deliver Draft to",
                    deliveryLoc: "Delivery Location",
                    payeeAddr1: "Payee Address Line 1",
                    payeeAddr2: "Payee Address Line 2",
                    payeeCity: "Payee City",
                    payeeCountry: "Payee Country"
                },
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

    return new RecordViewNonFinancialLocale();
});