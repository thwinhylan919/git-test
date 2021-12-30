define([], function () {
    "use strict";

    const walletLocale = function () {
        return {
            root: {
                header: "Wallets",
                description: "Pay friends and family instantly with money in your Futura Bank Wallet you can also pay bills, carry out recharges with your Wallet.",
                proceed: "Sign Up"
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

    return new walletLocale();
});