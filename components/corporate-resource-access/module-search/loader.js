define([
        "module",
        "text!./module-search.html",
        "text!.//module-search.css",
        "baseModel",
        "./module-search"
    ],
    function (module, template, css, BaseModel, viewModel) {
        "use strict";

        const baseModel = BaseModel.getInstance();

        return {
            viewModel: viewModel,
            template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
        };
    });