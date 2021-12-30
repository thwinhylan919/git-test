define([
    "module",
    "text!./invoice-accept-reject.html",
    "./invoice-accept-reject",
    "text!./invoice-accept-reject.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});