define(["module", "text!./top-bottom-funds-widget.html", "./top-bottom-funds-widget", "text!./top-bottom-funds-widget.css", "baseModel", "text!./top-bottom-funds-widget.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});
