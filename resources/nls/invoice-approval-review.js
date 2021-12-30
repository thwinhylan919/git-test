define([], function () {
    "use strict";

    const invoiceapprovalreviewLocale = function () {
        return {
            root: {
                heading: { ReviewPage: "Review Page" },
                ReviewPage: {
                    Raised: "Raised",
                    Confirm: "Confirm",
                    Cancel: "Cancel",
                    Back: "Back",
                    notApplicable: "NA"
                },
                InvoiceList: {
                    CounterPartyName: "Associated Party Name",
                    ProgramName: "Program Name",
                    InvoiceNumber: "Invoice Number",
                    InvoiceAmount: "Invoice Amount",
                    DueDate: "Due Date",
                    Status: "Status",
                    Remarks: "Comments"
                },
                confirmScreen: {
                    invoiceNumber: "Invoice No.",
                    invoiceRefNumber: "Host Reference No.",
                    comments: "Comments"
                },
                componentHeader: "Accept / Reject Invoice",
                reviewCaption: "Review",
                reviewHeaderAccept: "You initiated a request to accept Invoices. Please review details before you confirm!",
                reviewHeaderReject: "You initiated a request to reject Invoices. Please review details before you confirm!",
                acceptConfirmMessage: "Invoice have been accepted successfully",
                rejectConfirmMessage: "Invoice have been rejected successfully",
                acceptFailureMessage: "One or More Invoice(s) submitted for Acceptance have been Failed. Click on below link to view the Status.",
                rejectFailureMessage: "One or More Invoice(s) submitted for Rejection have been Failed. Click on below link to view the Status.",
                viewInvoices: "View Invoices",
                supplyChainOverView: "Supply Chain Overview",
                nextAction: "What would you like to do next?",
                viewMore: "Click to view details",
                invoiceAccept: "Invoice Accept Details",
                invoiceReject: "Invoice Reject Details",
                dashboard:"Dashboard"
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

    return new invoiceapprovalreviewLocale();
});