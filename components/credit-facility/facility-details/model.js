define(["jquery","baseService"], function ($,BaseService) {
    "use strict";

    const FacilityDetailModel = function () {
        const baseService = BaseService.getInstance();
        let Deferred;
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

        },

        getFacilityList = function (liability, branchCode, partyId ,currencyCode, deferred) {

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
                let groupListDeferred;
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

        let collateralDeferred;
        const getCollaterals = function(liability,collateralgroup,deferred) {
            const options = {
                url:"liabilities/{liability}/collateralgroups/{collateralgroup}",
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            },
            params = {
                liability: liability,
                collateralgroup : collateralgroup
            };

            baseService.fetch(options,params);
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
            getNewModel: function(modelData) {
                return new FacilityDetailModel(modelData);
            },
            getFacilityDetails: function(liability,facility) {
                Deferred = $.Deferred();
                getFacilityDetails(liability,facility, Deferred);

                return Deferred;
            },
            getFacilityList: function(liability, branchCode, partyId ,currencyCode) {
                Deferred = $.Deferred();
                getFacilityList(liability, branchCode, partyId ,currencyCode, Deferred);

                return Deferred;
            },
            getGroupList: function (liability, partyId, branchcode, currencyCode) {
                groupListDeferred = $.Deferred();
                getGroupList(liability, partyId, branchcode, currencyCode, groupListDeferred);

                return groupListDeferred;
            },
            getAllCollaterals: function (partyId, branchCode, currencyCode, liabilityId) {
                allCollateralDeferred = $.Deferred();
                getAllCollaterals(partyId, branchCode, currencyCode, liabilityId, allCollateralDeferred);

                return allCollateralDeferred;
            },
            getCollaterals: function(liability,collateralgroup) {
                collateralDeferred = $.Deferred();
                getCollaterals(liability,collateralgroup,collateralDeferred);

                return collateralDeferred;
            },
            fetchLiabilityId: function () {
                liabilityDeferred = $.Deferred();
                fetchLiabilityId(liabilityDeferred);

                return liabilityDeferred;
            }
        };
    };

    return new FacilityDetailModel();
});
