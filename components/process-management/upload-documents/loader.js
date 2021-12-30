define(["module", "text!./upload-documents.html", "./upload-documents", "text!./upload-documents.css", "baseModel"], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});