define([], function () {
    "use strict";

    const applicationmessageviewLocale = function () {
        return {
            root: {
                heading: {
                    ApplicationMessageView: "Message Maintenance View",
                    Help: "Help"
                },
                ApplicationMessageView: {
                    Code: "Error Code",
                    Message: "Error Message",
                    SummaryText: "Summary Text",
                    Locale: "Language",
                    Edit: "Edit",
                    Cancel: "Cancel",
                    Back: "Back"
                },
                Help: {
                    note: "Note",
                    helpDescription: "This function enables you to inquire the existing Error Messages defined in the system. You can also modify the text defined for a message code for a particular Language."
                },
                componentHeader: "Message Maintenance"
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

    return new applicationmessageviewLocale();
});