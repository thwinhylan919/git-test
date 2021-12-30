define([], function () {
    "use strict";

    const mappingtrainLocale = function () {
        return {
            root: {
                heading: { MappingTrain: "Mapping Train" },
                resourceMap: "{attributeName} Mapping",
                transMap: "Transaction Mapping"
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

    return new mappingtrainLocale();
});