define(["module", "text!./create-structure.html", "text!./create-structure.css", "baseModel",
    "./create-structure", "text!./create-structure.json"
], function(module, template, css, BaseModel, viewModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});