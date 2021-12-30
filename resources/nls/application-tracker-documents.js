define([], function () {
    "use strict";

    const applicationtrackerdocumentsLocale = function () {
        return {
            root: {
                heading: { TradeFinance: "Trade Finance" },
                TradeFinance: {
                    TradeFinance: "Trade Finance",
                    ApplicationDescription: "Application Description",
                    ApplicationID: "Application ID",
                    ApplicationStatus: "Application Status",
                    ApplicationDate: "Application Date",
                    Documents: "Documents",
                    On:"On {date}",
                    Cancel:"Cancel",
                    Back:"Back",
                    DocumentDescription: "Document Description",
                    DocumentNameTitle: "Click for Document Name",
                    NoDocuments:"Currently, there are no documents available for you to View or Download. If you are unable to see your uploaded document, please contact the bank.",
                    Status: {
                        SUBMITTED:"Submitted",
                        IN_PROGRESS:"In Progress",
                        DRAFT:"Draft",
                        APPROVED:"Approved",
                        REJECTED:"Rejected",
                        ACTIVE: "Active",
                        CLOSED: "Closed"
                      },
                      TypeOfApplication:{
                        LETTER_OF_CREDIT:"Letter Of Credit",
                        BILLS:"Bills",
                        BANK_GUARANTEE:"Bank Guarantee"
                    }
                },

                componentHeader: "Application Tracker"
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

    return new applicationtrackerdocumentsLocale();
});