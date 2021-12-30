define([], function () {
    "use strict";

    const reviewtransactiondetailsLocale = function () {
        return {
            root: {
                heading: {
                    ReviewTransactionDetails: "Review Transaction Details",
                    ResourceMappingSummary: "{attributeName} Mapping Summary"
                },
                TransactionDetails: {
                    Confirm: "Confirm",
                    Cancel: "Cancel",
                    Back: "Back",
                    cancelMessage: "Are you sure you want to cancel the operation?",
                    warning: "Warning",
                    yes: "Yes",
                    no: "No"
                },

                review: "Review",
                reviewMessage: "You have initiated {attributeName} transactions mapping. Please review details before you confirm!"
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

    return new reviewtransactiondetailsLocale();
});