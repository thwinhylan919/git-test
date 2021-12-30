define([
    "text!./review-transaction-details.html",
    "./review-transaction-details"
], function (template, viewModel) {
    "use strict";

    return {
        viewModel: viewModel,
        template: template
    };
});