define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            enumerationslocaleget: function () {
                const params = {},
                 options = {
                    url: "enumerations/locale",
                    version: "v1"
                };

                return baseService.fetch(options, params);
            },
            applicationMessagescodeput: function (code, payload) {
                const params = { code: code },
                 options = {
                    url: "applicationMessages/{code}",
                    version: "v1",
                    data: payload
                };

                return baseService.update(options, params);
            },
            getNewModel: function () {
                return {
                    createdBy: null,
                    creationDate: null,
                    lastUpdatedBy: null,
                    lastUpdatedDate: null,
                    version: null,
                    entityStatus: null,
                    recordStatus: null,
                    generatedPackageId: null,
                    configPackageId: null,
                    auditSequence: null,
                    message: null,
                    locale: null,
                    factoryShipped: null,
                    summaryText: null,
                    code: null
                };
            }
        };
    };

    return new Model();
});