define(["module", "text!./set-instruction-details.html", "text!./set-instruction-details.css", "baseModel",
    "./set-instruction-details", "text!./set-instruction-details.json"
], function(module, template, css, BaseModel, viewModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});