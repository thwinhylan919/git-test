define([], function() {
    "use strict";

    const previewinvoicedetailsLocale = function() {
        return {
            root: {
                heading: {
                    InvoiceNo: "Invoice No. {invoiceValue}",
                    CommodityDetails: "Commodity Details"
                },
                InvoiceNo: {
                    CompanyName: "Company Name",
                    ExternalInvoiceRefNo: "External Invoice Ref No.",
                    UserAddress: "User Address",
                    InvoiceDate: "Invoice Date",
                    ProgramName: "Program Name",
                    To: "To",
                    PurchaseOrderNo: "Purchase Order No",
                    PurchaseOrderDate: "Purchase Order Date",
                    BalanceDue: "Balance Due",
                    DueDate: "Due Date",
                    supplierDetails: "{supplierName}.<br>{supplierAddress}",
                    buyerDetails: "{buyerName}.<br>{buyerAddress}"
                },
                CommodityDetails: {
                    CommodityDetails: "Commodity Details",
                    Name: "Name",
                    Description: "Description",
                    Quantity: "Quantity",
                    Costperunit: "Cost per unit",
                    Amount: "Amount",
                    CommodityName: "Commodity Name",
                    CommodityDescription: "Commodity Description",
                    CommodityQuantity: "Commodity Quantity",
                    InvoiceAmount: "Invoice Amount",
                    InvoiceAmountValue: "Invoice Amount Value",
                    TaxPercentage: "Tax Percentage",
                    DiscountPercentage: "Discount Percentage",
                    TaxValue: "Tax Value",
                    DiscountValue: "Discount Value",
                    Percent: "(Percent %)",
                    NetInvoiceAmount: "Net Invoice Amount",
                    PaymentTerms: "Payment Terms",
                    DiscountPercentValue: "{discountPercent} %",
                    TaxPercentValue: "{taxPercent} %"
                },
                ok: "Ok",
                passwordNotification: "Password Combination",
                notApplicable: "NA",
                DownloadInvoice: "Download Invoice",
                downloadNote : "The document is password protected, it is a combination of the first 4 letters of your name (in capital letters) followed by your date of birth (in combination of first 2 letters of Date and Month).For example, if the name is ROOPA LAL and Date of birth is 23rd Dec, 1980 then the password will be ROOP2312",
                downloadTitle : "The document will be downloaded soon.",
                closeNoteAlt : "Click to close Note",
                closeNoteTitle : "Close Note"
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

    return new previewinvoicedetailsLocale();
});