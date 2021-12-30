define(["module", "text!./investment-details-widget.html", "./investment-details-widget", "text!./investment-details-widget.css", "baseModel", "text!./investment-details-widget.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});
