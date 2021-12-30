define([], function () {
    "use strict";

    const transactiondetailsLocale = function () {
        return {
            root: {
                heading: { TransactionDetails: "Transaction Details" },
                TransactionDetails: {
                    Save: "Save",
                    Cancel: "Cancel",
                    Back: "Back",
                    Edit: "Edit"
                },
                componentHeaderUser: "User Resource Access",
                componentHeaderParty: "Party Resource Access"
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

    return new transactiondetailsLocale();
});