define(["ojL10n!resources/nls/generic"], function(Generic) {
    "use strict";

    const snapShotregistration = function() {
        return {
            root: {
                quickSnapshot: "Quick Snapshot lets you view your important account information in a single click.",
                quickSnapshot2: "Once you enable this,you can view your account balance and recent transactions by clicking on Quick Snapshot on login page.",
                quickSnapshot3: "By enabling Snapshot you are authorizing the bank to store your device ID.",
                enableQuickSnapshot: "Enable Quick Snapshot",
                pleaseAllow: "Allow Futura Bank to enable Snapshot on watch?",
                header: "Quick Snapshot",
                information: "Information",
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

    return new snapShotregistration();
});