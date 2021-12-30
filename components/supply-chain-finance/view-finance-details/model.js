define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            financeSearchGet: function (financeId) {
                const params = {
                        financeId: financeId
                    },
                    options = {
                        url: "supplyChainFinance/finances/{financeId}"
                    };

                return baseService.fetch(options, params);
            },

            mePartyGet: function () {
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