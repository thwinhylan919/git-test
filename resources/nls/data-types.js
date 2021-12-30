define([], function() {
    "use strict";

    const DataTypeLocale = function() {
        return {
            root: {
                ALPHANUMERIC: "[a-zA-Z0-9]*",
                ALPHANUMERIC_WITH_SPACE: "[a-zA-Z0-9 ]*",
                NUMBERS: "[0-9]*",
                DECIMALS: "^[0-9]*\.?[0-9]+$",
                ALPHABETS: "[a-zA-Z]*",
                ALPHABETS_WITH_SPACE: "[a-zA-Z ]*",
                ALPHABETS_WITH_SOME_SPECIAL: "[a-zA-Z\-']*",
                LOWER_ALPHABETS: "[a-z]*",
                UPPER_ALPHABETS: "[A-Z]*",
                LOWER_ALPHABETS_WITH_SPACE: "[a-z ]*",
                UPPER_ALPHABETS_WITH_SPACE: "[A-Z ]*",
                ALPHANUMERIC_WITH_SPECIAL: "[a-zA-Z0-9 \%\&\:\,\)\(\.\_'\-\//;]*",
                ALPHANUMERIC_WITH_HYPHEN: "[a-zA-Z0-9\-]*",
                ALPHANUMERIC_WITH_SOME_SPECIAL: "[a-zA-Z0-9 \&\:\$\,\.\_\?]*",
                SWIFT: "[a-zA-Z0-9\- \+\:,\)\(\.'\?\/]*",
                SWIFT_X: "[A-Za-z0-9\/\\-\?\:\(\)\.\,\'\+\\s\r\n]*",
                SWIFT_Y: "[A-Za-z0-9\/\\-\?\:\(\)\.\,\'\+\\s\=\!\"\%\&\*\<\>\;]*",
                SWIFT_Z: "[A-Za-z0-9\/\\-\?\:\(\)\.\,\'\+\\s\_\=\!\"\%\&\*\<\>\;\@\#\{\r\n]*",
                ALPHANUMERIC_WITH_ALL_SPECIAL: "[a-zA-Z0-9\- \=\&\#\*\+\:,\)\@(\.\!\$_\|'\`\?\[\\\]\/]*",
                SPACE_WITH_ALL_SPECIAL: "[!\"\#\$'\(\)\*\+\.\\\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~\\\\-]*",
                FREE_TEXT: ".*"
            },
            ar: false,
            fr: false,
            cs: false,
            sv: false,
            en: false,
es :true,
            "en-us": false,
            el: false
        };
    };

    return new DataTypeLocale();
});