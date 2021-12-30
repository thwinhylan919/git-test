define([ "ojL10n!resources/nls/generic"], function (Generic) {
    "use strict";

    const addcollateralLocale = function () {
        return {
            root: {
                heading: { addcollateral: "Add Collateral" },
                addcollateral: {
                    PleasespecifycollateralType: "Please specify collateral Type",
                    PlantandMachinery: "Plant and Machinery",
                    Vehicle: "Vehicle",
                    MarketableSecurities: "Marketable Securities",
                    Whatwouldyoudescribethiscollateralas: "What would you describe this collateral as?",
                    Whatistheestimatedvalueofthiscollateral: "What is the estimated value of this collateral?",
                    Whatisthepurposeofthiscollateral: "What is the purpose of this collateral?",
                    Anyothercomments: "Any other comments",
                    Add: "Add",
                    update: "Update",
                    description:"Description",
                    Enterestimatedcollateralvalue:"Enter estimated collateral value",
                    purpose:"Purpose",
                    comments:"Comments"
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

    return new addcollateralLocale();
});