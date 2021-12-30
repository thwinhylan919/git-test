define([], function () {
    "use strict";

    const invoiceacceptrejectLocale = function () {
        return {
            root: {
                heading: {
                    InvoiceList: "Invoice List"
                },
                componentHeader: "Accept/Reject Invoice",
                InvoiceList: {
                    SelectBox: "Select Box",
                    CounterPartyName: "Associated Party Name",
                    ProgramName: "Program Name",
                    InvoiceNumber: "Invoice Number",
                    InvoiceNumberTitle: "Click for Invoice Number",
                    InvoiceAmount: "Invoice Amount",
                    DueDate: "Due Date",
                    Status: "Status",
                    SelectAll: "Select All",
                    SelectListVew: "Select List View",
                    Accept: "Accept",
                    Reject: "Reject"
                },
                Relation : {
                    A: "Anchor",
                    CP: "Counterparty"
                },
                Role: {
                    B: "Buyer",
                    S: "Supplier"
                },
                InvoiceStatus : {
                    RAISED: "Raised"
                },
                PaymentStatus : {
                    UNPAID: "Unpaid"
                },
                partyLabel: "Party ID : {partyId}",
                downloadAll: "Download All",
                typeComments: "Type Comments",
                overlayTitle: "Invoice Details",
                searchName: "Supplier name, Program name, Invoice Number",
                nameError: "Please Enter Valid Comments",
                noInvoicesError : "There are no invoices to Accept/Reject.",
                noInvoicesSelectedError : "You need to select at least one invoice to proceed.",
                Remarks: "Comments"
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

    return new invoiceacceptrejectLocale();
});