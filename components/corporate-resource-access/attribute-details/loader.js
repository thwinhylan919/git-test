define([
    "text!./attribute-details.html",
    "./attribute-details"
], function (template, viewModel) {
    "use strict";

    return {
        viewModel: viewModel,
        template: template
    };
});