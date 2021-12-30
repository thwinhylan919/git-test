define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            invoiceTemplatesget: function () {
                const options = {
                    url: "supplyChainFinance/invoiceTemplates"
                };

                return baseService.fetch(options);
            }
        };
    };

    return new Model();
});
