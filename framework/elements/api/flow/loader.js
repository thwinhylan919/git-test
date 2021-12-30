define([
    "text!./flow.html",
    "./flow"
], function(template, viewModel) {
    "use strict";

    return {
        viewModel: viewModel,
        template: template
    };
});