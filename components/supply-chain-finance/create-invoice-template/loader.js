define([
    "text!./create-invoice-template.html",
    "./create-invoice-template"
], function (template, viewModel) {
    "use strict";

    return {
        viewModel: viewModel,
        template: template
    };
});