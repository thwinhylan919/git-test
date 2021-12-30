define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            invoiceSearchget: function (query, currency, fromAmount, toAmount, fromDate, toDate) {
                const params = {
                    query: query,
                    currency: currency,
                    fromAmount: fromAmount,
                    toAmount: toAmount,
                    fromDate: fromDate,
                    toDate: toDate
                },
                    options = {
                        url: "supplyChainFinance/invoices?queryParams={query}&currency={currency}&fromAmount={fromAmount}&toAmount={toAmount}&fromDate={fromDate}&toDate={toDate}"
                    };

                return baseService.fetch(options, params);
            },

            fetchPdfget: function (query, currency, fromAmount, toAmount, fromDate, toDate) {
                const params = {
                    query: query,
                    currency: currency,
                    fromAmount: fromAmount,
                    toAmount: toAmount,
                    fromDate: fromDate,
                    toDate: toDate
                },
                    options = {
                        url: "supplyChainFinance/invoices?queryParams={query}&currency={currency}&fromAmount={fromAmount}&toAmount={toAmount}&fromDate={fromDate}&toDate={toDate}&media=text/csv&mediaFormat=csv"
                    };

                return baseService.downloadFile(options, params);
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
            counterPartiesget: function (queryParameter) {
                const params = {
                    queryParameter: queryParameter
                },
                    options = {
                        url: "supplyChainFinance/associatedParties?queryParams={queryParameter}"
                    };

                return baseService.fetch(options, params);
            },

            invoiceStatusget: function () {
                const params = {},
                    options = {
                        url: "enumerations/scfInvoiceStatuses",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },
            paymentStatusget: function () {
                const params = {},
                    options = {
                        url: "enumerations/scfPaymentStatuses",
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