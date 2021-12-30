define([], function() {
    "use strict";

    const EntityLocale = function() {
        return {
            root: {
                roles: {
                    currentView: "Your current view",
                    CORP: "Corporate",
                    CORPADMIN: "Corporate Administrator",
                    ADMIN: "Administrator",
                    maker: "Maker",
                    viewer: "Viewer",
                    checker: "Approver",
                    corporateadminchecker: "Administrator Approver",
                    corporateadminmaker: "Administrator Maker",
                    adminchecker: "Approver",
                    adminmaker: "Maker",
                    authadmin: "System Administrator",
                    custom: "My Dashboard",
                    customer: "Default Dashboard"
                },
                entity: {
                    currentView: "Current Entity"

                },
                atmBranch: "Branch",
                changeLanguage: "Change Language"
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

    return new EntityLocale();
});