define(["ojL10n!resources/nls/generic"], function(Generic) {
    "use strict";

    const IndexLocale = function() {
        return {
            root: {
                pageTitle: {
                    index: "Futura Bank : Digital Experience"
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

    return new IndexLocale();
});