define(["module", "text!./fund-reports-widget.html", "./fund-reports-widget", "text!./fund-reports-widget.css", "baseModel", "text!./fund-reports-widget.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});