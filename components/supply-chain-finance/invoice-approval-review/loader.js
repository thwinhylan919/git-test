define([
    "module",
    "text!./invoice-approval-review.html",
    "./invoice-approval-review",
    "text!./invoice-approval-review.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});