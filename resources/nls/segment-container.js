define([], function() {
    "use strict";

    const processmanagementLocale = function() {
        return {
            root: {
                productHeader: {
                    loan: {
                        header: "Loan Application",
                        line1: "You are just few steps away!!!",
                        line2: "Verify & Update your details to complete {productType} Application"
                    },
                    facility: {
                        header: "Facility Application",
                        line1: "You can start from any step.",
                        line2: "Simply fill in the required details and submit the application."
                    },
                    facilityAmend: {
                        header: "Amend Facility",
                        line1: "You can start from any step.",
                        line2: "Simply fill in the required details and submit the application."
                    },
                    collateralEvaluation: {
                        header: "Collateral Evaluation",
                        line1: "You can start from any step.",
                        line2: "Simply fill in the required details and submit the application."
                    }
                },
                status: {
                    getStarted: "Get Started",
                    completed: "Completed",
                    autoFilled: "Auto Filled",
                    inProgress: "In Progress"
                },
                segments: {
                    "loan-requirements": {
                        name: "Loan Requirement",
                        description: "Let us know the amount and tenor of the loan"
                    },
                    "real-estate-details": {
                        name: "Real Estate Details",
                        description: "Let us know the details of your real estate"

                    },
                    "business-details": {
                        name: "Business Details",
                        description: "Help us with nature and activity of your business"

                    },
                    "corporate-details": {
                        name: "Applicant Details",
                        description: "Let us know the details of your Enterprise Details"

                    },
                    "document-upload": {
                        name: "Upload Documents",
                        description: "Submit supporting documents"

                    },
                    "equipment-details": {
                        name: "Equipment Details",
                        description: "Let us know the details of your equipments and machinery"

                    },
                    "trade-details": {
                        name: "Trade Details",
                        description: "Let us know the details of your trade finance"
                    },
                    "facility-application": {
                        name: "Facility Requirements",
                        description: "Let us know the amount and duration for credit facility"

                    },
                    "apply-new-facility": {
                        name: "Facility Requirements",
                        description: "Let us know the amount and duration for credit facility"

                    },
                    "amend-facility": {
                        name: "Collaterals",
                        description: "View your existing collaterals and add new collaterals if required"

                    },
                    "upload-documents": {
                        name: "Upload Documents",
                        description: "Submit supporting documents"

                    },
                    "collateral-evaluation-details": {
                        name: "Collateral Details",
                        description: "Provide the details of the collateral which needs to be evaluated."
                    },
                    "collateral-evaluation-ownership-details": {
                        name: "Ownership Details",
                        description: "Confirm if the collateral has single or joint ownership."
                    },
                    "collateral-evaluation-seniority-details": {
                        name:"Seniority Details",
                        description: "Provide the charge details for the collateral"
                    },
                    "collateral-evaluation-documents-upload": {
                        name:"Upload Documents",
                        description: "Submit supporting documents"
                    }

                },
                Youarejustfewstepsaway: "You are just few steps away!!!",
                VerifyUpdateyourdetailstocomplete: "Verify & Update your details to complete {productDisplayName}",
                LoanApplication: "Loan Application",
                editsegment: "edit segment",
                editsegmentTitle: "Click for edit segment",
                continue: "Continue",
                cancel: "Cancel",
                back: "Back",
                saveDraft: "Save as Draft",
                backtoDashboard: "Back to Dashboard",
                proceed: "Proceed",
                termAndCondition: "I agree to the Terms and conditions",
                verifyYourtag: "Verify Your",
                ok: "OK",
                completeSegmentsWarning: "Please complete all the mandatory Segment",
                doumentUpload: "Document Upload",
                inProgress: "In-Progress",
                completed: "Completed",
                submit: "Submit",
                computedProgress: "{computedData}% Remaining",
                select: "Select",
                reviewparty: "Warning!!",
                reviewpartyWarningMessge: "Chosen party Id can not be change later. Would like to continue?",
                yes: "Yes",
                no: "No",
                partyIdSelect: "Please Select Party-Id First before proceeding to fill form"
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