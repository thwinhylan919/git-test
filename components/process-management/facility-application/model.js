define(["jquery",
    "baseService"], function ($, BaseService) {
        "use strict";

        const Model = function () {
            const baseService = BaseService.getInstance();
            let fetchFacilityTypesDeferred;
            const fetchFacilityTypes = function (deferred) {
                const options = {
                    url: "creditFacilities/facilityCategories",
                    success: function (data) {
                        deferred.resolve(data);
                    }
                };

                baseService.fetch(options);
            };
            let FacilityDeferred;
            const getFacilityDetails = function(liability,facility,deferred) {
                    const options = {
                        url: "liabilities/{liability}/facilities/{facility}",
                        success: function(data) {
                            deferred.resolve(data);
                        },
                        error: function(data) {
                            deferred.reject(data);
                        }
                    },
                    params = {
                        liability: liability,
                        facility:facility
                    };

                baseService.fetch(options, params);

            };
            let liabilityDeferred;
            const fetchLiabilityId = function (deferred) {
                const options = {
                    url: "liabilities",
                    success: function (data) {
                        deferred.resolve(data);
                    }
                };

                baseService.fetch(options);
            };

            return {
                liabilityliabilityIdfacilityget: function (partyId, branchCode, currencyCode, liabilityId) {
                    const params = {
                        partyId: partyId,
                        branchCode: branchCode,
                        currencyCode: currencyCode,
                        liabilityId: liabilityId
                    },
                        options = {
                            url: "/liabilities/{liabilityId}/facilities?partyId={partyId}&branchCode={branchCode}&currencyCode={currencyCode}",
                            version: "v1"
                        };

                    return baseService.fetch(options, params);
                },
                getFacilityDetails: function(liability,facility) {
                    FacilityDeferred = $.Deferred();
                    getFacilityDetails(liability,facility, FacilityDeferred);

                    return FacilityDeferred;
                },
                fetchLiabilityId: function () {
                    liabilityDeferred = $.Deferred();
                    fetchLiabilityId(liabilityDeferred);

                    return liabilityDeferred;
                },
                fetchFacilityTypes: function () {
                    fetchFacilityTypesDeferred = $.Deferred();
                    fetchFacilityTypes(fetchFacilityTypesDeferred);

                    return fetchFacilityTypesDeferred;
                }
            };
        };

        return new Model();
    });