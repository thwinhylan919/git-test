define([
    "text!./select-role-invoice.html",
    "./select-role-invoice"
], function (template, viewModel) {
    "use strict";

    return {
        viewModel: viewModel,
        template: template
    };
});