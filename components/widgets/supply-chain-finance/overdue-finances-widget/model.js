define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            getFinances: function (query) {
                const params = {
                    query :query
                 },
                 options = {
                    url: "supplyChainFinance/finances?queryParams={query}",
                    mockedUrl: "framework/json/design-dashboard/supply-chain-finance/overdue-finances-widget.json"
                };

                return baseService.fetchWidget(options, params);
            }
        };
    };

    return new Model();
});