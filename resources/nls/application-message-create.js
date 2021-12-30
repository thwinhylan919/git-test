define(["ojL10n!resources/nls/generic"], function (Generic) {
    "use strict";

    const applicationmessagecreateLocale = function () {
        return {
            root: {
                heading: {
                    ApplicationMessageCreate: "Application Message Create",
                    Help: "Help"
                },
                ApplicationMessageCreate: {
                    Code: "Code",
                    Message: "Message",
                    SummaryText: "Summary Text",
                    Locale: "Locale",
                    Save: "Save",
                    Cancel: "Cancel",
                    Back: "Back"
                },
                Help: {},
                componentHeader: "Application Message",
                generic: Generic,
                header: "Application Message",
                reviewHeader: "Application Message Create Review",
                confirmationMsg: {
                    FINAL_LEVEL_APPROVED: "You have successfully approved the request. Reference Number is {hostReferenceNo}.",
                    MID_LEVEL_APPROVED: "You have successfully approved the request. It is pending for further approval. Reference Number is {referenceNo}.",
                    REJECT_BY_HOST: "Your request has been rejected.",
                    REJECT: "You have rejected the request. Reference Number is {referenceNo}.",
                    INITIATED: "Your request has been initiated successfully. Reference Number is {referenceNo}.",
                    AUTO_AUTH: "Your request has been accepted. Reference Number is {hostReferenceNo}."
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

    return new applicationmessagecreateLocale();
});