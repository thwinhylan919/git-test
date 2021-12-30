define([
    "module",
    "text!./review-invoice-creation-form.html",
    "./review-invoice-creation-form",
    "text!./review-invoice-creation-form.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});