define(["ojL10n!resources/nls/generic"], function(Generic) {
    "use strict";

    const positionWiseCurrency = function() {
        return {
            root: {
                header: {
                    currencyPosition: "Position By Currency",
                    currencyPopUpHeader: "Position By Currency - {currency}"
                },
                tableLabels: {
                    partyName: "Party Name",
                    accountNumber: "Account Number",
                    accountType: "Account Type",
                    netBalance: "Net Balance"
                },
                labels: {
                    currency: "Currency",
                    currencyPositionDetailsTable: "Table for currency position",
                    balance: "Balance",
                    accountCheck: {
                        true: "External",
                        false: "Internal"
                    }
                },
                alt: {
                    amount: "click here to view accounts"
                },
                title: {
                    amount: "click here to view accounts"
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

    return new positionWiseCurrency();
});