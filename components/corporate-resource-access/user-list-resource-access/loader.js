define([
    "text!./user-list-resource-access.html",
    "./user-list-resource-access"
], function (template, viewModel) {
    "use strict";

    return {
        viewModel: viewModel,
        template: template
    };
});