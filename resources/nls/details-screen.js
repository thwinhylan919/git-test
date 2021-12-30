define(["ojL10n!resources/nls/generic"], function(Generic) {
    "use strict";

    const detailsScreenLocale = function() {
        return {
            root: {
                generic: Generic,
                heading: { ApplicationTracker: "Application Tracker" },
                ApplicationTracker: {
                    acceptedText: "Your Facility {txnId} has been accepted.",
                    facilityApplied: "Facility applied for {facilityAmount}",
                    collateralApplied: "Collateral applied for {collateralAmount}",
                    documents: "Documents",
                    documentsText: "View/Download your documents",
                    applicantDetails: "Application Details",
                    applicantDetailsDesc: "View your application",
                    creationDate: "On {date},{time}",
                    appliedOn: "On {ondate}"
                },
                componentHeader: "Application Tracker",
                processStatus: {
                    SUBMITTED: "Submitted",
                    IN_PROGRESS: "In Progress",
                    DRAFT: "Draft",
                    COMPLETED: "Completed"
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

    return new detailsScreenLocale();
});