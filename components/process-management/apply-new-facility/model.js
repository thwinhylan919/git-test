define(["jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const Model = function() {
        const baseService = BaseService.getInstance();
        let fetchFacilityTypesDeferred;
        const fetchFacilityTypes = function(deferred) {
            const options = {
                url: "creditFacilities/facilityCategories",
                success: function(data) {
                    deferred.resolve(data);
                }
            };

            baseService.fetch(options);
        };

        return {
            liabilityliabilityIdfacilityget: function(partyId, branchCode, currencyCode, liabilityId) {
                const params = {
                        partyId: partyId,
                        branchCode: branchCode,
                        currencyCode: currencyCode,
                        liabilityId: liabilityId
                    },
                    options = {
                        url: "liability/{liabilityId}/facility?partyId={partyId}&branchCode={branchCode}&currencyCode={currencyCode}",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },

            fetchFacilityTypes: function() {
                fetchFacilityTypesDeferred = $.Deferred();
                fetchFacilityTypes(fetchFacilityTypesDeferred);

                return fetchFacilityTypesDeferred;
            }
        };
    };

    return new Model();
});