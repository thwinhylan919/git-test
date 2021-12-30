define([], function() {
    "use strict";

    const viewinvoiceLocale = function() {
        return {
            root: {
                heading: {
                    ViewInvoice: "View Invoice",
                    Search: "Search",
                    listOfInvoices: "List of Invoices"
                },
                ViewInvoice: {
                    SwitchView: "Switch View",
                    SelectyourroleasaBuyeroraSuppliertoviewyourdataintermsofReceivablesorPayables: "Select your role as a Buyer or a Supplier to view your data in terms of Receivables or Payables",
                    Supplier: "Supplier",
                    Buyer: "Buyer",
                    PartyID: "Party ID :{partyId}"
                },
                Search: {
                    InvoiceNo: "Invoice No.",
                    CounterPartyName: "Counter Party Name",
                    InvoiceStatus: "Invoice Status",
                    ProgramName: "Program Name",
                    PaymentStatus: "Payment Status",
                    InvoiceAmountRange: "Invoice Amount Range",
                    InvoiceDueDate: "Invoice Due Date",
                    From: "From",
                    To: "To",
                    MoreSearchOptions: "More Search Options",
                    MoreSearchOptionsTitle: "Click for More Search Options",
                    LessSearchOptions: "Less Search Options",
                    LessSearchOptionsTitle: "Click for Less Search Options",
                    Search: "Search",
                    Clear: "Clear"
                },
                InvoiceList: {
                    OustandingInvoices: "Outstanding Invoices",
                    CounterpartyName: "Counterparty Name",
                    ProgramName: "Program Name",
                    InvoiceNo: "Invoice No",
                    InvoiceAmount: "Invoice Amount",
                    DueDate: "Due Date",
                    InvoiceStatus: "Invoice Status",
                    AmountPayble: "Amount Payable",
                    AmountReceivable: "Amount Receivable",
                    PaymentStatus: "Payment Status",
                    InvoiceNoTitle: "Click for Invoice No",
                    invoiceStatus: "invoice Status",
                    statusOthers: "Others"
                },
                linkToCreate: "Create New Invoice",
                textToCreate: "on the go and View instantly",
                componentHeader: "View Invoice",
                select: "Select",
                download: "Download All",
                yes: "Yes",
                no: "No",
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

    return new viewinvoiceLocale();
});