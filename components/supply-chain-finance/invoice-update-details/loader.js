define([
    "text!./invoice-update-details.html",
    "./invoice-update-details"
], function (template, viewModel) {
    "use strict";

    return {
        viewModel: viewModel,
        template: template
    };
});