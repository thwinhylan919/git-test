define([
    "module",
    "text!./invoice-update-form.html",
    "./invoice-update-form",
    "text!./invoice-update-form.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});