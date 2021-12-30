define(["module",
    "text!./authorize-consent.html",
    "./authorize-consent", "text!./authorize-consent.css", "baseModel"], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});