define([
    "module",
    "text!./loan-application-listing.html",
    "./loan-application-listing",
    "text!./loan-application-listing.css",
    "baseModel"
], function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});