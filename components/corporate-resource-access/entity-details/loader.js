define([
    "text!./entity-details.html",
    "./entity-details"
], function (template, viewModel) {
    "use strict";

    return {
        viewModel: viewModel,
        template: template
    };
});