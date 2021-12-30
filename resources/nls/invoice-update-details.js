define([], function () {
    "use strict";

    const invoiceupdatedetailsLocale = function () {
        return {
            root: {
                heading: { InvoiceDetails: "Invoice Details" },
                InvoiceDetails: {
                    InvoiceAcceptDetails: "Invoice Accept Details",
                    SupplierName: "Supplier Name",
                    InvoiceNumber: "Invoice Number",
                    InvoiceAmount: "Invoice Amount",
                    Status: "Status",
                    Message: "Message"
                },
                supplierName: "Supplier Name",
                invoiceNumber: "Invoice No.",
                invoiceRefNumber: "Host Reference No.",
                invoiceAmount: "Invoice Amount",
                status: "Status",
                reason: "Reason",
                success: "Success",
                failed: "Failed",
                initiated: "Initiated",
                pendingMessage: "Pending for Approval"
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

    return new invoiceupdatedetailsLocale();
});