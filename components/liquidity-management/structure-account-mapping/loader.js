define(["module","text!./structure-account-mapping.html",
    "./structure-account-mapping",
    "text!./structure-account-mapping.css", "baseModel",
    "text!./structure-account-mapping.json"
], function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});