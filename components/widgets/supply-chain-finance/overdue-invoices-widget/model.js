define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            invoicesget: function (query,toDate) {
                const params = {
                    query :query,
                    toDate: toDate
                 },
                 options = {
                    url: "supplyChainFinance/invoices?queryParams={query}&toDate={toDate}",
                    mockedUrl: "framework/json/design-dashboard/supply-chain-finance/overdue-invoices-widget.json"
                };

                return baseService.fetchWidget(options, params);
            }
        };
    };

    return new Model();
});