define([], function () {
    "use strict";

    const loanapplicationtrackerLocale = function () {
        return {
            root: {
                heading: {
                    LoanApplicationTracker: "Loan Application Tracker"
                },
                LoanApplicationTracker: {
                    viewDetailsAlt:"View Details",
                    viewDetails: "View Details",
                    submitted: "Submitted",
                    inProgress: "In Progress",
                    draft: "Draft",
                    approved: "Approved",
                    rejected: "Rejected"
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

    return new loanapplicationtrackerLocale();
});