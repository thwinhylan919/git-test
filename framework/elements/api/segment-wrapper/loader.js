define(["module",
    "text!./segment-wrapper.html",
    "./segment-wrapper",
    "text!./segment-wrapper.css",
    "baseModel"
], function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});