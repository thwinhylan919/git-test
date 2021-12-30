define(["module", "text!./edit-structure-instructions.html", "text!./edit-structure-instructions.css", "baseModel",
    "./edit-structure-instructions", "text!./edit-structure-instructions.json"
], function(module, template, css, BaseModel, viewModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});