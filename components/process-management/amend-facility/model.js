define(["jquery","baseService"], function ($,BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();
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
            liabilityliabilityIdcollateralget: function (partyId, branchCode, currencyCode, liabilityId) {
                const params = {
                    partyId: partyId,
                    branchCode: branchCode,
                    currencyCode: currencyCode,
                    liabilityId: liabilityId
                },
                 options = {
                    url: "liabilities/{liabilityId}/collaterals?partyId={partyId}&branchCode={branchCode}&currencyCode={currencyCode}",
                    version: "v1"
                };

                return baseService.fetch(options, params);
            },
            fetchLiabilityId: function () {
                liabilityDeferred = $.Deferred();
                fetchLiabilityId(liabilityDeferred);

                return liabilityDeferred;
            }
        };
    };

    return new Model();
});