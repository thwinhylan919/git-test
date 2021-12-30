define(["jquery", "baseService"], function ($, BaseService) {
    "use strict";

    const CollateralGroupModel = function () {
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

            baseService.fetch(options,params);
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

        return {
            getNewModel: function (modelData) {
                return new CollateralGroupModel(modelData);
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
            }
        };
    };

    return new CollateralGroupModel();
});
