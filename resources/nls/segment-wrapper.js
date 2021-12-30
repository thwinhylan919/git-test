define([], function() {
    "use strict";

    const processmanagementLocale = function() {
        return {
            root: {
                header: {
                    "loan-requirements": "Loan Requirement",
                    "real-estate-details": "Real Estate Details",
                    "business-details": "Business Details",
                    "corporate-details": "Applicant Details",
                    "document-upload": "Upload Documents",
                    "equipment-details": "Equipment Details",
                    "trade-details": "Trade Details",
                    "facility-application": "Facility Requirements",
                    "amend-facility": "Collaterals",
                    "apply-new-facility": "Facility Requirements",
                    "upload-documents": "Upload Documents",
                    "collateral-evaluation-details": "Collateral Details",
                    "collateral-evaluation-ownership-details": "Ownership Details",
                    "collateral-evaluation-seniority-details": "Seniority Details",
                    "collateral-evaluation-documents-upload": "Upload Documents"
                },
                headingmsg: "Please complete the step by clicking on continue at the respective stage.",
                invalidDescription: "Please enter a valid draft name",
                saveAsDraft: "Save as Draft",
                draftMessage: "Saved application can be retrieved from Application Tracker.",
                continue: "Continue",
                cancel: "Cancel",
                back: "Back",
                saveReview: "Save & Review",
                backtoDashboard: "Back to Dashboard",
                componentHeader: "Wrapper",
                status: "Draft",
                home: "Home",
                segmentSelect: "Select Segment",
                homeAlt: "Click to go to home page",
                homeTitle: "Link to go to home page",
                save: "Save",
                draftName: "Draft Name",
                submit: "Submit"
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

    return new processmanagementLocale();
});