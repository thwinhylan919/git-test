define([], function () {
    "use strict";

    const reviewmultipleinvoicesLocale = function () {
        return {
            root: {
                heading: { CreateInvoice: "Create Invoice" },
                CreateInvoice: {
                    ExpandAll: "Expand All",
                    ExpandAllTitle: "Click for Expand All",
                    CollapseAll: "Collapse All",
                    CollapseAllTitle: "Click for Collapse All",
                    CustomerInvoiceNo: "Customer Invoice No",
                    NameofProgram: "Name of Program",
                    BuyerName: "Buyer Name",
                    PaymentTerms: "Payment Terms",
                    PreviewInvoice: "Preview Invoice",
                    PreviewInvoiceTitle: "Click for Preview Invoice",
                    overlayTitle: "Invoice Details",
                    Confirm: "Confirm",
                    Cancel: "Cancel",
                    Back: "Back"
                },
                componentHeader: "Create Invoice",
                reviewScreen: {
                    reviewCaption: "REVIEW",
                    reviewHeader: "You initiated a request for invoice creation. Please review details before you confirm!"
                },
                invoiceDetails: "Invoice Details",
                acceptConfirmMessage: "Your request for creating invoice(s) has been initiated successfully!",
                rejectConfirmMessage: "One or More Invoice(s) creation has been Failed. Click on below link to view the Status",
                rejectTemplate: "Template is not saved Successfully.",
                acceptTemplate: "Template is saved Successfully.",
                nextAction: "What would you like to do next?",
                viewMore: "Click here to view the Status of the invoice(s)",
                supplyChainOverView: "Supply Chain Overview",
                viewInvoices: "View Invoice"
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

    return new reviewmultipleinvoicesLocale();
});