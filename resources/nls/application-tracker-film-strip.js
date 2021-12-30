define([], function() {
    "use strict";

    const AppTracker = function() {
        return {
            root: {
                header: "Application Tracker",
                heading: "Select Module",
                filmstripText: "Modules",
                mDetails: "Module Details",
                draft: "Draft",
                submitted: "Submitted",
                inprog: "In Progress",
                back:"Back",
                cancel:"Cancel",
                discription : {
                    tradeFinance:"Track the status of your Letter of Credit and Guarantee related requests. You can also retrieve and complete your saved applications.",
                    creditFacility:"Track the status of Facility creation and amendment related requests. You can also retrieve and complete your saved applications.",
                    loans:"Track the status of your Loan applications. You can also retrieve and complete your saved applications."
                },
                headers:{
                    tradeFinance:"Trade Finance",
                    creditFacility:"Credit Facilities",
                    loans:"Loan"
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

    return new AppTracker();
});