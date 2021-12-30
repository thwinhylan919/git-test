define([
    "module",
    "text!./upi-pending-request.html",
    "./upi-pending-request",
    "text!./upi-pending-request.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});