define([
    "module",
    "text!./review-multiple-invoices.html",
    "./review-multiple-invoices",
    "text!./review-multiple-invoices.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});