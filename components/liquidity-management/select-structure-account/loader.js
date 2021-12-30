define(["module", "text!./select-structure-account.html", "./select-structure-account", "text!./select-structure-account.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});