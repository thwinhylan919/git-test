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
            downloadInvoice: function (invoiceRefNo, role) {
                const params = {
                    invoiceRefNo: invoiceRefNo,
                    role: role
                },
                 options = {
                    url: "/supplyChainFinance/invoices/{invoiceRefNo};role={role}?media=application/pdf&mediaFormat=pdf",
                    version: "v1"
                };

                return baseService.downloadFile(options, params);
            }

        };
    };

    return new Model();
});