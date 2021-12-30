define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            invoiceSearchget: function (query) {
                const params = {
                        query: query
                    },
                    options = {
                        url: "supplyChainFinance/invoices?queryParams={query}"
                    };

                return baseService.fetch(options, params);
            },
            currencyRateget: function (ccy1Code, ccy2Code) {
                const params = {
                        ccy1Code: ccy1Code,
                        ccy2Code: ccy2Code
                    },
                    options = {
                        url: "/forex/rates?ccy1Code={ccy1Code}&ccy2Code={ccy2Code}"
                    };

                return baseService.fetch(options, params);
            }
        };
    };

    return new Model();
});