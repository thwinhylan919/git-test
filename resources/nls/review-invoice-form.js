define([], function () {
    "use strict";

    const reviewinvoiceformLocale = function () {
        return {
            root: {
                heading: { CreateInvoice: "Edit Invoice" },
                CreateInvoice: {
                    CustomerInvoiceNo: "Customer Invoice No",
                    NameofProgram: "Name of Program",
                    BuyerName: "Buyer Name",
                    PaymentTerms: "Payment Terms",
                    InvoiceDate: "Invoice Date",
                    InvoiceDueDate: "Invoice Due Date",
                    PurchaseOrderNo: "Purchase Order No",
                    ShipmentDate: "Shipment Date",
                    PurchaseOrderDate: "Purchase Order Date",
                    AddCommodityDetails: "Add Commodity Details",
                    InvoiceAmount: "Invoice Amount",
                    TaxPercentage: "Tax Percentage",
                    DiscountPercentage: "Discount Percentage",
                    InvoiceAmountValue: "Invoice Amount Value",
                    TaxValue: "Tax Value",
                    TaxAmount: "Tax Amount",
                    DiscountValue: "Discount Value",
                    DiscountAmount: "Discount Amount",
                    NetInvoiceAmount: "Net Invoice Amount",
                    NetInvoiceAmountValue: "Net Invoice Amount Value",
                    CommodityDetails: "Commodity Details",
                    CommodityDetailsTable: "Commodity Details Table",
                    Name: "Name",
                    Description: "Description",
                    Quantity: "Quantity",
                    Costperunit: "Cost per unit",
                    Amount: "Amount",
                    TotalInvoiceAmount: "Total Invoice Amount",
                    TotalAmountValue: "Total Amount Value",
                    TaxAmountValue: "Tax Amount Value",
                    DiscountAmountforcommodities: "Discount Amount for commodities",
                    Confirm: "Confirm",
                    Cancel: "Cancel",
                    Back: "Back",
                    CommodityName: "Commodity Name",
                    Quantityofcommodity: "Quantity of commodity",
                    CommodityAmount: "Commodity Amount"
                },
                componentHeader: "Edit Invoice",
                createHeader: "Create Invoice",
                reviewScreen: {
                    reviewCaption: "REVIEW",
                    reviewHeader: "You initiated a request for invoice update. Please review details before you confirm!",
                    createHeader: "You initiated a request for invoice creation. Please review details before you confirm!"
                },
                confirmScreen: {
                    viewInvoice: "View Invoice",
                    scfDashboard: "Supply Chain Overview",
                    dashboard: "Go to Dashboard",
                    customerInvoiceNumber: "Customer Invoice No",
                    programName: "Program  Name",
                    confirmMessage: "Your request has been initiated successfully !",
                    failureMessage: "Your request could not be placed.",
                    navigationText: "What would you like to do next?",
                    invoiceRefNumber: "Host Reference No."
                },
                typeNamePlaceholder: "Type Name",
                descriptionPlaceholder: "Type Description",
                no: "No",
                yes: "Yes",
                invoiceDetails: "Invoice Details",
                supplyChainOverView: "Supply Chain Overview",
                viewInvoices: "View Invoice",
                NA: "-"
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

    return new reviewinvoiceformLocale();
});