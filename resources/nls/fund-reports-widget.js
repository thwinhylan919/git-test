define([], function () {
    "use strict";

    const fundreportswidgetLocale = function () {
        return {
            root: {
                heading: { Reports: "Reports" },
                Reports: {
                    Reports: "Reports",
                    MutualFundsReports: "Mutual Funds Reports",
                    MutualFundsReportsTitle: "Click here for {reportLabel}",
                    capitalReports: "Capital Gain Reports",
                    transactionReports: "Detailed Transaction Reports",
                    dividendReports: "Dividend Reports"
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

    return new fundreportswidgetLocale();
});