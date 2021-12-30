define(["ojL10n!resources/nls/generic",
    "ojL10n!resources/nls/world-countries"
], function(Generic, WorldCountries) {
    "use strict";

    const positionByRegion = function() {
        return {
            root: {
                header: "Position By Region",
                labels: {
                    equivalent: "In Equivalent",
                    region: "Region",
                    balance: "Balance",
                    listAriaLabel: "Position By Region List",
                    account : "Accounts",
                    accountsOfRegion : "Accounts of selected region",
                    partyName : "Party Name",
                    accountNumber : "Account Number",
                    pleaseSelect : "Please Select",
                    accountType : "Account Type",
                    accountCheck: {
                        true: "External",
                        false: "Internal"
                    }
                },
                messages: {
                    noItems: "No items to display",
                    noExchangeRate: "Exchange rate not found"
                },
                alt : {
                  countAnchor : "Click to view detailed account positions"
                },
                title : {
                  countAnchor : "Click to view detailed account positions"
                },
                generic: Generic,
                worldCountries : WorldCountries
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

    return new positionByRegion();
});