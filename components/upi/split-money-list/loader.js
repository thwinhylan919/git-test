define([
    "module",
    "text!./split-money-list.html",
    "./split-money-list",
    "text!./split-money-list.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});