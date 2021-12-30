define([], function () {
    "use strict";

    const topprogramswidgetLocale = function () {
        return {
            root: {
                heading: { TopPrograms: "Top Programs" },
                TopPrograms: {
                    TopPrograms: "Top {count} Programs",
                    TopProgram: "Top Programs",
                    currencyGuideline : "In Local Currency Equivalent",
                    Receivables: "Receivables",
                    Payables: "Payables",
                    TotalReceivables: "Receivables {amount}",
                    TotalPayables: "Payables {amount}"
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
                ViewAllPrograms: "View All Programs",
                ViewAllProgramsTitle: "View All Associated Programs",
                noSellerProgramsMessage: "Currently, there are no 'Receivables' from the spokes",
                noBuyerProgramsMessage: "Currently, there are no 'Payables' from the spokes"
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

    return new topprogramswidgetLocale();
});
