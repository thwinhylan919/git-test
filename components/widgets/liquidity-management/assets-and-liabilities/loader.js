define(["module",
        "text!./assets-and-liabilities.html",
        "./assets-and-liabilities",
        "text!./assets-and-liabilities.css",
        "baseModel"
    ],
    function(module, template, viewModel, css, BaseModel) {
        "use strict";

        const baseModel = BaseModel.getInstance();

        return {
            viewModel: viewModel,
            template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
        };
    });