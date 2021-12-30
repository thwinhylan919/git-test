define([
    "text!./select-role.html",
    "./select-role"
], function (template, viewModel) {
    "use strict";

    return {
        viewModel: viewModel,
        template: template
    };
});