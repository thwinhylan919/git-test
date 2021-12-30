define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            financeSearchGet: function (queryParameter) {
                const params = {
                        queryParameter: queryParameter
                    },
                    options = {
                        url: "supplyChainFinance/finances?queryParams={queryParameter}"
                    };

                return baseService.fetch(options, params);
            },

            mePartyGet: function () {
                const params = {},
                    options = {
                        url: "me/party"
                    };

                return baseService.fetch(options, params);
            },

            counterPartiesget: function (queryParameter) {
                const params = {
                        queryParameter: queryParameter
                    },
                    options = {
                        url: "supplyChainFinance/associatedParties?queryParams={queryParameter}"
                    };

                return baseService.fetch(options, params);
            },

            programsget: function (queryParameter) {
                const params = {
                        queryParameter: queryParameter
                    },
                    options = {
                        url: "supplyChainFinance/programs?queryParams={queryParameter}"

                    };

                return baseService.fetch(options, params);
            },

            financeStatusget: function () {
                const params = {},
                    options = {
                        url: "enumerations/scfFinanceStatuses",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            }
        };
    };

    return new Model();
});