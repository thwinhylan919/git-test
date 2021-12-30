
define(["module",
    "text!./segment-review.html",
    "./segment-review",
    "text!./segment-review.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {

        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))

    };
});