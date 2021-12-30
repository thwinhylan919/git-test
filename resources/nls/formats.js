define([], function() {
    "use strict";

    const FormatLocale = function() {
        return {
            root: {
                dateFormat: "dd MMM yyyy",
                dateMonthFormat: "dd MMM",
                dateTimeStampFormat: "dd MMM yyyy hh:mm:ss a",
                dateTimehhmmFormat: "dd MMM yyyy hh:mm a",
                timeFormat: "h:mm a",
                monthYearFormat: "MMM yyyy",
                dateTimeFormat: "dd MMM hh:mm a",
                timeStampFormat: "hh:mm:ss"
            },
            ar: false,
            fr: true,
            cs: true,
            sv: true,
            en: false,
es :false,
            "en-us": false,
            el: true
        };
    };

    return new FormatLocale();
});