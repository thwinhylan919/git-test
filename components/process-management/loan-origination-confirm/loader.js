define(["module", "text!./loan-origination-confirm.html", "./loan-origination-confirm", "text!./loan-origination-confirm.css", "baseModel"], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});