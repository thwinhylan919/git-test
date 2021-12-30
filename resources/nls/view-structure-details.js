define(["ojL10n!resources/nls/generic"], function(Generic) {
    "use strict";

    const viewStructureDetails = function() {
        return {
            root: {
                labels: {
                    createStructure: "Create Account Structure",
                    header: "Structure Parameters",
                    structureDescription: "Structure Description",
                    structureType: "Structure Type",
                    structureStatus: "Structure Status",
                    startDate: "Start Date",
                    endDate: "End Date",
                    interestMethod: "Interest Method",
                    structurePriority: "Structure Priority",
                    reallocationMethod: "Reallocation Method",
                    detailView: "View Account Structure",
                    detailsStructure: "View Structure Details",
                    detailViewTitle: "Detail View Of Structure",
                    structureDetail: "Structure Details",
                    structureId: "Structure Id",
                    download: "Download Structure Details",
                    createNewStructure: "Create New Structure",
                    createNewStructureAlt: "Click here to Create New Structure",
                    editStructure : "Edit Account Structure",
                    resumeStructure: "Resume Structure",
                    pausedStructure: "Pause Structure",
                    executeStructure: "Execute Structure",
                    centralAccountNumber: "Central Account",
                    accountCheck: {
                        true: "External",
                        false: "Internal"
                      }
                },
                structureStatus: {
                    Resumed: "Active",
                    Paused: "Paused",
                    Expired: "Expired"
                },
                structureType: {
                    Sweep: "Sweep",
                    Pool: "Pool",
                    Hybrid: "Hybrid"
                },
                interestMethod: {
                    I: "Interest",
                    A: "Advantage",
                    O: "Optimization"
                },
                messages: {
                    review: "You initiated a request for structure creation. Please review details before you confirm!",
                    edit : "You initiated a request for editing a structure. Please review details before you confirm!",
                    paused: "You initiated a request to pause a structure. Please review details before you confirm!",
                    resumed: "You initiated a request to resume a structure. Please review details before you confirm!",
                    execute: "You initiated a request to execute a structure. Please review details before you confirm!",
                    executeSuccesMessage: "Structure executed successfully",
                      pauseSuccesMessage: "Structure paused successfully",
                      resumeSuccesMessage: "Structure resumed successfully"
                },
                confirmScreen: {
                    approvalMessages: {
                        APPROVED: {
                            successmsg: "You have successfully approved the transaction",
                            statusmsg: "Completed"
                        },
                        PENDING_APPROVAL: {
                            successmsg: "You have successfully approved the request. It is pending for further approval.",
                            statusmsg: "Pending Approval"
                        },
                        REJECTED: {
                            successmsg: "You have rejected the request.",
                            statusmsg: "Rejected"
                        },
                        FAILED: {
                            successmsg: "Rejected by host.",
                            statusmsg: "Failed"
                        }
                    },
                    successMessage: "Your transaction is successful!",
                    failureMessage: "Your transaction is failed!",
                    corpMaker: "You have successfully initiated the transaction.",
                    successmsg: "You have successfully approved the transaction"
                },
                generic: Generic
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

    return new viewStructureDetails();
});