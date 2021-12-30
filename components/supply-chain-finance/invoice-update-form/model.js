define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
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
            counterPartiesget: function (queryParams) {
                const params = {
                        queryParams: queryParams
                    },
                    options = {
                        url: "supplyChainFinance/associatedParties?queryParams={queryParams}",
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
            mepartyget: function () {
                const params = {},
                    options = {
                        url: "/me/party",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },
            invoiceinvoiceRefNoput: function (invoiceId, payload) {
                const params = {
                        invoiceId: invoiceId
                    },
                    options = {
                        url: "supplyChainFinance/invoices/{invoiceId}",
                        version: "v1",
                        data: payload
                    };

                return baseService.update(options, params);
            },
            getNewModel: function () {
                return {
                    invoiceList: {}
                };
            }
        };
    };

    return new Model();
});