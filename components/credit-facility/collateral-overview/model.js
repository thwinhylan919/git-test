define(["jquery", "baseService"], function ($, BaseService) {
    "use strict";

    const CollateralModel = function () {
        const baseService = BaseService.getInstance();
        let Deferred;
        const getGroupList = function (liability, partyId, branchcode, currencyCode, deferred) {
            const options = {
                url: "liabilities/{liability}/collateralgroups?partyId=" + partyId + "&branchCode=" + branchcode + "&currencyCode=" + currencyCode,
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
        let collateralDeferred;
        const getCollaterals = function (liability, collateralgroup, deferred) {
            const options = {
                url: "liabilities/{liability}/collateralgroups/{collateralgroup}",
                success: function (data) {
                    deferred.resolve(data);
                },
                error: function (data) {
                    deferred.reject(data);
                }
            },
                params = {
                    liability: liability,
                    collateralgroup: collateralgroup
                };

            baseService.fetch(options, params);
        };

        let allCollateralDeferred;
        const getAllCollaterals = function (partyId, branchCode, currencyCode, liabilityId, deferred) {
            const options = {
                url: "liabilities/{liabilityId}/collaterals?partyId={partyId}&branchCode={branchCode}&currencyCode={currencyCode}",
                version: "v1",
                success: function (data) {
                    deferred.resolve(data);
                },
                error: function (data) {
                    deferred.reject(data);
                }
            },
                params = {
                    partyId: partyId,
                    branchCode: branchCode,
                    currencyCode: currencyCode,
                    liabilityId: liabilityId
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
        let fetchCollateralTypesDeferred;
        const fetchCollateralTypes = function (deferred) {
            const options = {
                url: "creditFacilities/collateralTypes",
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
                return new CollateralModel(modelData);
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
            getGroupList: function (liability, partyId, branchcode, currencyCode) {
                Deferred = $.Deferred();
                getGroupList(liability, partyId, branchcode, currencyCode, Deferred);

                return Deferred;
            },
            getCollaterals: function (liability, collateralgroup) {
                collateralDeferred = $.Deferred();
                getCollaterals(liability, collateralgroup, collateralDeferred);

                return collateralDeferred;
            },
            fetchCollateralTypes: function () {
                fetchCollateralTypesDeferred = $.Deferred();
                fetchCollateralTypes(fetchCollateralTypesDeferred);

                return fetchCollateralTypesDeferred;
            },
            getAllCollaterals: function (partyId, branchCode, currencyCode, liabilityId) {
                allCollateralDeferred = $.Deferred();
                getAllCollaterals(partyId, branchCode, currencyCode, liabilityId, allCollateralDeferred);

                return allCollateralDeferred;
            },
            fetchLiabilityId: function () {
                liabilityDeferred = $.Deferred();
                fetchLiabilityId(liabilityDeferred);

                return liabilityDeferred;
            }
        };
    };

    return new CollateralModel();
});
