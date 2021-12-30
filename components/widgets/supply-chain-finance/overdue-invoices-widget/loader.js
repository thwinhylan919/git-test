define([
    "module",
    "text!./overdue-invoices-widget.html",
    "./overdue-invoices-widget",
    "text!./overdue-invoices-widget.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});