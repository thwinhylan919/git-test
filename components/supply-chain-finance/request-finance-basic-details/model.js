define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            counterPartiesget: function (queryParameter) {
                const params = {
                        queryParameter: queryParameter
                    },
                    options = {
                        url: "/supplyChainFinance/associatedParties?queryParams={queryParameter}",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },
            programsget: function (queryParameter) {
                const params = {
                        queryParameter: queryParameter
                    },
                    options = {
                        url: "/supplyChainFinance/programs?queryParams={queryParameter}",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },
            currencyget: function (moduleType) {
                const params = {
                        moduleType: moduleType
                    },
                    options = {
                        url: "/currency?moduleType={moduleType}",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },
            productGet: function (productCode) {
                const params = {
                        productCode: productCode
                    },
                    options = {
                        url: "/supplyChainFinance/programProducts/{productCode}",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            }
        };
    };

    return new Model();
});