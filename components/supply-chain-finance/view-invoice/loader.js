define([
    "module",
    "text!./view-invoice.html",
    "./view-invoice",
    "text!./view-invoice.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});