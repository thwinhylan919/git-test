
define([
    "module",
    "text!./attribute-transaction-mapping.html",
    "./attribute-transaction-mapping",
    "text!./attribute-transaction-mapping.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});