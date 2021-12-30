
define(["module",
    "text!./loan-application-listing-details-review.html",
    "./loan-application-listing-details-review",
    "text!./loan-application-listing-details-review.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {

        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))

    };
});