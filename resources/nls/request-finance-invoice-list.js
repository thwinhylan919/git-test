define([], function () {
    "use strict";

    const requestfinanceinvoicelist = function () {
        return {
            root: {
                componentHeader: "Request Finance",
                heading: {
                    SelectInvoices: "Select Invoices",
                    SubHeading: "You can request for maximum {percent}% of the Accepted Invoice Amount."
                },
                InvoiceList: {
                    InvoiceList: "Invoice List",
                    SelectBox: "Select Box",
                    CounterPartyName: "Counter Party Name",
                    ProgramName: "Program Name",
                    InvoiceNumber: "Invoice Number",
                    InvoiceNumberTitle: "Click for Invoice Number",
                    InvoiceAmount: "Invoice Amount",
                    DueDate: "Due Date",
                    Status: "Status",
                    SelectAll: "Select All",
                    InvoicesList: "Invoices List",
                    SelectListVew: "Select List View",
                    CounterpartyName: "Counterparty Name",
                    ProgramNameValue: "Program Name Value",
                    InvoiceNo: "Invoice No.",
                    InvoiceNumberValue: "Invoice Number Value",
                    InvoiceAmountValue: "Invoice Amount Value",
                    DueDateValue: "Due Date Value",
                    Accept: "Request Finance",
                    Reject: "Cancel",
                    Back: "Back"
                },
                InvoiceStatus : {
                    ACCEPTED: "Accepted",
                    PARTIAL_FINANCED: "Partially Financed"
                },
                PaymentStatus : {
                    UNPAID: "Unpaid",
                    PART_PAID: "Partially Paid",
                    OVERDUE: "Overdue"
                },
                invoiceDueDate: "Due Date: {dueDate}",
                requestedAmount: "Amount Requested for Finance",
                invalidInputAmount: "Please enter a valid amount",
                counterPartyName: "Counterparty Name & ID",
                programNameId: "Program Name and ID",
                invoiceNumber: "Invoice No",
                invoiceAmount: "Invoice Amount",
                dueDate: "Due Date",
                status: "Status",
                partyLabel: "Party ID : {partyId}",
                downloadAll: "Download All",
                raised: "Raised",
                remarks: "Comments",
                typeComments: "Type Comments",
                overlayTitle: "Invoice Details",
                searchName: "Supplier name, Program name",
                nameError: "Please Enter Valid Comments",
                totalInvoiceAmount: "Accepted Invoice Amount",
                maximumFinanceAmount: "Maximum Finance Amount",
                outstandingAmount: "Outstanding Amount",
                netFinanceAmount: "Net Finance Amount",
                totalSelectedInvoices: "Total Selected Invoices",
                totalAmountSelectedInvoiceCurrency: "Total Amount Selected",
                totalAmountSelectedDisbursementCurrency: "Total Amount in Disbursed Currency",
                invoiceErrorMessage: "Selection of Invoice is mandatory for requesting Finance.",
                currencyRateMessage: "Currency rate from {currency1} to {currency2} is not maintained.",
                currencyRate: "(Exchange rate at {rate})",
                differentCurrencyMessage: "Please select Invoices of same currency.",
                ok: "Ok",
                currencyNotification: "Currency Information"
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

    return new requestfinanceinvoicelist();
});