define([
    "ojL10n!resources/nls/origination-generic"
], function(Generic) {
    "use strict";

    const dashboardLocale = function() {
        return {
            root: {
                additionalPreferences: "Additional Preferences",
                pending: "Action Required",
                noAction: "Please contact any Futura Bank center regarding the processing of your application.",
                viewListContainer: "View List Container",
                viewListContainerTitle: "Click For View List Container",
                accountConfigurationPendingActions: "Account Configuration",
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

    return new dashboardLocale();
});