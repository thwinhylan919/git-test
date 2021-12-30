define([
    "module",
    "text!./counter-party-list.html",
    "./counter-party-list",
    "text!./counter-party-list.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});