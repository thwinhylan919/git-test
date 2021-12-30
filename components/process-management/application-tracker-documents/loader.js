define([
    "module",
    "text!./application-tracker-documents.html",
    "./application-tracker-documents",
    "text!./application-tracker-documents.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});