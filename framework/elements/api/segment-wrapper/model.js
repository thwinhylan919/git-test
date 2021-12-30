define(["jquery", "baseService"], function ($, BaseService) {
    "use strict";

    const WrapperModel = function () {
        const baseService = BaseService.getInstance();

        let saveAsDraftDeferred;
        const saveAsDraft = function (deferred) {
            const options = {
                url: "v1/obclpm/listDataSegments/STER/LoanOrig?includeStageInfo=true",
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

        return {
            saveAsDraft: function () {
                saveAsDraftDeferred = $.Deferred();
                saveAsDraft(saveAsDraftDeferred);

                return saveAsDraftDeferred;
            }

        };
    };

    return new WrapperModel();
});