define([
    "module", "text!./mapping-summary-details.html",
    "./mapping-summary-details",
    "text!./mapping-summary-details.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});
