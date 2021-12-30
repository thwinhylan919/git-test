define([
    "module",
    "text!./loan-application-listing-details.html",
    "./loan-application-listing-details",
    "text!./loan-application-listing-details.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});