define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            mepartyget: function () {
                const params = {},
                    options = {
                        url: "/me/party",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },
            currencyget: function (moduleType) {
                const params = {
                        moduleType: moduleType
                    },
                    options = {
                        url: "/currency?moduleType={moduleType}",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },
            readTemplate: function (queryParams) {
                const params = {
                    queryParams: queryParams
                    },
                    options = {
                        url: "supplyChainFinance/invoiceTemplates?queryParams={queryParams}",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },
            batchpost: function (payload) {
                const params = {},
                    options = {
                        url: "batch"
                    };

                return baseService.batch(options, params, payload);
            },
            getNewModel: function () {
                return {
                    batchId: null,
                    batchDetailRequestList: [{
                        header: null,
                        uri: null,
                        methodType: null,
                        payLoad: null,
                        sequenceId: null,
                        obdxVersion: null
                    }]
                };
            }
        };
    };

    return new Model();
});