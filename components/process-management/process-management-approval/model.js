define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";

    const ProcessManagementApprovalModel = function () {
        const baseService = BaseService.getInstance();

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
            }
        };
    };

    return new ProcessManagementApprovalModel();
});