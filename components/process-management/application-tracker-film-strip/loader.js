define([
    "module",
    "text!./application-tracker-film-strip.html",
    "./application-tracker-film-strip",
    "text!./application-tracker-film-strip.css",
    "baseModel"
], function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});