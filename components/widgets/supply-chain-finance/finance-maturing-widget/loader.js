define([
    "module",
    "text!./finance-maturing-widget.html",
    "./finance-maturing-widget",
    "text!./finance-maturing-widget.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});