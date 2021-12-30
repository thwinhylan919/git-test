define([
    "module",
    "text!./view-associated-party-details.html",
    "./view-associated-party-details",
    "text!./view-associated-party-details.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});