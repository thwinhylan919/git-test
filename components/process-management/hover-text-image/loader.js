    define(["module", "text!./hover-text-image.html", "./hover-text-image", "text!./hover-text-image.css", "baseModel"], function (module, template, viewModel, css, BaseModel) {
        "use strict";

        const baseModel = BaseModel.getInstance();

        return {
            viewModel: viewModel,
            template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
        };
    });