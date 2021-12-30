define([
    "text!./review-split-bill-request.html",
    "./review-split-bill-request"
], function (template, viewModel) {
    "use strict";

    return {
        viewModel: viewModel,
        template: template
    };
});