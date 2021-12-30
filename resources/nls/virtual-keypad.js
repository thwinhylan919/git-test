define([], function() {
    "use strict";

    const Locale = function() {
        return {
            root: {
                openKeyboard: "Open Virtual Keypad",
                delete: "Delete",
                tab: "Tab",
                capsLock: "Caps Lock",
                return: "Return",
                shift: "Shift",
                space: "Space"
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

    return new Locale();
});