define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            financesGet: function (queryParameter) {
                const params = {
                    queryParameter: queryParameter
                    },
                    options = {
                        url: "supplyChainFinance/finances?queryParams={queryParameter}",
                        mockedUrl: "framework/json/design-dashboard/supply-chain-finance/finance-maturing-widget.json"
                    };

                return baseService.fetchWidget(options, params);
            },
            currenciesget: function () {
                const options = {
                    url: "currency"
                };

                return baseService.fetch(options);
            }
        };
    };

    return new Model();
});