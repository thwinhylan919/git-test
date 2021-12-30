define([], function () {
    "use strict";

    const overdueinvoiceswidgetLocale = function () {
        return {
            root: {
                heading: { Overdue: "Overdue Invoices" },
                Overdue: {
                    Overdue: "Overdue Invoices",
                    Receivables: "Receivables",
                    Payables: "Payables",
                    overdueTable: "overdue Table",
                    invoicenumber: "invoice number",
                    overdueamount: "overdue amount",
                    numberofdaysoverdue: "number of days overdue",
                    ViewAllInvoices: "View All Invoices",
                    ViewAllInvoicesTitle: "Click for View All Invoices"
                },
                InvoiceStatus : {
                    ACCEPTED: "Accepted",
                    RAISED: "Raised",
                    FINANCED: "Financed",
                    PARTIAL_FINANCED: "Partially Financed"
                },
        PaymentStatus : {
                    UNPAID: "Unpaid",
                    PART_PAID: "Partially Paid",
                    OVERDUE: "Overdue"
                },
                InvoiceNumber: "Invoice Number",
                AmountOverdue: "Amount",
                Noofdaysoverdue: "Overdue Days",
                nooverdueMessage : "There are no overdue invoices to be displayed!"
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

    return new overdueinvoiceswidgetLocale();
});
