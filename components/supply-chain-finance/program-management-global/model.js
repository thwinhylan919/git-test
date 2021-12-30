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
            programpost: function (payload) {
                const params = {},
                    options = {
                        url: "/supplyChainFinance/programs",
                        version: "v1",
                        data: payload
                    };

                return baseService.add(options, params);
            },
            programUpdate: function (programCode, payload) {
                const params = {
                        programCode: programCode
                    },
                    options = {
                        url: "/supplyChainFinance/programs/{programCode}",
                        version: "v1",
                        data: payload
                    };

                return baseService.update(options, params);
            },
            mepartyget: function () {
                const params = {},
                    options = {
                        url: "/me/party",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },
            disbursementModeGet: function () {
                const params = {},
                    options = {
                        url: "/scfApplicationParams?key=DISBURSEMENT_MODE",
                        version: "ext/v1"
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
            getNewModel: function () {
                return {
                    programCode: null,
                    programName: null,
                    programProduct: {
                        productCode: null,
                        productDescription: null
                    },
                    associatedParties: [{
                        id: {
                            value: null,
                            displayValue: null
                        },
                        name: null
                    }],
                    role: null,
                    autoAcceptance: false,
                    acceptanceDays: null,
                    autoFinance: false,
                    disbursementCurrency: null,
                    disbursementMode: null,
                    effectiveDate: null,
                    expiryDate: null,
                    status: null
                };
            }
        };
    };

    return new Model();
});