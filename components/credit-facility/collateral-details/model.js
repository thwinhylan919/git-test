define(["jquery", "baseService"], function ($, BaseService) {
    "use strict";

    const CollateralDetails = function () {
        const baseService = BaseService.getInstance();
        let Deferred;
        const getCollateralDetails = function (liability, collateral, deferred) {
            const options = {
                url: "liabilities/{liability}/collaterals/{collateral}",
                success: function (data) {
                    deferred.resolve(data);
                },
                error: function (data) {
                    deferred.reject(data);
                }
            },
                params = {
                    liability: liability,
                    collateral: collateral
                };

            baseService.fetch(options, params);

        };
        let collateralListDeferred;
        const getCollateralList = function (liability, partyId, branchcode, currencyCode, deferred) {

            const options = {
                url: "liabilities/{liability}/collaterals?partyId=" + partyId + "&branchCode=" + branchcode + "&currencyCode=" + currencyCode,
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
                return new CollateralDetails(modelData);
            },
            getCollateralList: function (liability, partyId, branchcode, currencyCode) {
                collateralListDeferred = $.Deferred();
                getCollateralList(liability, partyId, branchcode, currencyCode, collateralListDeferred);

                return collateralListDeferred;
            },
            getCollateralDetails: function (liability, collateral) {
                Deferred = $.Deferred();
                getCollateralDetails(liability, collateral, Deferred);

                return Deferred;
            },
            fetchLiabilityId: function () {
                liabilityDeferred = $.Deferred();
                fetchLiabilityId(liabilityDeferred);

                return liabilityDeferred;
            }
        };
    };

    return new CollateralDetails();
});
