define([
    "module",
    "text!./create-virtual-multi-currency-account.html",
    "./create-virtual-multi-currency-account",
    "text!./virtual-multi-currency-account.css",
    "text!./review-virtual-multi-currency-account.html",
    "./review-virtual-multi-currency-account",
    "baseModel"
], function (module, transactionInitTemplate, transactionInitViewModel, transactionInitCss, transactionReviewTemplate, transactionReviewViewModel, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return function (config) {
        if (config.type === "init") {
            return {
                viewModel: transactionInitViewModel,
                template: baseModel.transformTemplate(transactionInitTemplate, transactionInitCss, baseModel.getComponentName(module,config))
            };
        }

        return {
            viewModel: transactionReviewViewModel,
            template: baseModel.transformTemplate(transactionReviewTemplate, transactionInitCss, baseModel.getComponentName(module,config))
        };
    };
});