define([
    "module",
    "text!./invoice-creation-home.html",
    "./invoice-creation-home",
    "text!./invoice-creation-home.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});