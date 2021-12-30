define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            requestFinance: function (payload) {
                const params = {},
                    options = {
                        url: "/supplyChainFinance/finances",
                        data: payload
                    };

                return baseService.add(options, params);
            }
        };
    };

    return new Model();
});