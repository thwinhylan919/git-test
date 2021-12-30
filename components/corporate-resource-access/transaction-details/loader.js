define([
    "text!./transaction-details.html",
    "./transaction-details"
], function (template, viewModel) {
    "use strict";

    return {
        viewModel: viewModel,
        template: template
    };
});