define([
    "module",
    "text!./view-finance-linked-invoices.html",
    "./view-finance-linked-invoices",
    "text!./view-finance-linked-invoices.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});