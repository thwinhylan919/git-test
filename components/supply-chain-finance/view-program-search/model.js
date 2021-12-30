define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            programTypesget: function (queryParameter, sortByParameter, count) {
                const params = {
                        queryParameter: queryParameter,
                        sortByParameter: sortByParameter,
                        count: count
                    },
                    options = {
                        url: "/supplyChainFinance/programProducts?queryParams={queryParameter}&sortBy={sortByParameter}&count={count}",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },
            counterPartiesget: function (queryParameter, sortByParameter, count) {
                const params = {
                        queryParameter: queryParameter,
                        sortByParameter: sortByParameter,
                        count: count
                    },
                    options = {
                        url: "/supplyChainFinance/associatedParties?queryParams={queryParameter}&sortBy={sortByParameter}&count={count}",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },
            programsget: function (queryParameter, sortByParameter, count) {
                const params = {
                        queryParameter: queryParameter,
                        sortByParameter: sortByParameter,
                        count: count
                    },
                    options = {
                        url: "/supplyChainFinance/programs?queryParams={queryParameter}&sortBy={sortByParameter}&count={count}",
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