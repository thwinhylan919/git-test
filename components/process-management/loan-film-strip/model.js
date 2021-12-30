define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";

    const FilmStriprModel = function () {
        const baseService = BaseService.getInstance();

        let fetchProductDetailsDeferred;
        const fetchProductDetails = function (deferred) {
            const options = {
                url: "v1/obclpm/listBusinessProducts",
                version: "ext",
                success: function (data) {
                    deferred.resolve(data);
                },
                error: function (data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);
        };
        let fetchDatasegmentDeferred;
        const fetchDatasegment = function (deferred, productCode) {
            const options = {
                    url: "v1/obclpm/listDataSegments/{productCode}/LoanOrig?includeStageInfo=true",
                    version: "ext",
                    success: function (data) {
                        deferred.resolve(data);
                    },
                    error: function (data) {
                        deferred.reject(data);
                    }
                },
                params = {
                    productCode: productCode
                };

            baseService.fetch(options, params);
        };

        return {
            fetchDatasegment: function (productCode) {
                fetchDatasegmentDeferred = $.Deferred();
                fetchDatasegment(fetchDatasegmentDeferred, productCode);

                return fetchDatasegmentDeferred;
            },
            fetchProductDetails: function () {
                fetchProductDetailsDeferred = $.Deferred();
                fetchProductDetails(fetchProductDetailsDeferred);

                return fetchProductDetailsDeferred;
            }
        };
    };

    return new FilmStriprModel();
});