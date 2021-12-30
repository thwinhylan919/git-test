define(["text!./dashboard-container.html", "./dashboard-container", "text!./dashboard-container.json"], function(template, viewModel) {
    "use strict";

    return {
        viewModel: viewModel,
        template: template
    };
});