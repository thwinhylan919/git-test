define([
    "module",
    "text!./create-remittance.html",
    "./create-remittance",
    "text!./virtual-identifiers-create.css",
    "text!./review-virtual-identifiers-create.html",
    "./review-virtual-identifiers-create",
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