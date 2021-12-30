define(["jquery", "baseService"], function ($, BaseService) {
    "use strict";

    const ViewApplicationModel = function () {
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
                url: "v1/credit-facility/collateralTypes",
                version: "ext",
                success: function (data) {
                    deferred.resolve(data);
                }
            };

            baseService.fetch(options);
        };
        let FacilityDeferred;
        const getFacilityDetails = function(liability, facility, deferred) {
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
            getNewModel: function (modelData) {
                return new ViewApplicationModel(modelData);
            },
            getFacilityDetails: function(liability,facility) {
                FacilityDeferred = $.Deferred();
                getFacilityDetails(liability,facility, FacilityDeferred);

                return FacilityDeferred;
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
            fetchLiabilityId: function () {
                liabilityDeferred = $.Deferred();
                fetchLiabilityId(liabilityDeferred);

                return liabilityDeferred;
            }
        };
    };

    return new ViewApplicationModel();
});
