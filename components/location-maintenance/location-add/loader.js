define(["module", "text!./location-add.html", "./location-add", "text!./location-add.css", "baseModel", "text!./location-add.json"], function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});