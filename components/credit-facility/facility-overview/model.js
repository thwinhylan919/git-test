define(["jquery", "baseService"], function ($, BaseService) {
    "use strict";

    const FacilityModel = function () {
        const baseService = BaseService.getInstance();
        let Deferred;
        const getFacilityList = function (liability, branchCode, partyId ,currencyCode, deferred) {

            const options = {
                url: "liabilities/{liability}/facilities?partyId=" + partyId+"&branchCode=" + branchCode+"&currencyCode=" + currencyCode,
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
        let fetchCurrenciesDeffered;
        const fetchCurrencies = function (deferred) {
            const options = {
                url: "currency",
                success: function (data) {
                    deferred.resolve(data);
                },
                error: function (data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);
        };
        let facilityTypeDeferred;
        const facilityParty = function (deferred) {
             const options = {
                    url: "creditFacilities/facilityCategories",
                    success: function (data) {
                        deferred.resolve(data);
                    }
                };

            baseService.fetch(options);
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
                return new FacilityModel(modelData);
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
            fetchCurrencies: function () {
                fetchCurrenciesDeffered = $.Deferred();
                fetchCurrencies(fetchCurrenciesDeffered);

                return fetchCurrenciesDeffered;
            },
            facilityParty: function () {
                facilityTypeDeferred = $.Deferred();
                facilityParty(facilityTypeDeferred);

                return facilityTypeDeferred;
            },
            getFacilityList: function (liability, branchCode,partyId,currencyCode) {
                Deferred = $.Deferred();
                getFacilityList(liability, branchCode,partyId,currencyCode, Deferred);

                return Deferred;
            },
            fetchLiabilityId: function () {
                liabilityDeferred = $.Deferred();
                fetchLiabilityId(liabilityDeferred);

                return liabilityDeferred;
            }
        };
    };

    return new FacilityModel();
});
