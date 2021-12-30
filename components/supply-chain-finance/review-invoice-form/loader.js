define([
    "module",
    "text!./review-invoice-form.html",
    "./review-invoice-form",
    "text!./review-invoice-form.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});