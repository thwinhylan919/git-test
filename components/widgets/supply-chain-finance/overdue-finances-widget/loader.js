define([
    "module",
    "text!./overdue-finances-widget.html",
    "./overdue-finances-widget",
    "text!./overdue-finances-widget.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});