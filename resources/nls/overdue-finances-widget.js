define([], function () {
    "use strict";

    const overdueinvoiceswidgetLocale = function () {
        return {
            root: {
                heading: {
                    Overdue: "Overdue Finances"
                },
                Overdue: {
                    Overdue: "Overdue Finances",
                    Receivables: "Receivables",
                    Payables: "Payables",
                    overdueTable: "Overdue Finances Table",
                    invoicenumber: "Finance Ref. No.",
                    ViewAllInvoices: "View All Finances",
                    ViewAllInvoicesTitle: "Click for View All Finances"
                },
                FinanceStatus: {
                    DISBURSED: "Disbursed",
                    PARTIAL_SETTLED: "Partially Settled"
                },
                FinanceNumber: "Finance Ref. No.",
                AmountOverdue: "Amount",
                Noofdaysoverdue: "Overdue Days",
                nooverdueMessage: "There are no overdue finances to be displayed!"
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