define([], function() {
    "use strict";

    const processmanagementLocale = function() {
        return {
            root: {
                segment: {
                    "loan-requirements": "Loan Requirement",
                    "real-estate-details": "Real Estate Details",
                    "business-details": "Business Details",
                    "corporate-details": "Applicant Details",
                    "document-upload": "Upload Documents",
                    "equipment-details": "Equipment Details",
                    "trade-details": "Trade Details",
                    "facility-application": "Facility Requirements",
                    "apply-new-facility": "Facility Requirements",
                    "amend-facility": "Collaterals",
                    "upload-documents": "Upload Documents",
                    "collateral-evaluation-details":"Collateral Details",
                    "collateral-evaluation-ownership-details":"Ownership Details",
                    "collateral-evaluation-seniority-details":"Seniority Details",
                    "collateral-evaluation-documents-upload":"Upload Documents"
                },
                confirm: "Confirm",
                ok: "OK",
                cancel: "Cancel",
                back: "Back",
                edit: "Edit",
                review: "REVIEW",
                showLess: "Show Less",
                showMore: "Show More",
                reviewEditMessage: {
                    loan: "You initiated a request for {productType}. Please review details before you confirm!",
                    facility: "You have initiated a request for Facility Origination. Please review the details before you confirm!",
                    facilityAmend: "You have initiated a request for Facility Amendment. Please review the details before you confirm!",
                    collateralEvaluation:"You initiated a request for Collateral Evaluation. Please review details before you confirm!"
                },
                backtoDashboard: "Back to Dashboard",
                select: "Select",
                status: "Status",
                editsegment: "Edit segment",
                editsegmentTitle: "Click for edit segment",
                continue: "Continue",
                saveDraft: "Save as Draft",
                proceed: "Proceed",
                termsNCondition: "I agree to the Terms & Condition",
                termsNConditionLink: "See Terms & Condition",
                iAgree: "I agree to the terms and conditions",
                verifyYourtag: "Verify Your",
                termsAndConditionText: "In these General Conditions the singular includes the plural and vice versa and Loan means the loan detailed overleaf or, as the case may require, the balance thereof from time to time outstanding. Any reference to we us and our means the Bank. Bank means permanent p.l.c. its successors and assigns.  Regulations means the European Communities (Consumer Credit Agreements) Regulation 2010 (and as may be amended from time to time). In the event of a conflict between these General Conditions and the Special Conditions, the Special Conditions shall prevail.",
                termsAndCondition: "Terms and conditions",
                errorForTermsAndCondition: "Please accept Terms and Conditions!!",
                termsNConditionLinkAlt: "Click to read Terms and Conditions",
                termsNConditionLinkTitle: "Link for Terms and Conditions",
                segmentEditTitle: "Click to go to segment",
                termsAndConditionHeader: "Terms and Conditions"
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