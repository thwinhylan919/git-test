define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
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
            getNewModel: function () {
                return {
                    invoiceList: {
                        invoiceNumber: null,
                        invoiceDate: null,
                        invoiceDueDate: null,
                        associatedParty : {
                            id : null,
                            name: null
                        },
                        amount: {
                            amount : null,
                            currency: null
                        },
                        program: {
                            programCode : null,
                            programName: null
                        },
                        taxAmount: 0,
                        totalAmount: {
                            amount : null,
                            currency : null
                        },
                        poNumber: null,
                        purchaseOrderDate: null,
                        paymentTerms: null,
                        shipmentDate: null,
                        discountPercentage: 0,
                        discountAmount: 0,
                        taxPercentage: 0,
                        commodities: [{
                                quantity: null,
                                name: null,
                                description: null,
                                costPerUnit: null,
                                totalCost: null
                            }]
                    }
                };
            }
        };
    };

    return new Model();
});