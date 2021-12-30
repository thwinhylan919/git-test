define([], function () {
    "use strict";

    const invoicecreationhomeLocale = function () {
        return {
            root: {
                heading: { CreateInvoice: "Create Invoice" },
                CreateInvoice: {
                    PartyName: "Party Name",
                    PartyIDpartyId: "Party ID : {partyId}",
                    InvoiceCreation: "Invoice Creation",
                    YoucancreatesingleormultipleinvoicesonlinebyselectingOnlineInvoiceCreationTouploadinvoicesinbulkselectBulkFileUpload: "You can create single or multiple invoices online by selecting Online Invoice Creation. To upload invoices in bulk, select Bulk File Upload.",
                    OnlineInvoiceCreation: "1. Online Invoice Creation",
                    CreateInvoiceonthegoandViewinstantly: "Create Invoice on the go and View instantly",
                    CreateNewInvoice: "Create New Invoice",
                    BulkFileUploadCreation: "2. Bulk File Upload Creation",
                    Uploadmultipleinvoiceswithabulkuploadfacility: "Upload multiple invoices with a bulk upload facility",
                    BulkFileUpload: "Bulk File Upload",
                    desktopOnlyText: "Create Invoice feature is available only on Desktop."
                },
                componentHeader: "Create Invoice"
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

    return new invoicecreationhomeLocale();
});