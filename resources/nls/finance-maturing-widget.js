define([], function () {
    "use strict";

    const timelinewidgetLocale = function () {
        return {
            root: {
                heading: { Timeline: "Finance Maturing<br>" },
                totalFinance: "Financed Invoices",
                seriesLabel: "Amount in {currency}",
                days: "Days",
                duration1: "Overdue",
                duration2 : "Due in 30",
                duration3 : "31-60",
                duration4 : "61-90",
                duration5 : "Above 90",
                emptyText : "No data to Display.",
                currency : "Currency",
                viewFinances: "View All Finances",
                currencyEquivalent: "In Selected Currency Equivalent",
                viewFinancesLink: "View All Finances link",
                noFinancesText : "Currently, there are no finances to display.",
                FinanceStatus : {
                    DISBURSED: "Disbursed",
                    PARTIAL_SETTLED: "Partially Settled"
                }
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
