define([], function () {
    "use strict";

    const requestFinanceReview = function () {
        return {
            root: {
                heading: { ReviewPage: "Review Page" },
                ReviewPage: {
                    Confirm: "Confirm",
                    Cancel: "Cancel",
                    Back: "Back",
                    financeFor: "Finance for",
                    programLabel: "Program Name",
                    counterPartyLabel: "Counter Party Name",
                    currencyLabel: "Currency in which the finance to be disbursed",
                    amountRequested: "Amount Requested for Finance",
                    invoiceDueDate: "Due Date: {dueDate}"
                },
                componentHeader: "Request Finance",
                reviewCaption: "Review",
                reviewHeader: "You initiated a request for finance. Please review details before you confirm!",
                confirmMessage: "Your request has been initiated successfully!",
                amountRequested: "Amount Requested",
                disbursementCurrency: "Disbursement Currency",
                viewFinances: "View Finances",
                supplyChainOverview: "Supply Chain Overview",
                nextAction: "What would you like to do next?",
                dashboard: "Go to Dashboard",
                invoiceNumber: "Invoice Number",
                invoiceAmount: "Invoice Amount",
                totalInvoiceAmount: "Accepted Invoice Amount",
                maximumFinanceAmount: "Maximum Finance Amount",
                outstandingAmount: "Outstanding Amount",
                netFinanceAmount: "Net Finance Amount",
                selectedInvoices: "Selected Invoices",
                financeFor: "Invoice"
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

    return new requestFinanceReview();
});