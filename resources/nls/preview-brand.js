define(["ojL10n!resources/nls/generic"], function(Generic) {
    "use strict";

    const previewBrand = function() {
        return {
            root: {
                pageTitle: "Page Title",
                menu: "Menu",
                heading: "Themes",
                button: "Button",
                revertToDefault: "Switch to Default Theme",
                informationHeaderText: "Select a theme to change the look of the application",
                bodyText: "Body and information text",
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

    return new previewBrand();
});