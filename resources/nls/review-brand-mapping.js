define([
    "ojL10n!resources/nls/generic"
], function (Generic) {
    "use strict";

    const ReviewBrandMapping = function () {
        return {
            root: {
                generic: Generic,
                pageHeader: "Review Brand Mapping",
                header: "Brand Mapping",
                createHeader: "Create Brand Mapping",
                deleteHeader: "Delete Brand Mapping",
                labels: {
                    mappingType: "Mapping Type",
                    mappingValue: "Mapping Value",
                    brand: "Brand"
                },
                mappingType: {
                    USER: "User",
                    PARTY: "Party",
                    SEGMENT: "Segment",
                    ROLE: "User Type",
                    BANK: "Entity"
                },
                reviewMapping: "Review brand mapping before you confirm!"
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

    return new ReviewBrandMapping();
});