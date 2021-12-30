define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            invoiceStatusget: function () {
                const options = {
                    url: "enumerations/scfInvoiceStatuses"
                };

                return baseService.fetch(options);
            }
        };
    };

    return new Model();
});