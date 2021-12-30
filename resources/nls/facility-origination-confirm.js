define([], function () {
    "use strict";

    const loanOrginationConfirmation = function () {
        return {
            root: {
                loanConfirmation: {
                    thankYou: "Thank you!",
                    firstLine: "Your Credit Facility application has been saved successfully!",
                    secondLine: "You can resume the application via Application Tracker",
                    goToAppTracker : "Go to Application Tracker",
                    clickHere:"Click Here",
                    or: "Or",
                    forthLine:"Call us on +91 9820707707",
                    facilityApplicationNo : "Credit Facility Application Number",
                    facilityApplication : "Credit Facility application",
                    draftSaved : "Credit Facility application Draft",
                    draftRefNumber:"Draft Reference Number",
                    applyforNewFacility : "New Facility Application",
                    goToDashboard: "Go To Dashboard",
                    status:"Status",
                    draftSuccessMessage:"Credit Facility application saved successfully.",
                    confirmScreen: {
                    approvalMessages: {
                        Initiated: {
                            successmsg: "Credit Facility application has been initiated successfully.",
                            statusmsg: "Pending for approval"
                        },
                        PENDING_APPROVAL: {
                            successmsg: "Credit Facility application has been approved. It is pending for further approval.",
                            statusmsg: "Pending Approval"
                        },
                        Completed: {
                            successmsg: "Credit Facility application submitted successfully.",
                            statusmsg: "Completed"
                        },
                        APPROVED: {
                            successmsg: "Credit Facility application submitted successfully.",
                            statusmsg: "Completed"
                        },
                        REJECTED: {
                            successmsg: "Credit Facility application has been rejected.",
                            statusmsg: "Rejected"
                        },
                        FAILED: {
                            successmsg: "Rejected by host.",
                            statusmsg: "Failed"
                        }
                    }
                }
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