define([
    "module",
    "text!./request-finance-invoice-list.html",
    "./request-finance-invoice-list",
    "text!./request-finance-invoice-list.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});