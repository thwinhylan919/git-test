define([], function () {
    "use strict";

    const timelinewidgetLocale = function () {
        return {
            root: {
                heading: { Timeline: "Invoice Timeline<br><span class='sub-heading'>As on {date}, in selected currency</span>" },
                Timeline: { InvoiceTimeline: "Invoice Timeline" },
                invoiceCount: "({count} Invoice)",
                invoicesCount: "({count} Invoices)",
                totalReceivables: "Total Receivables ({amount})",
                totalPayables: "Total Payables ({amount})",
                totalFinance: "Financed Invoices",
                dueIn: "Due In",
                duration1: "Overdue",
                duration2 : "0-30 days",
                duration3 : "31-60 days",
                duration4 : "61-90 days",
                duration5 : "Above 90 days",
                emptyText : "No data to Display.",
                currency : "Currency",
                noInvoicesText : "Currently, there are no invoices to display on the timeline.",
                linkText: "Click here to view {duration} invoices"
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

    return new timelinewidgetLocale();
});
