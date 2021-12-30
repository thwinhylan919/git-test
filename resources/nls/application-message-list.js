define([], function () {
    "use strict";

    const applicationmessagelistLocale = function () {
        return {
            root: {
                heading: {
                    ApplicationMessageSearch: "Message Maintenance Search",
                    Help: "Help"
                },
                ApplicationMessageSearch: {
                    Code: "Error Code",
                    Locale: "Language",
                    CodeTitle: "Click for Code",
                    Message: "Error Message",
                    SummaryText: "Summary Text",
                    Search: "Search",
                    Cancel: "Cancel",
                    clear: "Clear",
                    ApplicationMessageList: "Message Maintenance List",
                    Summary: "Summary",
                    select: "Please select"
                },
                Help: {
                    note: "Note",
                    helpDescription: "This function enables you to inquire the existing Error Messages defined in the system. You can also modify the text defined for a message code for a particular Language."
                },
                info: {
                    noRecordFound: "No such record found."
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

    return new applicationmessagelistLocale();
});