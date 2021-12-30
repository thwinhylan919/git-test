define([
    "module",
    "text!./loan-application-listing-document-details.html",
    "./loan-application-listing-document-details",
    "text!./loan-application-listing-document-details.css",
    "baseModel"
], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});