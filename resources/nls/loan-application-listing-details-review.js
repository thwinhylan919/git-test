define([], function () {
    "use strict";

    const processmanagementLocale = function () {
        return {
            root: {
                heading: "Loan Application Summary",
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
                    facilityAmend: "You have initiated a request for Facility Amendment. Please review the details before you confirm!"
                },
                select: "Select",
                editsegment: "edit segment",
                editsegmentTitle: "Click for edit segment",
                continue: "Continue",
                saveDraft: "Save as Draft",
                proceed: "Proceed",
                termsNCondition: "I agree to the Terms & Condition",
                termsNConditionLink: "See Terms & Condition",
                verifyYourtag: "Verify Your",
                requestType: {
                    TermLoan: "Term Loan",
                    WorkingCapitalLoan: "Working Capital",
                    EquipmentFinancingLoan: "Equipment Loan",
                    RealEstateLoan: "Real Estate Loan"
                },
                processStatus: {
                    SUBMITTED: "Submitted",
                    IN_PROGRESS: "In Progress",
                    DRAFT: "Draft",
                    COMPLETED: "Completed"
                },
                loanAppliedFor: "Loan Applied for",
                On: "On {date}"
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