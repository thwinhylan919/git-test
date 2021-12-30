define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            counterPartiesget: function (queryParams) {
                const params = {
                    queryParams: queryParams
                },
                    options = {
                        url: "supplyChainFinance/associatedParties?queryParams={queryParams}",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },
            mepartyget: function () {
                const params = {},
                    options = {
                        url: "/me/party",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            }
        };
    };

    return new Model();
});