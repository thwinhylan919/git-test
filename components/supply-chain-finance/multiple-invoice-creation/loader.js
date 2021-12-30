define([
    "module",
    "text!./multiple-invoice-creation.html",
    "./multiple-invoice-creation",
    "text!./multiple-invoice-creation.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});