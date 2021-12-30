define([
    "module",
    "text!./invoice-create-details.html",
    "./invoice-create-details",
    "text!./invoice-create-details.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});