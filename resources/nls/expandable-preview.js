define([], function() {
    "use strict";

    const ExpandablePreviewLocale = function() {
        return {
            root: {
                buttons: {
                    edit: {
                        alt: "Click to edit the current stage",
                        title: "Click to edit this stage"
                    },
                    showMore: "Show More",
                    showLess: "Show Less"
                }
            },
            ar: true,
            fr: true,
            cs: false,
            sv: false,
            en: false,
es :true,
            "en-us": false,
            el: false
        };
    };

    return new ExpandablePreviewLocale();
});