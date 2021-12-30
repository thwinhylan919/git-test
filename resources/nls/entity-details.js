define([], function () {
    "use strict";

    const entitydetailsLocale = function () {
        return {
            root: {
                heading: { EntityDetails: "Entity Details" },
                EntityDetails: {
                    PartyID: "Party ID",
                    PartyName: "Party Name",
                    ModuleName: "Module Name",
                    UserId: "User ID",
                    UserName: "User Name"
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

    return new entitydetailsLocale();
});