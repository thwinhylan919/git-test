define([
    "module",
    "text!./access-type.html",
    "./access-type",
    "text!./access-type.css",
    "baseModel"
], function (module,template, viewModel,css,BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});