define(["module", "text!./set-structure-details.html", "text!./set-structure-details.css", "baseModel",
    "./set-structure-details", "text!./set-structure-details.json"
], function(module, template, css, BaseModel, viewModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});