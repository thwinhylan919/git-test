define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            getInvoices: function (query, currency) {
                const params = {
                        query: query,
                        currency: currency
                    },
                    options = {
                        url: "supplyChainFinance/invoices?queryParams={query}&currency={currency}",
                        mockedUrl: "framework/json/design-dashboard/supply-chain-finance/invoices-timeline-widget.json"
                    };

                return baseService.fetchWidget(options, params);
            },
            currenciesget: function () {
                const params = {},
                    options = {
                        url: "currency"
                    };

                return baseService.fetch(options, params);
            }
        };
    };

    return new Model();
});