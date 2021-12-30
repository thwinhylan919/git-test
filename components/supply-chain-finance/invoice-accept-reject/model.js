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
            mepartyget: function () {
                const params = {},
                    options = {
                        url: "/me/party",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },
            batchpost: function (payload) {
                const params = {},
                    options = {
                        url: "batch"
                    };

                return baseService.batch(options, params, payload);
            },
            getNewModel: function () {
                return {
                    invoice: {
                        invoiceNumber: null,
                        acceptanceAmount: {
                            currency: null,
                            amount: null
                        },
                        remarks: null,
                        supplierName: null,
                        program: {
                            programName: null,
                            role: null
                        },
                        invoiceDueDate: null,
                        totalAmount: {
                            currency: null,
                            amount: null
                        }
                    }
                };
            }
        };
    };

    return new Model();
});