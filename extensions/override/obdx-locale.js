define([
    "ojL10n!resources/nls/obdx-locale",
    "ojL10n!resources/nls/data-types"
], function(locale) {
    "use strict";

    return {
        MOBILE_NO: [{
            type: "regExp",
            options: {
                pattern: "^(\\+\\d{1,3}[- ]?)?\\d{9,11}$",
                messageDetail: locale.messages.MOBILE_NO
            }
        }]
    };
});