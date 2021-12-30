define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            invoiceget: function (grouping, queryParameter, sortByParameter, count) {
                const params = {
                        grouping: grouping,
                        queryParameter: queryParameter,
                        sortByParameter: sortByParameter,
                        count: count
                    },
                    options = {
                        url: "aggregator/resource/invoices?data=Amount&grouping={grouping}&q={queryParameter}&sortBy={sortByParameter}&maxRecords={count}",
                        mockedUrl: "framework/json/design-dashboard/supply-chain-finance/top-programs-widget.json",
                        version: "v1"
                    };

                return baseService.fetchWidget(options, params);
            }
        };
    };

    return new Model();
});