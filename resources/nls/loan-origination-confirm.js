define([], function () {
    "use strict";

    const loanOrginationConfirmation = function () {
        return {
            root: {
                header: "Loan application",
                newApplicationLink: "New Loan Application",
                appTracker: "Go To Application Tracker",
                productName: {
                    EQLN: "Equipment Loan",
                    TRLN: "Term Loan",
                    WCLN: "Working Capital",
                    RELN: "Real Estate Loan"
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

    return new loanOrginationConfirmation();
});