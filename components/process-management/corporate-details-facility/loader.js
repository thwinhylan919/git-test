define(["module",
    "text!./corporate-details-facility.html",
    "./corporate-details-facility",
    "text!./corporate-details-facility.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});