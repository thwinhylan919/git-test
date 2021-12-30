define(["jquery", "baseService"], function ($, BaseService) {
    "use strict";

    const ChooseFacility = function () {
        const baseService = BaseService.getInstance();
        let fetchPartyRelationsDeferred;
        const fetchPartyRelations = function (deferred) {
            const options = {
                url: "me/party/relations",
                success: function (data) {
                    deferred.resolve(data);
                }
            };

            baseService.fetch(options);
        };
        let fetchPartyDeferred;
        const fetchParty = function (deferred) {
            const options = {
                url: "me/party",
                success: function (data) {
                    deferred.resolve(data);
                }
            };

            baseService.fetch(options);
        };
        let fetchFacilityDeferred;
        const getFacilityList = function (liability, partyId, branchcode, currencyCode, deferred) {

            const options = {
                url: "liabilities/{liability}/facilities?partyId=" + partyId + "&branchCode=" + branchcode + "&currencyCode=" + currencyCode,
                success: function (data) {
                    deferred.resolve(data);
                },
                error: function (data) {
                    deferred.reject(data);
                }
            },
                params = {
                    liability: liability
                };

            baseService.fetch(options, params);

        };
        let Deferred;
        const getFacilityDetails = function (liability, facility, deferred) {
            const options = {
                url: "liabilities/{liability}/facilities/{facility}",
                success: function (data) {
                    deferred.resolve(data);
                },
                error: function (data) {
                    deferred.reject(data);
                }
            },
                params = {
                    liability: liability,
                    facility: facility
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
            getNewModel: function (modelData) {
                return new ChooseFacility(modelData);
            },
            fetchPartyRelations: function () {
                fetchPartyRelationsDeferred = $.Deferred();
                fetchPartyRelations(fetchPartyRelationsDeferred);

                return fetchPartyRelationsDeferred;
            },
            fetchParty: function () {
                fetchPartyDeferred = $.Deferred();
                fetchParty(fetchPartyDeferred);

                return fetchPartyDeferred;
            },
            getFacilityList: function (liability, partyId, branchcode, currencyCode) {
                fetchFacilityDeferred = $.Deferred();
                getFacilityList(liability, partyId, branchcode, currencyCode, fetchFacilityDeferred);

                return fetchFacilityDeferred;
            },
            getFacilityDetails: function (liability, facility) {
                Deferred = $.Deferred();
                getFacilityDetails(liability, facility, Deferred);

                return Deferred;
            },
            fetchLiabilityId: function () {
                liabilityDeferred = $.Deferred();
                fetchLiabilityId(liabilityDeferred);

                return liabilityDeferred;
            }
        };
    };

    return new ChooseFacility();
});
