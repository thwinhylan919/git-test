define(["module", "text!./view-structure-tabular.html", "text!./view-structure-tabular.css", "baseModel",
    "./view-structure-tabular", "text!./view-structure-tabular.json"
], function(module, template, css, BaseModel, viewModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});