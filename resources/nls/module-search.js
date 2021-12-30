define([], function () {
    "use strict";

    const modulesearchLocale = function () {
        return {
            root: {
                heading: { Module: "Module" },
                Module: {
                    PartyID: "Party ID",
                    PartyName: "Party Name",
                    ModuleName: "Module Name",
                    UserId: "User ID",
                    UserName: "User Name"
                },
                moduleTypePlaceholder: "Please Select"
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

    return new modulesearchLocale();
});