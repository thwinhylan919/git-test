define([
    "module",
    "text!./facility-application-listing.html",
    "./facility-application-listing",
    "text!./facility-application-listing.css",
    "baseModel"
], function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});