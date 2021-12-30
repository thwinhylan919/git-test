define([
    "module",
    "text!./top-programs-widget.html",
    "./top-programs-widget",
    "text!./top-programs-widget.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});