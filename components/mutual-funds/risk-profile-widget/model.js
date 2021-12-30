define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";

    const RiskProfileModel = function () {
        const baseService = BaseService.getInstance();
        let getRiskProfileTypesDeferred;
        const getRiskProfileTypes = function (deferred) {
            const options = {
                url: "riskProfileCategories",
                success: function (data, status, jqXhr) {
                    deferred.resolve(data, status, jqXhr);
                },
                error: function (data, status, jqXhr) {
                    deferred.reject(data, status, jqXhr);
                }
            };

            baseService.fetch(options);
        };

        return {
            getRiskProfileTypes: function () {
                getRiskProfileTypesDeferred = $.Deferred();
                getRiskProfileTypes(getRiskProfileTypesDeferred);

                return getRiskProfileTypesDeferred;
            }
        };
    };

    return new RiskProfileModel();
});