define(["module", "text!./mutual-funds-news.html", "./mutual-funds-news", "text!./mutual-funds-news.css", "baseModel", "text!./mutual-funds-news.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});