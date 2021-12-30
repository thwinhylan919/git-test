define([
    "module",
    "text!./create-program-parameters.html",
    "./create-program-parameters",
    "text!./create-program-parameters.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});