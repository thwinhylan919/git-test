define(["ojL10n!resources/nls/generic"], function (Generic) {
    "use strict";

    const applicationmessageeditLocale = function () {
        return {
            root: {
                heading: {
                    ApplicationMessageEdit: "Message Maintenance Edit",
                    ApplicationMessageHelp: "Message Maintenance Help"
                },
                ApplicationMessageEdit: {
                    Code: "Error Code",
                    Message: "Error Message",
                    SummaryText: "Summary Text",
                    Locale: "Language",
                    Save: "Save",
                    Cancel: "Cancel",
                    Back: "Back"
                },
                ApplicationMessageHelp: {},
                componentHeader: "Message Maintenance",
                generic: Generic,
                header: "Message Maintenance",
                reviewHeader: "You initiated a request for Message Maintenance. Please review details before you confirm!",
                confirmationMsg: {
                    FINAL_LEVEL_APPROVED: "You have successfully approved the request. Reference Number is {referenceNo}.",
                    MID_LEVEL_APPROVED: "You have successfully approved the request. It is pending for further approval. Reference Number is {referenceNo}.",
                    REJECT_BY_HOST: "Your request has been rejected.",
                    REJECT: "You have rejected the request. Reference Number is {referenceNo}.",
                    INITIATED: "Your request has been initiated successfully. Reference Number is {referenceNo}.",
                    AUTO_AUTH: "Your request has been accepted. Reference Number is {referenceNo}."
                },
                Help: {
                    note: "Note",
                    helpDescription: "This function enables you to inquire the existing Error Messages defined in the system. You can also modify the text defined for a message code for a particular Language."
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

    return new applicationmessageeditLocale();
});