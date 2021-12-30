define([], function () {
    "use strict";

    const reviewupipendingrequestLocale = function () {
        return {
            root: {
                heading: { PendingRequests: "Pending Requests" },
                PendingRequests: {
                    SendMoneyto: "Send Money to",
                    SendFrom: "Send From",
                    DateofRequest: "Date of Request",
                    ExpiryDate: "Expiry Date",
                    Amount: "Amount",
                    ReferenceNumber: "Reference Number",
                    Note: "Note",
                    Confirm: "Confirm",
                    Back: "Back",
                    makeAnotherTransfer:"Go to Pending Requests",
                    TransactionID: "Transaction ID"
                },
                componentHeader: "Pending Requests",
                review: "Review",
                reviewUpiPendingRequest: "You have initiated a request to transfer money. Please review the details before you confirm!"
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

    return new reviewupipendingrequestLocale();
});
