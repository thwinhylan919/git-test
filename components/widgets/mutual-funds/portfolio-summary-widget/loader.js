define(["module", "text!./portfolio-summary-widget.html", "./portfolio-summary-widget", "text!./portfolio-summary-widget.css", "baseModel", "text!./portfolio-summary-widget.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});
