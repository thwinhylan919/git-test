define([], function() {
    "use strict";

    const Loan = function() {
        return {
            root: {
                header: "Loan Application",
                proceed: "Proceed",
                filmstripText: "Application Categories",
                business: "Grow your business with Futura Bank!",
                offer: "We at Futura Bank offer you best business loans in the country, with complete transparency, minimal documentation and best interest rates."
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

    return new Loan();
});