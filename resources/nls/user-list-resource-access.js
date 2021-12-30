define(["ojL10n!resources/nls/generic"], function (Generic) {
    "use strict";

    const userlistresourceaccessLocale = function () {
        return {
            root: {
                heading: { SearchResults: "Search Results" },
                SearchResults: {
                    UserList: "User List",
                    Initials: "Initials",
                    UserName: "User Name",
                    UserNameTitle: "Click for User Name",
                    FullName: "Full Name"
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

    return new userlistresourceaccessLocale();
});