define([], function () {
    "use strict";

    const viewinvoicedetailsLocale = function () {
        return {
            root: {
                heading: {
                    InvoiceDetails: "Invoice Details",
                    AmountDetails: "Amount Details",
                    PartyDetails: "Party Details",
                    CommodityDetails: "Commodity Details",
                    ButtonMatrix: "Button Matrix",
                    CancelInvoice: "Cancel Invoice",
                    RejectInvoice: "Reject Invoice"
                },
                InvoiceDetails: {
                    InvoiceRefNo: "Invoice Ref No.",
                    CustomerInvoiceNo: "Customer Invoice No.",
                    NameofProgram: "Name of Program",
                    PaymentTerms: "Payment Terms",
                    InvoiceDueDate: "Invoice Due Date",
                    PurchaseOrderNo: "Purchase Order No.",
                    PurchaseOrderDate: "Purchase Order Date",
                    ProductCode: "Product Code",
                    ShipmentDate: "Shipment Date",
                    AcceptanceDate: "Accepted Date",
                    PreAccepted: "Pre Accepted",
                    Comments: "Comments"
                },
                AmountDetails: {
                    InvoiceAmount: "Invoice Amount",
                    DiscountPercentage: "Discount Percentage",
                    DiscountAmount: "Discount Amount",
                    DiscountValue: "{discountPercent} %",
                    TaxPercentage: "Tax Percentage",
                    TaxAmount: "Tax Amount",
                    TaxValue: "{taxPercent} %",
                    FinalInvoiceAmount: "Final Invoice Amount",
                    AcceptanceAmount: "Acceptance Amount",
                    OutstandingAmount: "Outstanding Amount"
                },
                PartyDetails: {
                    BuyerName: "Buyer Name",
                    BuyerAddress: "Buyer Address",
                    BuyerId: "Buyer Id",
                    SupplierName: "Supplier Name",
                    SupplierAddress: "Supplier Address",
                    SupplierId: "Supplier Id"
                },
                CommodityDetails: {
                    CommodityDetails: "Commodity Details",
                    Name: "Name",
                    Description: "Description",
                    Quantity: "Quantity",
                    Costperunit: "Cost per unit",
                    Amount: "Amount",
                    CommodityName: "Commodity Name",
                    CommodityDescription: "Commodity Description"
                },
                CancelInvoice: {
                    Areyousureyouwanttocancelthisinvoice: "Are you sure you want to cancel this invoice?",
                    Yes: "Yes",
                    No: "No"
                },
                RejectInvoice: {
                    Areyousureyouwanttorejectthisinvoice: "Are you sure you want to reject this invoice?",
                    Reason: "Reason for rejection"
                },
                ButtonMatrix: {
                    Accept: "Accept",
                    Reject: "Reject",
                    Edit: "Edit",
                    CancelInvoice: "Cancel Invoice",
                    PayInvoice: "Pay Invoice",
                    RequestFinance: "Request Finance",
                    Cancel: "Cancel",
                    Back: "Back"
                },
                componentHeader: "View Invoice",
                rejectComponentHeader: "Accept / Reject Invoice",
                invoiceReject: "Invoice Reject Details",
                invoiceCancel: "Invoice Cancel Details",
                rejectConfirmMessage: "Invoice have been rejected successfully",
                cancelConfirmMessage: "Invoice have been Cancelled successfully",
                Custom: {
                    Comments: "NA"
                },
                confirmScreen: {
                    invoiceNumber: "Invoice No.",
                    invoiceRefNumber: "Host Reference No.",
                    comments: "Comments",
                    dashboard: "Go to dashboard"
                },
                AllStatus: {
                    InvoiceStatus: {
                        ACCEPTED: "Accepted",
                        PARTIAL_ACCEPTED: "Partially Accepted",
                        CANCELLED: "Cancelled",
                        REJECTED: "Rejected",
                        DISPUTED: "Disputed",
                        OTHERS: "Others",
                        RAISED: "Raised",
                        FINANCED: "Financed",
                        PARTIAL_FINANCED: "Partially Financed"
                    },
                    PaymentStatus: {
                        UNPAID: "Unpaid",
                        PART_PAID: "Partially Paid",
                        OVERDUE: "Overdue",
                        PAID: "Paid",
                        OTHERS: "Others"
                    }
                },
                viewInvoices: "View Invoices",
                supplyChainOverView: "Supply Chain Overview",
                dashboard: "Go to dashboard",
                paymentStatus: "Payment Status",
                invoiceStatus: "Invoice Status",
                invoiceCreationDate: "Invoice Creation Date",
                previewDownload: "Preview & Download Invoice",
                Download: "Download Invoice",
                previewDownloadTitle: "Click here to preview and download Invoice",
                DownloadTitle: "Click here to download Invoice",
                nextAction: "What would you like to do next",
                overlayTitle: "Invoice Details",
                commentsError: "Please enter a valid comment.",
                partyid: "Party ID : {partyId}",
                noData: "-",
                passCombination: "The document is password protected, it is a combination of the first 4 letters of your name (in capital letters) followed by your date of birth (in combination of first 2 letters of Date and Month).",
                passwordExample: "For example, if the name is ROOPA LAL and Date of birth is 23rd Dec, 1980 then the password will be ROOP2312",
                ok: "Ok",
                passwordNotification: "Password Combination"
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

    return new viewinvoicedetailsLocale();
});