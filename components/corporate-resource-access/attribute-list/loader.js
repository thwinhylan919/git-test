define([
    "text!./attribute-list.html",
    "./attribute-list"
], function (template, viewModel) {
    "use strict";

    return {
        viewModel: viewModel,
        template: template
    };
});