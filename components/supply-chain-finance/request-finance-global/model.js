define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            mepartyget: function () {
                const params = {},
                    options = {
                        url: "/me/party",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },
            getNewModel: function () {
                return {
                    payLoad: {
                        programCode: null,
                        totalAmount: {
                            amount: null,
                            currency: null
                        },
                        counterpartyId: null,
                        invoices: [],
                        role: null
                    },
                    navData: {
                        associatedParty: {
                            name: null
                        },
                        program: {
                            name: null
                        },
                        midRate: null,
                        financeFor: "INVOICE",
                        invoiceData: [],
                        currencyCountMap: [],
                        currencyConversionMap: [],
                        totalInvoicesSelected: 0,
                        totalAmountSelected: 0,
                        totalAmountSelectedInvCurrency: 0,
                        invoiceCurrency: null,
                        searchModified: false
                    },
                    validationData: {
                        productCode: null,
                        relation: null
                    }
                };
            }
        };
    };

    return new Model();
});