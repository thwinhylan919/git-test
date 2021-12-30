define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            liabilityliabilityIdfacilityget: function (partyId, branchCode, currencyCode, liabilityId) {
                const params = {
                    partyId: partyId,
                    branchCode: branchCode,
                    currencyCode: currencyCode,
                    liabilityId: liabilityId
                },
                 options = {
                    url: "/liability/{liabilityId}/facility?partyId={partyId}&branchCode={branchCode}&currencyCode={currencyCode}",
                    version: "v1"
                };

                return baseService.fetch(options, params);
            }
        };
    };

    return new Model();
});