define([], function () {
    "use strict";

    const invoicecreatedetailsLocale = function () {
        return {
            root: {
                heading: { CreateInvoiceDetails: "Create Invoice Details" },
                CreateInvoiceDetails: {
                    InvoiceCreateDetails: "Invoice Create Details",
                    BuyerName: "Buyer Name",
                    ReferenceNumber: "Reference Number",
                    InvoiceAmount: "Invoice Amount",
                    Status: "Status",
                    Reason: "Reason",
                    CreationDetails: "Creation Details",
                    ReasonForFailure: "Reason For Failure"
                },
                buyerName: "Buyer Name",
                invoiceNumber: "Invoice No.",
                invoiceRefNumber: "Host Reference No.",
                invoiceAmount: "Invoice Amount",
                status: "Status",
                reasonForFailure: "Reason",
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

    return new invoicecreatedetailsLocale();
});