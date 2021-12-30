define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            invoiceget: function (invoiceRefNo, role) {
                const params = {
                        invoiceRefNo: invoiceRefNo,
                        role: role
                    },
                    options = {
                        url: "/supplyChainFinance/invoices/{invoiceRefNo};role={role}",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },
            acceptPost: function (invoiceId, payload) {
                const params = {
                        invoiceId: invoiceId
                    },
                    options = {
                        url: "supplyChainFinance/invoices/{invoiceId}/accept",
                        data: payload
                    };

                return baseService.update(options, params);
            },
            rejectPost: function (invoiceId, payload) {
                const params = {
                        invoiceId: invoiceId
                    },
                    options = {
                        url: "supplyChainFinance/invoices/{invoiceId}/reject",
                        data: payload
                    };

                return baseService.update(options, params);
            },
            cancelPost: function (invoiceId, payload) {
                const params = {
                        invoiceId: invoiceId
                    },
                    options = {
                        url: "supplyChainFinance/invoices/{invoiceId}/cancel",
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
            downloadInvoice: function (invoiceRefNo, role) {
                const params = {
                        invoiceRefNo: invoiceRefNo,
                        role: role
                    },
                    options = {
                        url: "/supplyChainFinance/invoices/{invoiceRefNo};role={role}?media=application/pdf&mediaFormat=pdf",
                        version: "ext/v1"
                    };

                return baseService.downloadFile(options, params);
            },
            getNewModel: function () {
                return {
                    invoiceDetails: {
                        invoice: {
                            invoiceNumber: null,
                            acceptanceAmount: {
                                currency: null,
                                amount: null
                            },
                            remarks: null,
                            supplierName: null,
                            associatedParty: {
                                name: null
                            },
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
                    },
                    payLoad: {
                        programCode: null,
                        totalAmount: {
                            amount: null,
                            currency: null
                        },
                        counterpartyId: null,
                        invoices: [],
                        role: null
                    }
                };
            }
        };
    };

    return new Model();
});