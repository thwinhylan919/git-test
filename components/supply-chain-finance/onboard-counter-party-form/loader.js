define([
    "module",
    "text!./onboard-counter-party-form.html",
    "./onboard-counter-party-form",
    "text!./onboard-counter-party-form.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});