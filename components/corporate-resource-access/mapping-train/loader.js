define([
    "text!./mapping-train.html",
    "./mapping-train"
], function (template, viewModel) {
    "use strict";

    return {
        viewModel: viewModel,
        template: template
    };
});