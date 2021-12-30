define([
    "module",
    "text!./view-invoice-details.html",
    "./view-invoice-details",
    "text!./view-invoice-details.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});